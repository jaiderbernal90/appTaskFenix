import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserService } from '../interfaces/services/IUserService.interface';
import { PageOptionsDto } from '../dto/page-options.dto';
import { PageDto } from '../dto/page.dto';
import { PageMetaDto } from '../dto/page-meta.dto';
import { ListUserDto } from '../dto/user/list-user.dto';
import UserRepository from 'src/infrastructure/database/repositories/user.repository';
import { UpdateUserDto } from '../dto/user/update-user.dto';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { IResponse } from '../interfaces/IResponse.interface';
import { generateHash } from '../utils/handleBcrypt';

@Injectable()
export class UserService implements IUserService {

    constructor(private readonly repository: UserRepository) { }

    async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<ListUserDto>> {
        const queryBuilder = await this.repository.findAll(pageOptionsDto);

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

        return new PageDto(entities, pageMetaDto);
    }

    async findOne(id: number): Promise<ListUserDto> {
        const data = await this.repository.findOne(id);
        if (!data) throw new NotFoundException('No existe el usuario con el id ' + id);
        return data;
    }

    async update(id: number, body: UpdateUserDto): Promise<IResponse<ListUserDto>> {   
        const data = await this.repository.findOne(id);
        
        if (!data) throw new NotFoundException({message: 'No existe el usuario solicitado'});

        const { password } = body;
        const plainToHash = await generateHash(password);
        body = {...body, password:plainToHash};
        
        await this.repository.update(id, body);
        
        return { message: 'Usuario actualizado exitosamente', data: await this.repository.findOne(id) }; 
    }

    async create(body: CreateUserDto): Promise<IResponse<ListUserDto>> {
        const { password } = body;
        const plainToHash = await generateHash(password);
        body = {...body, password:plainToHash};
        
        const data = await this.repository.create(body);
    
        return { message: 'Usuario registrado exitosamente', data: data };
    }

    async remove(id: number): Promise<IResponse<ListUserDto>> {
        const data = await this.repository.findOne(id);
        if (!data) throw new NotFoundException({ message: 'No existe el usuario solicitado' });
        await this.repository.delete(id);
        return { message: 'Usuario eliminado exitosamente', data: data };
    }
}
