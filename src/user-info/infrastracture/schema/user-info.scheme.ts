import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserInfoDocument = UserInfo & Document;

@Schema()
export class UserInfo {
  @Prop({ required: true })
  username: string;

  @Prop()
  description: string;

  @Prop()
  profile_image_url: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
