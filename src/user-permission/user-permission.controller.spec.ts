import { Test, TestingModule } from '@nestjs/testing';
import { UserPermissionController } from './user-permission.controller';

describe('UserPermissionController', () => {
  let controller: UserPermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPermissionController],
    }).compile();

    controller = module.get<UserPermissionController>(UserPermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
