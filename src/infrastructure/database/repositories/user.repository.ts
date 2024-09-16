import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '@dto/user/create-user.dto';
import { ListUserDto } from '@dto/user/list-user.dto';
import { PageOptionsDto } from '@dto/page-options.dto';
import { UpdateUserDto } from '@dto/user/update-user.dto';
import { User } from '@entities/user.entity';
import { IUserRepository } from '@domain/repositories/IUser.repository';
import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';

export default class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async findAll(
    pageOptionsDto: PageOptionsDto
  ): Promise<SelectQueryBuilder<User>> {
    return this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.posts', 'post')
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
      .select([
        'users.id',
        'users.password',
        'users.email',
        'users.fullname',
        'users.age'
      ])
      .where('users.email= :email', { email: email })
      .getOne();
  }
}
