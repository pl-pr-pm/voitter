import { Module } from '@nestjs/common';
import { AuthController } from './application/auth.controller';
import { AuthService } from './domain/auth.service';
import { UserRepository } from './infrastracture/repository/auth.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './infrastracture/shema/user-schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './domain/jwt.strategy';
import { JwtAuthGuard } from './domain/guards/jwt-auth.guard';
import { RolesGuard } from './domain/guards/roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }), // defaultの認証方法をjwtとしている
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: 3600, // 秒
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [JwtStrategy, JwtAuthGuard, RolesGuard], // core moduleでも利用のため
})
export class AuthModule {}
