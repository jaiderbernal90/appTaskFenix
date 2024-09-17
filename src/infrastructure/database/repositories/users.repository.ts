import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { CreateUserDto } from '@/src/application/dto/user/create-user.dto';
import { ListUserDto } from '@/src/application/dto/user/list-user.dto';
import { PageOptionsDto } from '@dto/page-options.dto';
import { UpdateUserDto } from '@/src/application/dto/user/update-user.dto';
import { User } from '@entities/user.entity';
import { IUsersRepository } from '@/src/domain/repositories/IUsers.repository';

export default class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async findAll(
    pageOptionsDto: PageOptionsDto
  ): Promise<SelectQueryBuilder<User>> {
    return this.userRepository
      .createQueryBuilder('users')
      .orderBy('users.id', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.id= :id', { id: id })
      .getOne();
  }

  async delete(id: number): Promise<UpdateResult> {
    return await this.userRepository.softDelete(id);
  }

  async create(body: CreateUserDto): Promise<ListUserDto> {
    return await this.userRepository.save(body);
  }

  async update(id: number, body: UpdateUserDto): Promise<UpdateResult> {
    return await this.userRepository.update(id, body);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('users')
      .select(['users.id', 'users.password', 'users.email', 'users.fullname'])
      .where('users.email= :email', { email: email })
      .getOne();
  }
}
