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
import { SelectTimelineDto } from '../interface/dto/select-timeline.dto';
import { QueryToDto } from '../interface/decorator/query-param.decorator';

@Controller('timeline')
export class TimelineController {
  constructor(readonly timelineService: TimelineService) {}

  /**
   * Timelineを取得する
   * 対象のusernameのTimelineがDBに存在しない場合、新規作成する
   * @param selectTimelineDto
   * @param untilId
   * @returns timeline
   */
  @Get()
  async selectTimeline(@Query() selectTimelineDto: SelectTimelineDto) {
    return await this.timelineService.selectTimeLine(selectTimelineDto, {
      isTranslate: false,
      isMale: true,
      isBoth: false,
    });
  }
  /**
   * 翻訳Timelineの取得
   * 翻訳されたタイムラインの取得は、ログインしている必要がある
   * 対象のusernameのTimelineがDBに存在しない場合、新規作成する
   * @param selectTimelineDto
   * @param untilId
   * @returns timeline
   */

  @Get('/translate')
  @UseGuards(JwtAuthGuard)
  async selectTranslateTimeline(@Query() selectTimelineDto: SelectTimelineDto) {
    return await this.timelineService.selectTimeLine(selectTimelineDto, {
      isTranslate: true,
      isMale: true,
      isBoth: false,
    });
  }

  /**
   * バッチ用
   * 条件なしでタイムライン情報を作成する
   * フロントからリクエストが行われる、'/timeline @GET' と同様のインターフェースの方が良いかと思ったが、
   * リソース作成用のエンドポイントなので、GETではなくPOSTとしている
   * @param createTimelineDto
   * @returns timeline
   */

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

  /**
   * ハウスキーピング用
   */
  @Delete('/internal')
  @Role(UserStatus.SYSTEM)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteTimeline(
    @QueryToDto('username') selectTimelineDto: SelectTimelineDto,
  ) {
    return await this.timelineService._deleteTimeLine(selectTimelineDto);
  }
}
