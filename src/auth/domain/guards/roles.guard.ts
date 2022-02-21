import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // デコレータで設定したメタデータを取得するため

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean {
    const requiredStatuses = this.reflector.get<string[]>(
      'statuses',
      ctx.getHandler(),
    );
    // そもそもデコレータの引数にロールをしていない ＝ 認可対象を設定していない ため、true を返却する
    if (!requiredStatuses) {
      return true;
    }
    // リクエストした userを取得
    const { user } = ctx.switchToHttp().getRequest();
    // リクエストした userがメタデータに設定したロールをuser.statusに保持していた場合 true を返却
    return requiredStatuses.some((status) => user.status.includes(status));
  }
}
