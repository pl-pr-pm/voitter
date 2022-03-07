import { S3Client } from '@aws-sdk/client-s3';

const REGION = 'ap-northeast-1';
export const s3 = new S3Client({ region: REGION });
