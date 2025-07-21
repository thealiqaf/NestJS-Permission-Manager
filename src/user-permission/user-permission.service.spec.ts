import { Test, TestingModule } from '@nestjs/testing';
import { UserPermissionService } from './user-permission.service';

describe('UserPermissionService', () => {
  let service: UserPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPermissionService],
    }).compile();

    service = module.get<UserPermissionService>(UserPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
