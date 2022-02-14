import { Controller, Get } from '@nestjs/common';
import { CoreService } from './core.service';

@Controller('data')
export class CoreController {
  constructor(readonly coreService: CoreService) {}
  @Get('timeline')
  findTweet() {
    return 'This is findAll';
  }
}
