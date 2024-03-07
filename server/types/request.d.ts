import { Request } from 'express';
import { User, UserDocument } from 'src/mongo/user-mongo/user-mongo.schema';

export interface RequestWithUser extends Request {
  user: UserDocument & { userId: User };
}
