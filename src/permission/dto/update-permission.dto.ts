import { IsOptional, IsString } from "class-validator";

export class UpdatePermissionDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
