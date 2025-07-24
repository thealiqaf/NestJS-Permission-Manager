import { IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";

export class UpdateUserPermissionDto {
    @IsString()
    @IsOptional()
    userId?: string;

    @IsString()
    @IsOptional()
    label?: string;

    @IsString({ each: true })
    @IsOptional({ each: true })
    permissions?: (string | mongoose.Types.ObjectId)[]; // Allow both ObjectId and string types for permissions
}
