import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TretArray, TbothRetArray } from '../../domain/type/type';
export type TweetDocument = Tweet & Document;

@Schema()
// mongodbのcollection名と対応させる。最終的に「s」がついて「Tweets」となることに注意。
export class Tweet {
  @Prop({ required: true })
  tweetId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ type: {}, required: true }) // TypeScriptが型を自動推論できない場合は、型を明示する必要がある。また、TypeScriptの型とスキーマタイプは「型」という同じ概念ではないため、純粋に値の型を定義するとエラーとなる。ここでは、厳密に型を指定するのを諦め、オブジェクトとする。
  tweetContent: TretArray | TbothRetArray;

  @Prop({ required: true })
  isTranslate: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const TweetSchema = SchemaFactory.createForClass(Tweet);
