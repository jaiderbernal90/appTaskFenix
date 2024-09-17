import { ICrudService } from './ICrudService.interface';
import { IResponse } from '../IResponse.interface';
import { ListTaskDto } from '@dto/task/list-task.dto';
import { UpdateTaskDto } from '@dto/task/update-task.dto';
import { CreateTaskDto } from '@dto/task/create-task.dto';

export const TASKS_SERVICE_TOKEN = 'TASKS_SERVICE_TOKEN';

export interface ITasksService extends ICrudService<ListTaskDto> {
  update(id: number, body: UpdateTaskDto): Promise<IResponse<ListTaskDto>>;
  create(body: CreateTaskDto): Promise<IResponse<ListTaskDto>>;
}
