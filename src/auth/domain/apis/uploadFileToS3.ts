import { s3 } from './lib/s3client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class S3Upload {
  async upload(bucketName: string, key: string, data: any) {
    try {
      const result = await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: data,
        }),
      );
      return;
    } catch (e: any) {
      console.log(e.message);
      throw new HttpException(
        {
          statusCode: 522,
          message: `S3へのファイルアップロードに失敗しました ${e.message}`,
        },
        522,
      );
    }
  }
}
