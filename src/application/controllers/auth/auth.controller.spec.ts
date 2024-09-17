import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { IAuthService } from '@interfaces/services/IAuthService.interface';
import { RegisterDto } from '../../dto/auth/register.dto';
import { LoginDto } from '../../dto/auth/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<IAuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'AUTH_SERVICE_TOKEN',
          useValue: mockAuthService
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get('AUTH_SERVICE_TOKEN');
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        fullname: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      const expectedResult = {
        message: 'User registered successfully',
        data: {
          id: 1,
          fullname: 'Test User',
          email: 'test@example.com',
          created: new Date(),
          updated: new Date()
        }
      };

      service.register.mockResolvedValue(expectedResult);

      expect(await controller.registerUser(registerDto)).toBe(expectedResult);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('loginUser', () => {
    it('should login a user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'somepassword123'
      };
      const expectedResult = {
        message: 'Login successful',
        token: 'some.jwt.token'
      };

      service.login.mockResolvedValue(expectedResult);

      expect(await controller.loginUser(loginDto)).toBe(expectedResult);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
