import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPermission, UserPermissionSchema } from '../schemas/user-permission.schema';
import { UserPermissionService } from './user-permission.service';
import { UserPermissionController } from './user-permission.controller';
import { PermissionGuard } from '../common/guards/permission.guard';
import { LoggerService } from 'src/common/services/logger.service';

@Module({})
export class UserPermissionModule {
  static forFeature(): DynamicModule {
    return {
      module: UserPermissionModule,
      imports: [
        MongooseModule.forFeature([{ name: UserPermission.name, schema: UserPermissionSchema }]),
      ],
      controllers: [UserPermissionController],
      providers: [UserPermissionService, PermissionGuard, LoggerService],
      exports: [UserPermissionService, PermissionGuard, LoggerService],
    };
  }
}