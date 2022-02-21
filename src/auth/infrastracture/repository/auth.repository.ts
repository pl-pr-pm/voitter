import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../shema/user-schema';
import { CreateUserDto } from './../../interface/dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, status } = createUserDto;
    const user = new this.userModel({
      username,
      password,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return user.save();
  }

  // 対象のユーザーを取得
  async findByOptions(
    filter: any,
    projection: string,
    options: any,
  ): Promise<User[]> {
    const docs = await this.userModel.find(filter, projection, options);
    return docs;
  }

  // 対象のユーザーを削除
  async deleteByOptions(options): Promise<void> {
    this.userModel.deleteMany(options);
  }
}