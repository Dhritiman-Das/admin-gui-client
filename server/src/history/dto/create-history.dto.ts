import { IsBoolean, IsNotEmpty, IsObject } from 'class-validator';
import { FlattenMaps, Types } from 'mongoose';
import { Project } from 'src/mongo/project-mongo/project-mongo.schema';
import { Query } from 'src/mongo/query-mongo/query-mongo.schema';
import { User } from 'src/mongo/user-mongo/user-mongo.schema';

export class CreateHistoryDto {
  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  query: Query;

  @IsNotEmpty()
  project: Project;

  @IsNotEmpty()
  @IsBoolean()
  success: boolean;

  @IsNotEmpty()
  @IsObject()
  queryValues: Record<string, any>;
}
