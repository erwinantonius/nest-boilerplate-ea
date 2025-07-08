import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotAcceptableException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MongoServerError } from 'mongodb';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    Logger.log(`Before... ${context.getArgs()[0].url}`);
    const now = Date.now();
    return next
      .handle()
      .pipe(
        catchError((error) => {
          Logger.log(error);
          if (error instanceof MongoServerError) {
            throw new NotAcceptableException(error.message);
          } else {
            throw error;
          }
        }),
      )
      .pipe(tap(() => Logger.log(`After... ${Date.now() - now}ms`)));
  }
}
