import { IsString, IsNotEmpty, MaxLength, IsEnum } from 'class-validator';
import { TaskStatus } from '../../utils/state.type';

export class UpdateTaskDto {
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(TaskStatus, {
    message:
      'Estado inválido. Debe ser "en progreso", "completado" o "pendiente".'
  })
  state: TaskStatus;
}
