import { IsBoolean, IsNotEmpty, IsObject } from 'class-validator';
import { Query } from 'src/mongo/query-mongo/query-mongo.schema';
import { User } from 'src/mongo/user-mongo/user-mongo.schema';

export class CreateHistoryDto {
  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  query: Query;

  @IsNotEmpty()
  @IsBoolean()
  success: boolean;

  @IsNotEmpty()
  @IsObject()
  queryValues: Record<string, any>;
}
