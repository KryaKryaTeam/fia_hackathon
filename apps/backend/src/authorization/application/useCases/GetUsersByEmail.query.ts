// import { Inject } from '@nestjs/common';
// import { IUserForAdminList } from '@/authorization/domain/entities/User.entity';
// import { Query } from '@/common/application/Query';
// import { ReposTokens } from '@/common/Tokens';
// import type { IUserRepository } from '../bounds/IUserRepository';
// import { ApiError, CommonErrors } from '@/error/ApiError';

// interface GetUsersByEmailQueryInput {
//   page: number;
//   email?: string;
// }

// export class GetUsersByEmailQuery extends Query<
//   GetUsersByEmailQueryInput,
//   IUserForAdminList[]
// > {
//   @Inject(ReposTokens.UserRepository)
//   private readonly userRepository: IUserRepository;
//   async implementation(
//     data: GetUsersByEmailQueryInput,
//   ): Promise<IUserForAdminList[]> {
//     if (!data.email || data.email.length < 3) {
//       const users = await this.userRepository.getPageOfUsers(data.page);
//       if (!users || users.length == 0)
//         ApiError.throw(CommonErrors.PAGE_IS_EMPTY);

//       return users.map((user) => user.forAdminList);
//     }

//     const users = await this.userRepository.getUsersWithSimillarEmailByPages(
//       data.page,
//       data.email,
//     );

//     if (!users || users.length == 0) ApiError.throw(CommonErrors.PAGE_IS_EMPTY);

//     return users.map((user) => user.forAdminList);
//   }
// }
