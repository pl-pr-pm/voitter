import { Module } from '@nestjs/common';
import { TimelineModule } from './timeine/timeline.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserInfoModule } from './user-info/user-info.module';

@Module({
  imports: [
    TimelineModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    UserInfoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
