import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserStatus } from '../../domain/enum/user-status';
export type UserDocument = User & Document;

// 実際、mongoDBは、_id カラム をドキュメント生成時に自動生成する
// これが厄介で、Userスキーマを利用すると、mongoDBのドキュメントの型はUserスキーマとなり、mongoDBのドキュメントから _id カラムを取得しようとすると、コンパイルエラーとなる
// かと言って、idカラムを足すのも・・・
// どうしても必要になったら idカラムを足すか・・・
@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: {}, required: true })
  status: UserStatus;

  @Prop()
  imageUrl: string;

  @Prop()
  refreshToken: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
