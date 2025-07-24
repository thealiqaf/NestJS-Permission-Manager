import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Permission, PermissionDocument } from '../schemas/permission.schema';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class PermissionService {
    constructor(
        @InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>,
        private readonly logger: LoggerService
    ) { }

    async createPermission(createPermissionDto: CreatePermissionDto): Promise<PermissionDocument> {
        const existingPermission = await this.permissionModel.findOne({ name: createPermissionDto.name });

        if (existingPermission) {
            throw new ConflictException('Permission already exists');
        }

        const permission = new this.permissionModel(createPermissionDto);
        this.logger.log(`Creating permission, with data: ${JSON.stringify(createPermissionDto)}`);
        return await permission.save();
    }

    async findAllPermission(): Promise<PermissionDocument[]> {
        const permission = await this.permissionModel.find().lean();
        return permission;
    }

    async findPermissionById(id: string): Promise<PermissionDocument> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid permission ID');
        }

        const permission = await this.permissionModel.findById(id);

        if (!permission) {
            throw new NotFoundException('Permission not found');
        }
        return permission;
    }

    async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto): Promise<PermissionDocument> {
        const updates = Object.fromEntries(
            Object.entries(updatePermissionDto).filter(([_, v]) => v !== undefined)
        );

        const existingPermission = await this.permissionModel.findById(id);
        if (!existingPermission) {
            throw new NotFoundException('Permission not found');
        }

        if (updates.name && updates.name !== existingPermission.name) {
            const permissionWithSameName = await this.permissionModel.findOne({ name: updates.name });
            if (permissionWithSameName) {
                throw new ConflictException('Another permission with this name already exists');
            }
        }

        const updatedPermission = await this.permissionModel.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedPermission) {
            throw new NotFoundException('Permission not found');
        }

        this.logger.log(`Updating permission with ID ${id}: ${JSON.stringify(updatePermissionDto)}`);
        return updatedPermission;
    }

    async deletePermission(id: string): Promise<PermissionDocument> {
        const deletedPermission = await this.permissionModel.findByIdAndDelete(id);
        if (!deletedPermission) {
            throw new NotFoundException('Permission not found');
        }
        this.logger.log(`Deleting permission with ID ${id}`);
        return deletedPermission;
    }
}
