import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const logger = new Logger();
    logger.log(error.message);
    if (process.env.NODE_ENV === 'development') logger.log(error.stack);

    let status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      return response
        .status(status)
        .json({ statusCode: status, error: error.message });
    } else {
      return response.status(status).json(error.message);
    }
  }
}
