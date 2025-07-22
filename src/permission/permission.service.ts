import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission, PermissionDocument } from 'src/schemas/permission.schema';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
    constructor(@InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>) { }

    async createPermission(createPermissionDto: CreatePermissionDto): Promise<PermissionDocument> {
        const permission = new this.permissionModel(createPermissionDto);
        return await permission.save();
    }

    async findAllPermission(): Promise<PermissionDocument[]> {
        const permission = await this.permissionModel.find();
        return permission;
    }

    async findPermissionById(id: string): Promise<PermissionDocument> {
        const permission = await this.permissionModel.findById(id);
        if (!permission) {
            throw new NotFoundException('Permission not found');
        }
        return permission;
    }

    async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto): Promise<PermissionDocument> {
        const updatedPermission = await this.permissionModel.findByIdAndUpdate(
            id,
            { $set: updatePermissionDto },
            { new: true, runValidators: true }
        );
        if (!updatedPermission) {
            throw new NotFoundException('Permission not found');
        }

        return updatedPermission;
    }

    async deletePermission(id: string): Promise<PermissionDocument> {
        const deletedPermission = await this.permissionModel.findByIdAndDelete(id);
        if (!deletedPermission) {
            throw new NotFoundException('Permission not found');
        }
        return deletedPermission;
    }
}
