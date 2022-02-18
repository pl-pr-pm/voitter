import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TretArray, TbothRetArray } from '../../domain/type/type';
export type TweetDocument = Tweet & Document;

@Schema()
// mongodbのcollection名と対応させる。最終的に「s」がついて「Tweets」となることに注意。
export class Tweet {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  tweetContent: TretArray | TbothRetArray;

  @Prop({ required: true })
  tweetCreatedAt: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop()
  updatedAt: string;
}

export const TweetSchema = SchemaFactory.createForClass(Tweet);
