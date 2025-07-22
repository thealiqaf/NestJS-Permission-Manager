import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type UserPermissionDocument = HydratedDocument<UserPermission>;

@Schema({ timestamps: true })
export class UserPermission {
    @Prop({ required: true, type: Types.ObjectId })
    userId: Types.ObjectId;

    @Prop({ required: true, unique: true })
    label: string;

    @Prop({ required: true, type: [Types.ObjectId], ref: 'Permission' })
    permissions: Types.ObjectId[];
}

export const UserPermissionSchema = SchemaFactory.createForClass(UserPermission);