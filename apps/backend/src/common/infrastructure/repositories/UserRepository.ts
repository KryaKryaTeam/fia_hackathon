import { IUserRepository } from '@/authorization/application/bounds/IUserRepository';
import { BaseRepository } from './BaseRepository';
import { UserEntity } from '@/authorization/domain/entities/User.entity';
import { UserMapper } from '@/authorization/application/mappers/UserMapper';
import { Inject, Injectable } from '@nestjs/common';
import { MapperTokens } from '@/common/Tokens';
import { UserSchema } from '@/schemas/User.schema';

@Injectable()
export class UserRepository
  extends BaseRepository<UserSchema>
  implements IUserRepository
{
  @Inject(MapperTokens.UserMapper)
  private userMapper: UserMapper;

  protected _entitySchema = UserSchema;

  async findByEmail(email: string): Promise<UserEntity | null> {
    const res = await this.repository.findOne({ email });
    if (!res) return null;

    return this.userMapper.toEntity(res);
  }

  async findById(userId: string): Promise<UserEntity | null> {
    const res = await this.repository.findOne({ id: userId });
    if (!res) return null;

    return this.userMapper.toEntity(res);
  }

  async save(user: UserEntity): Promise<void> {
    const schemaData = this.userMapper.toSchema(user);
    await this.repository.upsert(schemaData);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ email });
    return count > 0;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.repository.count({ username });
    return count > 0;
  }

  async getPageOfUsers(page: number): Promise<UserEntity[]> {
    const res = await this.repository.find(
      {},
      {
        offset: 20 * page,
        limit: 20,
      },
    );

    return res.map((el) => this.userMapper.toEntity(el));
  }

  async getUsersWithSimillarEmailByPages(
    page: number,
    email: string,
  ): Promise<UserEntity[]> {
    const qb = this.repository.createQueryBuilder('user');

    const result = await qb
      .select('*')
      .where('user.email ILIKE ?', [`%${email}%`])
      .orWhere('user.email % ?', [email])
      .orderBy({ [`similarity(user.email, '${email}')`]: 'DESC' })
      .limit(20)
      .offset(page * 20)
      .getResult();

    if (!result || result.length === 0) return [];

    return result.map((el) => this.userMapper.toEntity(el));
  }
}
