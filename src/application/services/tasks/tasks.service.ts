import { Injectable, NotFoundException } from '@nestjs/common';
import { ListTaskDto } from '@/src/application/dto/task/list-task.dto';
import { PageOptionsDto } from '@dto/page-options.dto';
import { PageDto } from '@dto/page.dto';
import { PageMetaDto } from '@dto/page-meta.dto';
import { IResponse } from '@interfaces/IResponse.interface';
import { UpdateTaskDto } from '@/src/application/dto/task/update-task.dto';
import { CreateTaskDto } from '@/src/application/dto/task/create-task.dto';
import TasksRepository from '@/src/infrastructure/database/repositories/tasks.repository';

@Injectable()
export class TasksService {
  constructor(private readonly repository: TasksRepository) {}

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<ListTaskDto>> {
    const queryBuilder = await this.repository.findAll(pageOptionsDto);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number): Promise<ListTaskDto> {
    const data = await this.repository.findOne(id);
    if (!data)
      throw new NotFoundException('No existe la tarea con el id ' + id);
    return data;
  }

  async update(
    id: number,
    body: UpdateTaskDto
  ): Promise<IResponse<ListTaskDto>> {
    const data = await this.repository.findOne(id);

    if (!data)
      throw new NotFoundException({
        message: 'No existe la tarea solicitada'
      });

    await this.repository.update(id, body);

    return {
      message: 'Tarea actualizada exitosamente',
      data: await this.repository.findOne(id)
    };
  }

  async create(body: CreateTaskDto): Promise<IResponse<ListTaskDto>> {
    const data = await this.repository.create(body);

    return { message: 'Tarea registrado exitosamente', data: data };
  }

  async remove(id: number): Promise<IResponse<ListTaskDto>> {
    const data = await this.repository.findOne(id);
    if (!data)
      throw new NotFoundException({
        message: 'No existe la tarea solicitada'
      });
    await this.repository.delete(id);
    return { message: 'Tarea eliminada exitosamente', data: data };
  }
}
