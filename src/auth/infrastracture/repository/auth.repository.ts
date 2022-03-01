import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../shema/user-schema';
import { CreateUserDto } from './../../interface/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, status } = createUserDto;
    // ハッシュ前のパスワードに加える
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const user = new this.userModel({
      username,
      password: hashPassword,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return user.save();
  }

  /**
   * 以下メソッド達は、mongooseの仕様変更 or 別ormへの切り替え が発生した際の緩衝地帯として作成
   */

  // 対象のユーザーを取得
  async findByOptions(
    filter: any,
    projection: string,
    options: any,
  ): Promise<User[]> {
    const docs = await this.userModel.find(filter, projection, options);
    return docs;
  }

  // 対象のユーザーを更新
  async updateByOptions(filter: any, updateContents: any, options?: any) {
    await this.userModel.updateOne(filter, updateContents, options);
  }

  // 対象のユーザーを削除
  async deleteByOptions(options): Promise<void> {
    this.userModel.deleteMany(options);
  }
}
