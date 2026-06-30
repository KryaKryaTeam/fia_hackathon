import { Body, Controller, Get, Patch, Version } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { GetProfileRes } from '../dtos/GetPublicProfileRes';
import { Secure } from '../guards/auth/auth.guard';
import { UpdateUserAdditionalDataDto } from '../dtos/UpdateUserAdditionalData';
import { UpdateAdditionalDataCommand } from '@/authorization/application/useCases/UpdateAdditionalData.command';
import { UpdateAvatarCommand } from '@/authorization/application/useCases/UpdateAvatar.command';
import { UpdateAvatarReq } from '../dtos/UpdateAvatarReq';
import { UserId } from '../decorators/user.decorator';
import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { AllowRoles } from '../guards/role/role.guard';
import { RoleEnum } from '@/types/RoleEnum';
import { SetRoleToAUserCommand } from '@/authorization/application/useCases/SetRoleToAUser.command';
import { UpdateRoleBodyDto } from '../dtos/UpdateRoleBody.dto';
import { GetUsersByEmailQuery } from '@/authorization/application/useCases/GetUsersByEmail.query';
import { GetProfileQuery } from '@/authorization/application/useCases/GetProfile.query';

@Controller('user')
export class UserController {
  constructor(
    private getUsersByEmailQuery: GetUsersByEmailQuery,
    private updateUserAdditionalDataCommand: UpdateAdditionalDataCommand,
    private getProfileQuery: GetProfileQuery,
    private updateAvatarCommand: UpdateAvatarCommand,
    private setRoleToAUserCommand: SetRoleToAUserCommand,
  ) {}

  @Get('/me')
  @Version('1')
  @Secure()
  @ApiResponse({ type: GetProfileRes, status: 200 })
  async getUserPrivateData(@UserId() id: string) {
    return await this.getProfileQuery.execute({ user_id: id });
  }

  // @Get('/users/:page')
  // @Version('1')
  // @Secure()
  // async getUsersPage(
  //   @Param() pageDto: PageQueryDto,
  //   @Query() dto: GetUsersPageFilterDto,
  // ) {
  //   return await this.getUsersByEmailQuery.execute({
  //     page: pageDto.page,
  //     email: dto.email,
  //   });
  // }

  @Patch('/additional')
  @Version('1')
  @Secure()
  @ApiBody({ type: UpdateUserAdditionalDataDto, required: true })
  async updateUserAdditionalData(
    @Body() body: UpdateUserAdditionalDataDto,
    @UserId() id: string,
  ) {
    await this.updateUserAdditionalDataCommand.execute({
      data: body,
      id,
    });
  }

  @Patch('/avatar')
  @Version('1')
  @Secure()
  @ApiBody({ type: UpdateAvatarReq })
  async updateAvatar(@Body() body: UpdateAvatarReq, @UserId() id: string) {
    await this.updateAvatarCommand.execute({
      avatar: body.avatar,
      id,
    });
  }

  @Patch('/role')
  @Version('1')
  @Secure()
  @AllowRoles([RoleEnum.ADMIN])
  @ApiBody({ type: UpdateRoleBodyDto })
  async updateRole(
    @UserId() actor: UserEntity,
    @Body() dto: UpdateRoleBodyDto,
  ) {
    return await this.setRoleToAUserCommand.execute({
      actor,
      role: dto.role,
      userToChangeId: dto.userId,
    });
  }
}
