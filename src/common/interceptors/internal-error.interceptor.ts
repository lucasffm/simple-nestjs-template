import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
  ConflictException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ServerErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        if (error.routine == '_bt_check_unique') {
          throw new ConflictException(error.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
