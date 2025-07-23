import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from '../schemas/permission.schema';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { LoggerModule } from '../common/services/logger.module';

@Module({})
export class PermissionModule {
  static forFeature(): DynamicModule {
    return {
      module: PermissionModule,
      imports: [
        LoggerModule,
        MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }]),
      ],
      controllers: [PermissionController],
      providers: [PermissionService],
      exports: [PermissionService, MongooseModule],
    };
  }
}