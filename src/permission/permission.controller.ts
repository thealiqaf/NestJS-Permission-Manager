import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from '../schemas/permission.schema';

@Controller('permission')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    @Post('create')
    async createPermission(@Body() createPermissionDto: CreatePermissionDto): Promise<Permission> {
        return this.permissionService.createPermission(createPermissionDto);
    }

    @Get()
    async findAllPermission(): Promise<Permission[]> {
        return this.permissionService.findAllPermission();
    }

    @Get(':id')
    async findPermissionById(@Param('id') id: string): Promise<Permission> {
        return this.permissionService.findPermissionById(id);
    }

    @Patch(':id')
    async updatePermission(@Param('id') id: string, @Body() updatePermissionDto: CreatePermissionDto): Promise<Permission> {
        return this.permissionService.updatePermission(id, updatePermissionDto);
    }

    @Delete(':id')
    async deletePermission(@Param('id') id: string): Promise<Permission> {
        return this.permissionService.deletePermission(id);
    }
}