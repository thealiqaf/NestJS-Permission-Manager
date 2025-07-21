/* eslint-disable prettier/prettier */
import { SetMetadata } from "@nestjs/common";

export const RequiredPermission = (...permissions: string[]) =>
    SetMetadata('requiredPermission', permissions);