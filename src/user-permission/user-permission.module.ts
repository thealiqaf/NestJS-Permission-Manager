/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserPermissionController } from './user-permission.controller';
import { UserPermissionService } from './user-permission.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPermission, UserPermissionSchema } from 'src/schemas/user-permission.shema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserPermission.name, schema: UserPermissionSchema }]),
  ],
  controllers: [UserPermissionController],
  providers: [UserPermissionService],
})
export class UserPermissionModule { }
