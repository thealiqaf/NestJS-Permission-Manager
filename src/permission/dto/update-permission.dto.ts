import { IsString } from "class-validator";

export class UpdatePermissionDto {
    @IsString()
    name?: string;

    @IsString()
    description?: string;
}
