import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const route = context.switchToHttp().getRequest().route;
    const request = route?.methods;
    const path = route?.path;

    const excludePath = ['/api/order-hook', '/api/product-hook'];
    if (!request.post || !excludePath.includes(path))
      return next.handle().pipe(map((data) => ({ data })));
    return next.handle();
  }
}
