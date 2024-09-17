import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  fullname: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password?: string;
}
