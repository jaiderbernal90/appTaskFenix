
import { IsInt, IsNotEmpty } from 'class-validator';
import { LoginDto } from './login.dto';
import { PartialType } from '@nestjs/swagger';

export class RegisterDto extends PartialType(LoginDto) {
    @IsNotEmpty()
    fullname?: string;

    @IsInt()
    @IsNotEmpty()
    age?: number;
}