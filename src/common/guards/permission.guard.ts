/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPermission, UserPermissionDocument } from '../../schemas/user-permission.schema';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        @InjectModel(UserPermission.name)
        private readonly userPermissionModel: Model<UserPermissionDocument>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.id;
        const requiredPermissions = this.reflector.get<string[]>('requiredPermission', context.getHandler());

        if (!userId || !requiredPermissions) {
            throw new ForbiddenException('User or permission not specified');
        }

        const userPermission = await this.userPermissionModel
            .findOne({ userId, permissions: { $in: requiredPermissions } })
            .exec();

        if (!userPermission) {
            throw new ForbiddenException('User does not have required permission');
        }

        return true;
    }
}