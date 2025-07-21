/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PermissionModule } from './permission/permission.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserPermissionModule } from './user-permission/user-permission.module';

@Module({
  imports: [PermissionModule, MongooseModule.forRoot('mongodb://localhost:27017/yourdbname'), UserPermissionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
