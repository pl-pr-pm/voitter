import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './domain/auth.service';
import { UserRepository } from './infrastracture/repository/auth.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './infrastracture/shema/user-schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
})
export class AuthModule {}
