import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { UserPermission, UserPermissionDocument } from '../schemas/user-permission.schema';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { LoggerService } from '../common/services/logger.service';
import { Permission, PermissionDocument } from '../schemas/permission.schema';

@Injectable()
export class UserPermissionService {
    constructor(
        @InjectModel(UserPermission.name) private readonly userPermissionModel: Model<UserPermissionDocument>,
        @InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>,
        private readonly logger: LoggerService
    ) { }

    private async validatePermissionIds(ids: string[]): Promise<void> {
        if (!ids || ids.length === 0) return;

        const foundPermissions = await this.permissionModel
            .find({ _id: { $in: ids } })
            .select('_id');

        const foundIds = foundPermissions.map((p) => p._id.toString());
        const notFound = ids.filter((id) => !foundIds.includes(id));

        if (notFound.length > 0) {
            throw new BadRequestException(
                `Permission IDs not found: ${notFound.join(', ')}`,
            );
        }
    }

    async createUserPermission(createUserPermissionDto: CreateUserPermissionDto): Promise<UserPermissionDocument> {

        if (!isValidObjectId(createUserPermissionDto.userId)) {
            throw new BadRequestException('Invalid userId format');
        }

        const userExists = await this.userPermissionModel.exists({ _id: createUserPermissionDto.userId });
        if (!userExists) {
            throw new BadRequestException('User ID does not exist');
        }

        await this.validatePermissionIds(createUserPermissionDto.permissions);

        const existingUserPermission = await this.userPermissionModel.findOne({
            userId: createUserPermissionDto.userId,
        });

        if (existingUserPermission) {
            throw new BadRequestException('User Permission already exists for this user');
        }

        const createdUserPermission = new this.userPermissionModel(createUserPermissionDto);
        this.logger.log(`Creating user permission, data: ${JSON.stringify(createUserPermissionDto)}`);
        return await createdUserPermission.save();
    }

    async findAllUserPermissions(): Promise<UserPermissionDocument[]> {
        return this.userPermissionModel.find().populate('permissions').lean();
    }

    async findUserPermissionById(id: string): Promise<UserPermissionDocument> {
        const userPermission = await this.userPermissionModel.findById(id).populate('permissions');
        if (!userPermission) {
            throw new NotFoundException('User Permission not found');
        }
        return userPermission;
    }

    async updateUserPermission(
        id: string,
        updateUserPermissionDto: UpdateUserPermissionDto
    ): Promise<UserPermissionDocument> {
        const updates = Object.fromEntries(
            Object.entries(updateUserPermissionDto).filter(([_, v]) => v !== undefined)
        );

        if (updates.permissions) {
            const permissions = await this.permissionModel.find({ _id: { $in: updates.permissions } });
            if (permissions.length !== updates.permissions.length) {
                throw new BadRequestException('Some permissions are invalid');
            }
        }

        const existingUserPermission = await this.userPermissionModel.findById(id);
        if (!existingUserPermission) {
            throw new NotFoundException('User Permission not found');
        }

        if (updates.permissions) {
            const existingPermissionIds = existingUserPermission.permissions.map(p => p.toString());
            const duplicatedPermissions = updates.permissions.filter((permId: string) =>
                existingPermissionIds.includes(permId)
            );

            if (duplicatedPermissions.length > 0) {
                throw new BadRequestException(
                    `The following permissions are already assigned to this user: ${duplicatedPermissions.join(', ')}`
                );
            }
        }

        const updatedUserPermission = await this.userPermissionModel.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('permissions');

        if (!updatedUserPermission) {
            throw new NotFoundException('User Permission not found after update');
        }

        this.logger.log(`Updated user permission with ID ${id}: ${JSON.stringify(updates)}`);

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