import { CreateApplicationCommand } from '@/application/application/commands/CreateApplication.command';
import { GetMyApplicationQuery } from '@/application/application/commands/GetMyApplications.query';
import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { UserId } from '@/authorization/infrastructure/decorators/user.decorator';
import { Secure } from '@/authorization/infrastructure/guards/auth/auth.guard';
import { Body, Controller, Get, Inject, Post, Version } from '@nestjs/common';
import { CreateApplicationBody } from '../dtos/CreateApplicationBody.dto';
import { AddressObject } from '@/application/domain/objects/Address.object';
import { LocationObject } from '@/application/domain/objects/Location.object';
import { ApiResponse } from '@nestjs/swagger';
import { CreateApplicationResponse } from '../dtos/CreateApplicationResponse.dto';

@Controller('/application')
export class ApplicationController {
  @Inject() private readonly createApplicationCommand: CreateApplicationCommand;
  @Inject() private readonly getMyApplicationsQuery: GetMyApplicationQuery;

  @Post()
  @Secure()
  @Version('1')
  @ApiResponse({ status: 201, type: () => CreateApplicationResponse })
  async createApplication(
    @UserId() user: UserEntity,
    @Body() body: CreateApplicationBody,
  ) {
    return await this.createApplicationCommand.execute({
      user,
      ...body,
      address: body.address ? AddressObject.create(body.address) : undefined,
      location: body.location
        ? LocationObject.create({
            latitude: body.location.lat,
            longitude: body.location.long,
          })
        : undefined,
    });
  }

  @Get('my')
  @Secure()
  @Version('1')
  async getMyApplications(@UserId() user: UserEntity) {
    return await this.getMyApplicationsQuery.execute({ user });
  }
}
