import { SetMetadata } from '@nestjs/common';
// 認可が必要なロールを受け取り、メタデータに保存する
export const Role = (...statuses: string[]) => {
  SetMetadata('statuses', statuses); // デコレータに渡された値をメタデータとして登録する
};
