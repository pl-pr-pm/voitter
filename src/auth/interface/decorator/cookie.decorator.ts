import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
// パラメータにCookie名の指定があれば、指定のCookieの値を返却
// パラメータにCookie名の指定がなければ、Cookie全てを返却
// 該当するものがなければ、BadRequestをスロー

export const Cookies = createParamDecorator(
  (cookieName: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const headers = request.headers;
    const cookies: string[] = headers.cookie?.split(';');
    if (!cookies)
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Cookieが設定されているか確認してください',
      });

    if (cookieName === undefined) return cookies;
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      const replaceKey = key.replace(' ', '');
      if (cookieName === replaceKey) {
        return value;
      }
    }
    throw new BadRequestException({
      status: HttpStatus.BAD_REQUEST,
      error: 'Cookieが設定されているか確認してください',
    });
  },
);
