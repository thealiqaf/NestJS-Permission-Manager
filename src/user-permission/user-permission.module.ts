import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPermission, UserPermissionSchema } from '../schemas/user-permission.schema';
import { UserPermissionService } from './user-permission.service';
import { UserPermissionController } from './user-permission.controller';
import { PermissionGuard } from '../common/guards/permission.guard';
import { LoggerModule } from '../common/services/logger.module';
import { Permission, PermissionSchema } from '../schemas/permission.schema';

@Module({})
export class UserPermissionModule {
  static forFeature(): DynamicModule {
    return {
      module: UserPermissionModule,
      imports: [
        LoggerModule,
        MongooseModule.forFeature([
          { name: UserPermission.name, schema: UserPermissionSchema },
          { name: Permission.name, schema: PermissionSchema },
        ])
      ],
      controllers: [UserPermissionController],
      providers: [UserPermissionService, PermissionGuard],
      exports: [UserPermissionService, PermissionGuard, MongooseModule],
    };
  }
}