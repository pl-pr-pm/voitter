import { BadRequestException } from '@nestjs/common';
const usernameValidation = (username: string) => {
  if (!username) {
    return '文字を入力してください';
  }
  const usernameRegExp = /^[a-zA-Z0-9_]*$/;
  if (!(username.length >= 4 && username.length <= 50)) {
    return 'username 長さが不正です。4文字以上50文字以下としてください';
  }
  if (!username.match(usernameRegExp)) {
    return 'username 書式が不正です。半角英数字記号としてください。記号は_のみ';
  }
  return '';
};

const passwordValidation = (password: string) => {
  if (!password) {
    return '文字を入力してください';
  }
  const passwordRegExp = /^[a-zA-Z0-9@#,]*$/;
  if (!(password.length >= 8 && password.length <= 16)) {
    return 'password 長さが不正です。8文字以上16文字以下としてください';
  }
  if (!password.match(passwordRegExp)) {
    return 'password 書式が不正です。半角英数字記号としてください。記号は@#,のみ。';
  }
  return '';
};

const untilIdValidation = (untilId: string) => {
  if (!untilId) {
    return '文字を入力してください';
  }
  const untilIdRegExp = /^[0-9]*$/;
  if (!(untilId.length >= 10 && untilId.length <= 25)) {
    return 'untilId 長さが不正です。10文字以上25文字以下としてください';
  }
  if (!untilId.match(untilIdRegExp)) {
    return 'untilId 書式が不正です。半角英数字としてください。';
  }
  return '';
};

const throwBadRequestException = (message: string) => {
  if (message) {
    throw new BadRequestException({
      statusCode: 400,
      message: message,
    });
  }
};

export const validationArg = (key: string, target: string) => {
  if (!target) return '文字を入力してください';
  switch (key) {
    case 'username':
      const usernamemessage = usernameValidation(target);
      throwBadRequestException(usernamemessage);
    case 'password':
      const passwordmessage = passwordValidation(target);
      throwBadRequestException(passwordmessage);
    case 'untilId':
      const untilIdmessage = untilIdValidation(target);
      throwBadRequestException(untilIdmessage);
  }
};
