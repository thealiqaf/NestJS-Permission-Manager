/* eslint-disable prettier/prettier */
import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permission, PermissionSchema } from '../schemas/permission.schema';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';

@Module({})
export class PermissionModule {
  static forFeature(): DynamicModule {
    return {
      module: PermissionModule,
      imports: [
        MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }]),
      ],
      controllers: [PermissionController],
      providers: [PermissionService],
      exports: [PermissionService],
    };
  }
}