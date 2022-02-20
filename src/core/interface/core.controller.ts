import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Cookies } from './customeDecorator/cookieParser';
import { CoreService } from '../applicaton/core.service';
import { Toptions } from '../domain/type/type';
import { Request } from 'express';
import { CreateTimelineDto } from './dto/create-timeline.dto';

@Controller('timeline')
export class CoreController {
  constructor(readonly coreService: CoreService) {}
  @Get()
  async selectTimeline(
    @Query('username') username: string,
    @Query('isTranslate') isTranslate: boolean,
  ) {
    return await this.coreService.selectTimeLine(
      { username: username },
      { isTranslate: isTranslate, isMale: true, isBoth: false },
    );
  }

  // バッチ用
  // 条件なしでタイムライン情報を作成する
  // フロントからリクエストが行われる、'/timeline @GET' と同様のインターフェースの方が良いかと思ったが、
  // リソース作成用のエンドポイントなので、GETではなくPOSTとしている
  @Post('/internal')
  async createTimeline(@Body() createTimelineDto: CreateTimelineDto) {
    const { username, isTranslate } = createTimelineDto;
    const now = new Date().toISOString();
    return await this.coreService._createTweet(username, now, {
      isTranslate: isTranslate,
      isMale: true,
      isBoth: false,
    });
  }

  // ハウスキーピング用
  @Delete('/internal')
  async deleteTimeline(@Query('username') username: string) {
    return await this.coreService._deleteTimeLine({ username: username });
  }
}
