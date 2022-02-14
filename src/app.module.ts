import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CoreModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
