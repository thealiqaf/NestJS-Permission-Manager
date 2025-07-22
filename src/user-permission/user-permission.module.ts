import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPermission, UserPermissionSchema } from '../schemas/user-permission.schema';
import { UserPermissionService } from './user-permission.service';
import { UserPermissionController } from './user-permission.controller';
import { PermissionGuard } from '../common/guards/permission.guard';
// import { LoggerService } from '../common/services/logger.service';

@Module({})
export class UserPermissionModule {
  static forFeature(): DynamicModule {
    return {
      module: UserPermissionModule,
      imports: [
        MongooseModule.forFeature([{ name: UserPermission.name, schema: UserPermissionSchema }]),
      ],
      controllers: [UserPermissionController],
      providers: [UserPermissionService, PermissionGuard],
      exports: [UserPermissionService, PermissionGuard],
    };
  }
}