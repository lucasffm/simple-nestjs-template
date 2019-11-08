import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ServerErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        if (error.routine == '_bt_check_unique') {
          throw new ConflictException(error.detail);
        } else if (error.routine === 'ExecConstraints') {
          throw new BadRequestException(
            `Missing required field ${error.column}`,
          );
        } else {
          throw error;
        }
      }),
    );
  }
}
