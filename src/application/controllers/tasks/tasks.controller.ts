import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiPaginatedResponse } from '@utils/constants';
import { PageOptionsDto } from '@dto/page-options.dto';
import { ListTaskDto } from '@dto/task/list-task.dto';
import { CreateTaskDto } from '@dto/task/create-task.dto';
import { UpdateTaskDto } from '@dto/task/update-task.dto';
import { IResponse } from '@interfaces/IResponse.interface';
import { PageDto } from '@dto/page.dto';
import { ITasksService } from '@interfaces/services/ITaskService.interface';

@Controller('tasks')
export class TasksController {
  constructor(
    @Inject('TASKS_SERVICE_TOKEN') private readonly service: ITasksService
  ) {}

  @Get()
  @HttpCode(200)
  @ApiPaginatedResponse(ListTaskDto)
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<ListTaskDto>> {
    return this.service.findAll(pageOptionsDto);
  }

  @HttpCode(200)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findOne(id);
  }

  @HttpCode(201)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreateTaskDto): Promise<IResponse<ListTaskDto>> {
    return await this.service.create(dto);
  }

  @HttpCode(201)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaskDto
  ) {
    return await this.service.update(id, dto);
  }

  @HttpCode(200)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.service.remove(id);
  }
}
