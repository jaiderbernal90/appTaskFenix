import { IsString, IsNotEmpty, IsInt } from "class-validator";

export class UpdatePostDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsInt()
    likes: number;
}