import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInfo, UserInfoDocument } from '../schema/user-info.scheme';
import { CreateUserInfoDto } from '../../interface/dto/create-user-info.dto';

@Injectable()
export class UserInfoRepository {
  constructor(
    @InjectModel(UserInfo.name) private userInfoModel: Model<UserInfoDocument>,
  ) {}
  async createTweet(createUserInfoDto: CreateUserInfoDto): Promise<UserInfo> {
    const { username, description, profile_image_url } = createUserInfoDto;
    const userInfo = new this.userInfoModel({
      username,
      description,
      profile_image_url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return userInfo.save();
  }

  async deleteByOptions(options): Promise<void> {
    this.userInfoModel.deleteOne(options);
  }
}
