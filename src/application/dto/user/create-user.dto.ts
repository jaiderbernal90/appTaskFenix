import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
