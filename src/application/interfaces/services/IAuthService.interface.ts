import { LoginDto } from "src/application/dto/auth/login.dto";
import { RegisterDto } from "src/application/dto/auth/register.dto";
import { IResponseToken } from "../IResponseToken.interface";
import { ListUserDto } from "src/application/dto/user/list-user.dto";
import { IResponse } from "../IResponse.interface";

export const AUTH_SERVICE_TOKEN = 'AUTH_SERVICE_TOKEN';

export interface IAuthService {
    login(data:LoginDto): Promise<IResponseToken>;
    register(user: RegisterDto): Promise<IResponse<ListUserDto>>;
}