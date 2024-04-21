import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { HistoryType } from 'src/mongo/history-mongo/history-mongo.schema';
import { Project } from 'src/mongo/project-mongo/project-mongo.schema';
import { Query } from 'src/mongo/query-mongo/query-mongo.schema';
import { User } from 'src/mongo/user-mongo/user-mongo.schema';
import { Mutation } from 'src/mongo/mutation-mongo/mutation-mongo.schema';

export class CreateHistoryDto {
  @IsNotEmpty()
  user: User;

  @IsNotEmpty()
  @IsString()
  @IsEnum(HistoryType)
  type: string;

  @IsOptional()
  query?: Query;

  @IsOptional()
  mutation?: Mutation;

  @IsNotEmpty()
  project: Project;

  @IsNotEmpty()
  @IsBoolean()
  success: boolean;

  @IsNotEmpty()
  @IsObject()
  queryValues: Record<string, any>;

  @IsOptional()
  @IsObject()
  mutationObjValues?: Record<string, any>;
}
