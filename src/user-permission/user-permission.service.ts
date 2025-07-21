/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPermission, UserPermissionDocument } from 'src/schemas/user-permission.schema';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';

@Injectable()
export class UserPermissionService {
    constructor(@InjectModel(UserPermission.name) private readonly userPermissionModel: Model<UserPermissionDocument>) { }

    async createUserPermission(createUserPermissionDto: CreateUserPermissionDto): Promise<UserPermissionDocument> {
        const createdUserPermission = new this.userPermissionModel(createUserPermissionDto);
        return createdUserPermission.save();
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
        return updatedUserPermission;
    }

    async deleteUserPermission(id: string): Promise<UserPermissionDocument> {
        const deletedUserPermission = await this.userPermissionModel.findByIdAndDelete(id);
        if (!deletedUserPermission) {
            throw new NotFoundException('User Permission not found');
        }
        return deletedUserPermission;
    }
}