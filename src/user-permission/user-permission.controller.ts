import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserPermissionService } from './user-permission.service';
import { UserPermissionDocument } from 'src/schemas/user-permission.schema';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';

@Controller('user-permission')
export class UserPermissionController {
    constructor(private readonly userPermissionService: UserPermissionService) { }

    @Post()
    async createUserPermission(@Body() createUserPermissionDto: CreateUserPermissionDto): Promise<UserPermissionDocument> {
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
        @Body() updateUserPermissionDto: UpdateUserPermissionDto
    ): Promise<UserPermissionDocument> {
        return this.userPermissionService.updateUserPermission(id, updateUserPermissionDto);
    }

    @Delete(':id')
    async deleteUserPermission(@Param('id') id: string): Promise<void> {
        await this.userPermissionService.deleteUserPermission(id);
    }
}
