import { ApiProperty } from '@nestjs/swagger';

export class ListTaskDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  created!: Date;

  @ApiProperty()
  updated!: Date;

  @ApiProperty()
  deletedAt?: Date;
}
