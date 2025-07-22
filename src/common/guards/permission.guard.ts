import { Injectable, CanActivate, ExecutionContext, ForbiddenException, LoggerService, UnauthorizedException } from '@nestjs/common';
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
        private readonly logger: LoggerService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.id;
        const requiredPermissions = this.reflector.get<string>('requiredPermission', context.getHandler());

        this.logger.log(`Checking permission '${requiredPermissions}' for user '${userId}'`);

        if (!userId) {
            this.logger.error('No user ID provided in request', undefined, 'PermissionGuard');
            throw new UnauthorizedException('User not authenticated');
        }

        if (!requiredPermissions) {
            this.logger.error('No permission specified for route', undefined, 'PermissionGuard');
            throw new ForbiddenException('Permission not specified');
        }

        const userPermission = await this.userPermissionModel
            .findOne({ userId, permissions: requiredPermissions })
            .exec();

        if (!userPermission) {
            this.logger.warn(`Permission '${requiredPermissions}' not found for user '${userId}'`);
            throw new ForbiddenException('User does not have required permission');
        }

        this.logger.log(`Permission '${requiredPermissions}' granted for user '${userId}'`);
        return true;
    }
}