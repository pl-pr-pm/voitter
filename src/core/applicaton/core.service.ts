import { Injectable } from '@nestjs/common';
import { TextToVoice } from '../domain/textToVoice';
import { TweetRepository } from '../infrastracture/repository/tweet.repository';
@Injectable()
export class CoreService {
  constructor(
    private readonly tweetRepository: TweetRepository,
    private textToVoice: TextToVoice,
  ) {}

  run() {
    this.textToVoice
      .run('username', {
        isTranslate: false,
        isMale: true,
        isBoth: true,
      })
      .then((res) => {
        console.log(res);
      });
  }
}
