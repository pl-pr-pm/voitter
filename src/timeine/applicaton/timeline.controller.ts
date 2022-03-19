import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TimelineService } from '../domain/timeline.service';
import { CreateTimelineDto } from '../interface/dto/create-timeline.dto';
import { JwtAuthGuard } from '../../auth/domain/guards/jwt-auth.guard';
import { Role } from 'src/auth/domain/decorators/role.decorator';
import { UserStatus } from 'src/auth/domain/enum/user-status';
import { RolesGuard } from 'src/auth/domain/guards/roles.guard';
import { SelectTweetDto } from '../interface/dto/select-tweet.dto';
import { QueryToDto } from '../interface/decorator/query-param.decorator';
import { validationArg } from '../../util/validateArg';

@Controller('timeline')
export class TimelineController {
  constructor(readonly timelineService: TimelineService) {}
  @Get()
  async selectTimeline(
    @QueryToDto('username') selectTweetDto: SelectTweetDto,
    @Query('untilId') untilId: string,
  ) {
    // TODO: dtoでvalidationを行うようにする。
    validationArg('username', selectTweetDto.username);
    validationArg('untilId', untilId);
    return await this.timelineService.selectTimeLine(
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
    // TODO: dtoでvalidationを行うようにする。
    validationArg('username', selectTweetDto.username);
    validationArg('untilId', untilId);
    return await this.timelineService.selectTimeLine(
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
    return await this.timelineService.createTimeline(
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
  async deleteTimeline(@QueryToDto('username') selectTweetDto: SelectTweetDto) {
    return await this.timelineService._deleteTimeLine(selectTweetDto);
  }
}
