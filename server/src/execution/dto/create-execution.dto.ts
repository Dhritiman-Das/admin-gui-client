import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExecutionDto {
  @IsString()
  @IsNotEmpty()
  connectionString: string;

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
