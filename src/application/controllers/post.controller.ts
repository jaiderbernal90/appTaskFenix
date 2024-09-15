import { Body, Controller, Delete, Get, HttpCode, Inject, Param, ParseIntPipe, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiPaginatedResponse } from '../utils/constants';
import { PageOptionsDto } from '../dto/page-options.dto';
import { PageDto } from '../dto/page.dto';
import { IResponse } from '../interfaces/IResponse.interface';
import { ListPostDto } from '../dto/post/list-post.dto';
import { CreatePostDto, UpdateLikePostDto } from '../dto/post/create-post.dto';
import { UpdatePostDto } from '../dto/post/update-post.dto';
import { IPostService } from '../interfaces/services/IPostService.interface';
import { JwtAuthGuard } from '../utils/guards/jwt-auth.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {

  constructor(@Inject('POST_SERVICE_TOKEN') private readonly service: IPostService) { }

  @Get()
  @HttpCode(200)
  @ApiPaginatedResponse(ListPostDto)
  async findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<ListPostDto>> {
    return this.service.findAll(pageOptionsDto);
  }

  @HttpCode(200)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findOne(id);
  }

  @HttpCode(200)
  @Post('update-likes')
  async updateLike(@Body() dto: UpdateLikePostDto) {
    return await this.service.updateLikes(dto);
  }

  @HttpCode(201)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreatePostDto): Promise<IResponse<ListPostDto>> {
    return await this.service.create(dto);
  }

  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
    return await this.service.update(id, dto);
  }

  @HttpCode(200)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.service.remove(id);
  }
}
