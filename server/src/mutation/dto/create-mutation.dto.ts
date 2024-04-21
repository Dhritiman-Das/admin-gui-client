import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsMongoId,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FieldObject } from 'src/mongo/mutation-mongo/mutation-mongo.schema';

export class CreateMutationDto {
  @IsMongoId()
  @IsNotEmpty()
  project: string;

  // @IsMongoId()
  // @IsNotEmpty()
  // author: string;

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

  @IsObject()
  @IsOptional()
  queryDataTypes: Record<string, any>;

  @IsObject()
  @IsOptional()
  projection: Record<string, number>;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FieldObject)
  mutateObj: FieldObject[];

  @IsObject()
  @IsOptional()
  sort: Record<string, number>;

  //   @IsObject()
  //   @IsOptional()
  //   collation: Record<string, any>;
}
