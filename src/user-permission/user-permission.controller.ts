/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
import { CreatePermissionDto } from 'src/permission/dto/create-permission.dto';
import { UserPermissionDocument } from 'src/schemas/user-permission.shema';

@Controller('user-permission')
export class UserPermissionController {
    constructor(private readonly userPermissionService: UserPermissionService) { }

    @Post()
    async createUserPermission(@Body() createUserPermissionDto: CreatePermissionDto): Promise<UserPermissionDocument> {
        return this.userPermissionService.createUserPermission(createUserPermissionDto);
    }

    @Get()
    async findAllUserPermissions(): Promise<UserPermissionDocument[]> {
        return this.userPermissionService.findAllUserPermissions();
    }

    @Get(':id')
    async findUserPermissionById(@Body('id') id: string): Promise<UserPermissionDocument> {
        return this.userPermissionService.findUserPermissionById(id);
    }

    @Patch(':id')
    async updateUserPermission(
        @Param('id') id: string,
        @Body() updateUserPermissionDto: CreatePermissionDto
    ): Promise<UserPermissionDocument> {
        return this.userPermissionService.updateUserPermission(id, updateUserPermissionDto);
    }

    @Delete(':id')
    async deleteUserPermission(@Param('id') id: string): Promise<void> {
        await this.userPermissionService.deleteUserPermission(id);
    }
}
