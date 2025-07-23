import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserPermission, UserPermissionDocument } from '../../schemas/user-permission.schema';
import { Reflector } from '@nestjs/core';
import { LoggerService } from '../services/logger.service';

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
        const requiredPermissions = this.reflector.get<string>('requiredPermission', context.getHandler());


        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }

        if (!requiredPermissions) {
            throw new ForbiddenException('Permission not specified');
        }

        const userPermission = await this.userPermissionModel
            .findOne({ userId, permissions: requiredPermissions })
            .exec();

        if (!userPermission) {
            throw new ForbiddenException('User does not have required permission');
        }

        return true;
    }
}