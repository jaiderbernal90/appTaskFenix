import { ListUserDto } from "src/application/dto/user/list-user.dto";
import { ICrudRepository } from "./ICrud.repository";
import { UpdateUserDto } from "src/application/dto/user/update-user.dto";
import { CreateUserDto } from "src/application/dto/user/create-user.dto";
import { UpdateResult } from "typeorm";
import { User } from "../entities/user.entity";

export interface IUserRepository extends ICrudRepository<ListUserDto>{
    create(body: CreateUserDto): Promise<ListUserDto>;
    update(id:number, body: UpdateUserDto): Promise<UpdateResult>;
    findByEmail(email:string): Promise<User>
} 