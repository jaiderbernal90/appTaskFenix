import { ApiProperty } from "@nestjs/swagger";

export class ListPostDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    title: string;
    @ApiProperty()
    content: string;
    @ApiProperty()
    likes: number;
    @ApiProperty()
    created!: Date;
    @ApiProperty()
    updated!: Date;
    @ApiProperty()
    deletedAt?: Date;
}