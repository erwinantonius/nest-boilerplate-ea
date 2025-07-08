import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as qs from 'qs';

@Injectable()
export class QsParserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Ekstrak query string dari req.originalUrl
    const queryString = req.originalUrl.split('?')[1] || '';
    // Parsing ulang query params dengan qs
    req.query = qs.parse(queryString, {
      arrayLimit: Infinity,
      depth: 5,
    });
    next();
  }
}
