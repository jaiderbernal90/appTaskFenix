import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { ITasksService } from '@interfaces/services/ITaskService.interface';
import { PageOptionsDto } from '@dto/page-options.dto';
import { CreateTaskDto } from '@dto/task/create-task.dto';
import { UpdateTaskDto } from '@dto/task/update-task.dto';
import { PageDto } from '@dto/page.dto';
import { ListTaskDto } from '@dto/task/list-task.dto';
import { IResponse } from '@interfaces/IResponse.interface';
import { Order } from '../../utils/constants';

describe('TasksController', () => {
  let controller: TasksController;
  let service: jest.Mocked<ITasksService>;

  beforeEach(async () => {
    const mockTasksService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: 'TASKS_SERVICE_TOKEN',
          useValue: mockTasksService
        }
      ]
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get('TASKS_SERVICE_TOKEN');
  });

  describe('findAll', () => {
    it('should return a PageDto of ListTaskDto', async () => {
      const pageOptionsDto: PageOptionsDto = {
        skip: 0,
        take: 10,
        order: Order.ASC
      };
      const expectedResult: PageDto<ListTaskDto> = {
        data: [
          {
            id: 1,
            title: 'Test Task',
            description: 'Test Description',
            state: 'pendiente',
            created: new Date(),
            updated: new Date()
          }
        ],
        meta: {
          itemCount: 1,
          pageCount: 1,
          page: 1,
          take: 10,
          hasNextPage: false,
          hasPreviousPage: false
        }
      };

      service.findAll.mockResolvedValue(expectedResult);

      expect(await controller.findAll(pageOptionsDto)).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(pageOptionsDto);
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const expectedResult: ListTaskDto = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        state: 'pendiente',
        created: new Date(),
        updated: new Date()
      };

      service.findOne.mockResolvedValue(expectedResult);

      expect(await controller.findOne(1)).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
        state: 'pendiente'
      };
      const expectedResult: IResponse<ListTaskDto> = {
        message: 'Task created successfully',
        data: {
          id: 1,
          ...createTaskDto,
          created: expect.any(Date),
          updated: expect.any(Date)
        }
      };

      service.create.mockResolvedValue(expectedResult);

      expect(await controller.create(createTaskDto)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('update', () => {
    it('should update an existing task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        state: 'completado'
      };
      const expectedResult: IResponse<ListTaskDto> = {
        message: 'Task updated successfully',
        data: {
          id: 1,
          ...updateTaskDto,
          created: expect.any(Date),
          updated: expect.any(Date)
        }
      };

      service.update.mockResolvedValue(expectedResult);

      expect(await controller.update(1, updateTaskDto)).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateTaskDto);
    });
  });

  describe('remove', () => {
    it('should remove an existing task', async () => {
      const expectedResult: IResponse<ListTaskDto> = {
        message: 'Task removed successfully',
        data: {
          id: 1,
          title: 'Removed Task',
          description: 'Removed Description',
          state: 'pendiente',
          created: expect.any(Date),
          updated: expect.any(Date)
        }
      };

      service.remove.mockResolvedValue(expectedResult);

      expect(await controller.remove(1)).toBe(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
