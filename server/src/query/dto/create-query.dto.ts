import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Project } from 'src/mongo/project-mongo/project-mongo.schema';
import { User } from 'src/mongo/user-mongo/user-mongo.schema';

export class CreateQueryDto {
  // @IsString()
  // @IsNotEmpty()
  // author: User;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  dbName: string;

  @IsString()
  @IsNotEmpty()
  dbCollectionName: string;

  @IsString()
  @IsNotEmpty()
  queryString: string;
}
