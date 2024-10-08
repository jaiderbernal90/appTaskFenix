import { ApiProperty } from '@nestjs/swagger';

export class ListUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  fullname: string;

  @ApiProperty()
  created!: Date;

  @ApiProperty()
  updated!: Date;

  @ApiProperty()
  deletedAt?: Date;
}
