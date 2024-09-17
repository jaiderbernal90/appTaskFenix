import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import TasksRepository from '../../../infrastructure/database/repositories/tasks.repository';
import { PageOptionsDto } from '@dto/page-options.dto';
import { CreateTaskDto } from '@dto/task/create-task.dto';
import { UpdateTaskDto } from '@dto/task/update-task.dto';
import { NotFoundException } from '@nestjs/common';
import { Order } from '../../utils/constants';
import { ListTaskDto } from '../../dto/task/list-task.dto';
import { UpdateResult } from 'typeorm';

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'Description Task',
  state: 'pendiente',
  created: new Date(),
  updated: new Date()
};

describe('TasksService', () => {
  let service: TasksService;
  let repository: jest.Mocked<TasksRepository>;

  beforeEach(async () => {
    const mockRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useValue: mockRepository }
      ]
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get(TasksRepository);
  });

  describe('findAll', () => {
    it('should return a PageDto of ListTaskDto', async () => {
      const pageOptionsDto: PageOptionsDto = {
        skip: 0,
        take: 10,
        order: Order.ASC
      };
      const mockQueryBuilder: any = {
        getCount: jest.fn().mockResolvedValue(1),
        getRawAndEntities: jest
          .fn()
          .mockResolvedValue({ entities: [{ id: 1, title: 'Test Task' }] })
      };
      repository.findAll.mockResolvedValue(mockQueryBuilder);

      const result = await service.findAll(pageOptionsDto);

      expect(result.data).toHaveLength(1);
      expect(result.meta.itemCount).toBe(1);
      expect(repository.findAll).toHaveBeenCalledWith(pageOptionsDto);
    });
  });

  describe('findOne', () => {
    it('should return a task when it exists', async () => {
      const mockTask: ListTaskDto = {
        id: 1,
        title: 'Test Task',
        description: 'Description Task',
        state: 'pendiente',
        created: new Date(),
        updated: new Date(),
        deletedAt: new Date()
      };
      repository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne(1);

      expect(result).toEqual(mockTask);
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'Description',
        state: 'pendiente'
      };

      repository.create.mockResolvedValue(mockTask);

      const result = await service.create(createTaskDto);

      expect(result.data).toEqual(mockTask);
      expect(result.message).toBe('Tarea registrado exitosamente');
      expect(repository.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('update', () => {
    it('should update an existing task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        state: 'completado'
      };
      const updatedMockTask = {
        ...mockTask,
        ...updateTaskDto
      };
      repository.findOne.mockResolvedValue(updatedMockTask);

      const mockUpdateResult: UpdateResult = {
        affected: 1,
        raw: {},
        generatedMaps: []
      };
      repository.update.mockResolvedValue(mockUpdateResult);

      const result = await service.update(1, updateTaskDto);

      expect(result.data).toEqual(updatedMockTask);
      expect(result.message).toBe('Tarea actualizada exitosamente');
      expect(repository.update).toHaveBeenCalledWith(1, updateTaskDto);
    });
  });

  describe('remove', () => {
    it('should remove an existing task', async () => {
      const mockTask: ListTaskDto = {
        id: 1,
        title: 'Task to Remove',
        description: 'Task description',
        state: 'pendiente',
        created: new Date(),
        updated: new Date()
      };
      repository.findOne.mockResolvedValue(mockTask);
      repository.delete.mockResolvedValue(undefined);

      const result = await service.remove(1);

      expect(result).toEqual({
        message: 'Tarea eliminada exitosamente',
        data: mockTask
      });
      expect(repository.findOne).toHaveBeenCalledWith(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when removing non-existent task', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith(1);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
