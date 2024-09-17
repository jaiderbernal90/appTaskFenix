import { UpdateUserDto } from '@/src/application/dto/user/update-user.dto';
import { ListUserDto } from '../../dto/user/list-user.dto';
import { ICrudService } from './ICrudService.interface';
import { CreateUserDto } from '@/src/application/dto/user/create-user.dto';
import { IResponse } from '../IResponse.interface';

export const USERS_SERVICE_TOKEN = 'USERS_SERVICE_TOKEN';
export interface IUserService extends ICrudService<ListUserDto> {
  update(id: number, body: UpdateUserDto): Promise<IResponse<ListUserDto>>;
  create(body: CreateUserDto): Promise<IResponse<ListUserDto>>;
}
