import { Body, Controller, Inject, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { IAuthService } from '../interfaces/services/IAuthService.interface';
import { LoginDto } from '../dto/auth/login.dto';
import { RegisterDto } from '../dto/auth/register.dto';

@Controller('auth')
export class AuthController {

    constructor(@Inject('AUTH_SERVICE_TOKEN') private readonly service: IAuthService) {}

    @Post('register')
    @UsePipes(new ValidationPipe({whitelist: true}))
    async registerUser(@Body() dto: RegisterDto) {
        return await this.service.register(dto);
    }

    @Post('login')
    async loginUser(@Body() dto: LoginDto) {
        return await this.service.login(dto);
    }

}
