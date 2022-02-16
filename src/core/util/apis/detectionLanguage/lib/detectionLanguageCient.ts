// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const DetectLanguage = require('detectlanguage');
export const client = new DetectLanguage(process.env.DETECTION_API_KEY);
