import { ICrudRepository } from './ICrud.repository';
import { UpdateTaskDto } from '@/src/application/dto/task/update-task.dto';
import { CreateTaskDto } from '@/src/application/dto/task/create-task.dto';
import { UpdateResult } from 'typeorm';
import { ListTaskDto } from '@/src/application/dto/task/list-task.dto';

export interface ITasksRepository extends ICrudRepository<ListTaskDto> {
  create(body: CreateTaskDto): Promise<ListTaskDto>;
  update(id: number, body: UpdateTaskDto): Promise<UpdateResult>;
}
