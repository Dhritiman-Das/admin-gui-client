import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request as ExpressRequest, NextFunction } from 'express';

interface Request extends ExpressRequest {
  project: string;
}

@Injectable()
export class ExtractProjectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const project = req.body.project;
    req.project = project;
    next();
  }
}
