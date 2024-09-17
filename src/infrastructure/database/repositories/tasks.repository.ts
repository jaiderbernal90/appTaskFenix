import { PageOptionsDto } from '@/src/application/dto/page-options.dto';
import { CreateTaskDto } from '@/src/application/dto/task/create-task.dto';
import { ListTaskDto } from '@/src/application/dto/task/list-task.dto';
import { UpdateTaskDto } from '@/src/application/dto/task/update-task.dto';
import { Task } from '@/src/domain/entities/task.entity';
import { ITasksRepository } from '@/src/domain/repositories/ITasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';

export default class TasksRepository implements ITasksRepository {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>
  ) {}

  async findAll(
    pageOptionsDto: PageOptionsDto
  ): Promise<SelectQueryBuilder<Task>> {
    return this.taskRepository
      .createQueryBuilder('tasks')
      .orderBy('tasks.id', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);
  }

  async findOne(id: number): Promise<ListTaskDto> {
    return await this.taskRepository
      .createQueryBuilder('tasks')
      .where('tasks.id= :id', { id: id })
      .getOne();
  }

  async delete(id: number): Promise<UpdateResult> {
    return await this.taskRepository.softDelete(id);
  }

  async create(body: CreateTaskDto): Promise<ListTaskDto> {
    return await this.taskRepository.save(body);
  }

  async update(id: number, body: UpdateTaskDto): Promise<UpdateResult> {
    return await this.taskRepository.update(id, body);
  }
}
