import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPermission, UserPermissionDocument } from '../schemas/user-permission.schema';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class UserPermissionService {
    constructor(@InjectModel(UserPermission.name) private readonly userPermissionModel: Model<UserPermissionDocument>,
        private readonly logger: LoggerService
    ) { }

    async createUserPermission(createUserPermissionDto: CreateUserPermissionDto): Promise<UserPermissionDocument> {
        try {
            const createdUserPermission = new this.userPermissionModel(createUserPermissionDto);
            this.logger.log(`Creating user permission: ${UserPermission.name} with data: ${JSON.stringify(createUserPermissionDto)}`);
            return await createdUserPermission.save();
        } catch (error) {
            if (error.code === 11000) {
                // Mongo duplicate key error
                this.logger.warn(`Duplicate user permission label: ${JSON.stringify(error.keyValue)}`);
                throw new ConflictException('Permission label already exists.');
            }

            this.logger.error(`Failed to create user permission: ${error.message}`);
            throw error;
        }
    }

    async findAllUserPermissions(): Promise<UserPermissionDocument[]> {
        return this.userPermissionModel.find().populate('permissions');
    }

    async findUserPermissionById(id: string): Promise<UserPermissionDocument> {
        const userPermission = await this.userPermissionModel.findById(id).populate('permissions');
        if (!userPermission) {
            throw new NotFoundException('User Permission not found');
        }
        return userPermission;
    }

    async updateUserPermission(id: string, updateUserPermissionDto: UpdateUserPermissionDto): Promise<UserPermissionDocument> {
        const updatedUserPermission = await this.userPermissionModel.findByIdAndUpdate(
            id,
            { $set: updateUserPermissionDto },
            { new: true, runValidators: true }
        ).populate('permissions');
        if (!updatedUserPermission) {
            throw new NotFoundException('User Permission not found');
        }
        this.logger.log(`Updating user permission with ID ${id}: ${JSON.stringify(updateUserPermissionDto)}`);
        return updatedUserPermission;
    }

    async deleteUserPermission(id: string): Promise<UserPermissionDocument> {
        const deletedUserPermission = await this.userPermissionModel.findByIdAndDelete(id);
        if (!deletedUserPermission) {
            throw new NotFoundException('User Permission not found');
        }
        this.logger.log(`Deleting user permission with ID ${id}`);
        return deletedUserPermission;
    }
}