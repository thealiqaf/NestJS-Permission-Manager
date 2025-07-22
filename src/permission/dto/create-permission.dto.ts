import { IsNotEmpty, IsString } from "class-validator";

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}