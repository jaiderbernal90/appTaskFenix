import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "src/application/dto/user/create-user.dto";
import { ListUserDto } from "src/application/dto/user/list-user.dto";
import { PageOptionsDto } from "src/application/dto/page-options.dto";
import { UpdateUserDto } from "src/application/dto/user/update-user.dto";
import { User } from "src/domain/entities/user.entity";
import { IUserRepository } from "src/domain/repositories/IUser.repository";
import { Repository, SelectQueryBuilder, UpdateResult } from "typeorm";

export default class UserRepository implements IUserRepository {

    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async findAll(pageOptionsDto: PageOptionsDto): Promise<SelectQueryBuilder<User>> {
        return this.userRepository.createQueryBuilder("users")
            .leftJoinAndSelect('users.posts', 'post')
            .orderBy("users.id", pageOptionsDto.order)
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);
    }

    async findOne(id: number): Promise<User> {
        return await this.userRepository.createQueryBuilder("users")
            .where("users.id= :id", { id: id })
            .getOne();
    }

    async delete(id: number): Promise<UpdateResult> {
        return await this.userRepository.softDelete(id);
    }

    async create(body: CreateUserDto): Promise<ListUserDto> {
        return await this.userRepository.save(body);
    }

    async update(id:number, body: UpdateUserDto): Promise<UpdateResult> {
        return await this.userRepository.update(id, body);
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userRepository.createQueryBuilder("users").select(['users.id','users.password','users.email','users.fullname','users.age'])
            .where("users.email= :email", { email: email })
            .getOne();
    }
}
