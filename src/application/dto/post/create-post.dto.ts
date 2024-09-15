import { IsString, IsNotEmpty, IsEmail, IsNumber, IsBoolean, IsInt, MaxLength, MinLength } from "class-validator";

export class CreatePostDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsInt()
    likes: number;

    @IsInt()
    @IsNotEmpty()
    user_id: number;
}

export class UpdateLikePostDto {
    @IsInt()
    @IsNotEmpty()
    id:number;

    @IsBoolean()
    @IsNotEmpty()
    increment:boolean;
}

export class LikesDto{
    @IsInt()
    likes:number
}