import { IsString, IsNotEmpty, IsEmail, IsNumber, IsBoolean, IsInt, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @IsNotEmpty()
    fullname?: string;

    @IsInt()
    @IsNotEmpty()
    age?: number;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password?: string;
}