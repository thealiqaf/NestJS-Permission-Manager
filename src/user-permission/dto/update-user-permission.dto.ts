/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserPermissionDto {
    @IsString()
    @IsNotEmpty()
    userId?: string;

    @IsString()
    @IsNotEmpty()
    label?: string;

    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    permissions?: string[];
}
