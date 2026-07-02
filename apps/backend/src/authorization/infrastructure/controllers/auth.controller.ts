import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  Response,
  Version,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import type {
  Response as ExpressResponse,
  Request as ExpressRequest,
} from 'express';
import { ConfigService } from '@nestjs/config';

import { LoginCommand } from '@/authorization/application/useCases/Login.command';
import { RefreshCommand } from '@/authorization/application/useCases/Refresh.command';
import { GetCSRFToken } from '@/authorization/application/useCases/GetCSRFToken.command';

import { CreateUserLocal } from '../dtos/CreateUserLocal';
import { LoginResponse } from '../dtos/LoginResponse';
import { RefreshResponse } from '../dtos/RefreshResponse';
import { Secure } from '../guards/auth/auth.guard';
import { LoginQueryParams } from '../dtos/LoginQueryParams';
import { ApiError, UserErrors } from '@/error/ApiError';

@Controller('auth')
export class AuthController {
  constructor(
    // NestJS автоматично заінжектує всі usecases завдяки AutoScannerModule
    private readonly loginCommand: LoginCommand,
    private readonly refreshCommand: RefreshCommand,
    private readonly getCSRFTokenCommand: GetCSRFToken,
    private readonly configurationService: ConfigService,
  ) {}

  @Post('/login')
  @Version('1')
  @ApiBody({ type: CreateUserLocal, required: false })
  @ApiResponse({ type: LoginResponse, status: 201 })
  async login(
    @Query() { state, code, provider }: LoginQueryParams,
    @Body() body: CreateUserLocal,
    @Response({ passthrough: true }) res: ExpressResponse,
    @Request() req: ExpressRequest,
  ) {
    if (!provider || !state)
      ApiError.throw(UserErrors.PROVIDER_OR_STATE_IS_UNDEFINED);

    const csrfProtected = req.cookies.csrf == state;
    if (!csrfProtected) ApiError.throw(UserErrors.CSRF_PROTECTION_FAILED);

    if (!body.code && !code && !body.password)
      ApiError.throw(UserErrors.CREDENTIALS_ARE_UNDEFINED);

    const _code = (body.code || code) as string;

    const result = await this.loginCommand.execute({
      loginData: { token: _code, ...body },
      type: provider,
    });

    res.cookie(
      'refresh',
      result.refreshToken,
      this.configurationService.getOrThrow('cookie'),
    );

    return {
      accessToken: result.accessToken,
      userExistsBefore: result.userExists,
    };
  }

  @Post('/refresh')
  @Version('1')
  @ApiResponse({ type: RefreshResponse, status: 200 })
  async refresh(
    @Request() req: ExpressRequest, // Оновив @Req() на стандартний @Request() для консистентності
    @Response({ passthrough: true }) res: ExpressResponse, // Оновив @Res() на @Response()
  ) {
    const { refresh } = req.cookies as { refresh: string };
    if (!refresh) ApiError.throw(UserErrors.REFRESH_TOKEN_IS_INVALID);

    const result = await this.refreshCommand.execute(refresh);

    res.cookie(
      'refresh',
      result.refreshToken,
      this.configurationService.getOrThrow('cookie'),
    );

    return {
      accessToken: result.accessToken,
    };
  }

  @Put('/logout')
  @Version('1')
  @Secure()
  logout(@Response({ passthrough: true }) res: ExpressResponse) {
    res.clearCookie('refresh', this.configurationService.getOrThrow('cookie'));
  }

  @Get('/csrf')
  @Version('1')
  async csrf(@Response({ passthrough: true }) res: ExpressResponse) {
    const token = await this.getCSRFTokenCommand.execute(null);

    res.cookie('csrf', token, this.configurationService.getOrThrow('cookie'));

    return { csrf: token };
  }
}
