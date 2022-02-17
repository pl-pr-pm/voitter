import { PollyClient } from '@aws-sdk/client-polly';

const REGION = 'ap-northeast-1';
export const pollyClient = new PollyClient({ region: REGION });
