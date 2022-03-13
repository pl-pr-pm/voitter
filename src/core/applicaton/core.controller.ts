import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoreService } from '../domain/core.service';
import { CreateTimelineDto } from '../interface/dto/create-timeline.dto';
import { JwtAuthGuard } from '../../auth/domain/guards/jwt-auth.guard';
import { Role } from 'src/auth/domain/decorators/role.decorator';
import { UserStatus } from 'src/auth/domain/enum/user-status';
import { RolesGuard } from 'src/auth/domain/guards/roles.guard';
import { SelectTweetDto } from '../interface/dto/select-tweet.dto';
import { QueryToDto } from '../interface/decorator/query-param.decorator';

@Controller('timeline')
export class CoreController {
  constructor(readonly coreService: CoreService) {}
  @Get()
  async selectTimeline(
    @QueryToDto('username') selectTweetDto: SelectTweetDto,
    @Query('untilId') untilId: string,
  ) {
    return await this.coreService.selectTimeLine(
      selectTweetDto,
      {
        isTranslate: false,
        isMale: true,
        isBoth: false,
      },
      untilId,
    );
  }
  // 翻訳されたタイムラインの取得は、ログインしている必要がある
  @Get('/translate')
  @UseGuards(JwtAuthGuard)
  async selectTranslateTimeline(
    @QueryToDto('username') selectTweetDto: SelectTweetDto,
    @Query('untilId') untilId: string,
  ) {
    return await this.coreService.selectTimeLine(
      selectTweetDto,
      {
        isTranslate: true,
        isMale: true,
        isBoth: false,
      },
      untilId,
    );
  }

  // バッチ用
  // 条件なしでタイムライン情報を作成する
  // フロントからリクエストが行われる、'/timeline @GET' と同様のインターフェースの方が良いかと思ったが、
  // リソース作成用のエンドポイントなので、GETではなくPOSTとしている
  @Post('/internal')
  @Role(UserStatus.SYSTEM)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createTimeline(@Body() createTimelineDto: CreateTimelineDto) {
    const { username, isTranslate } = createTimelineDto;
    const now = new Date().toISOString();
    const untilId = '0000000000'; // internal用
    return await this.coreService._createTweet(
      username,
      now,
      {
        isTranslate: isTranslate,
        isMale: true,
        isBoth: false,
      },
      untilId,
    );
  }

  // ハウスキーピング用
  @Delete('/internal')
  @Role(UserStatus.SYSTEM)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteTimeline(@Query('username') username: string) {
    return await this.coreService._deleteTimeLine({ username: username });
  }
}
