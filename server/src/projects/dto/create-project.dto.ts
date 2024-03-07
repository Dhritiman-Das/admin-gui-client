import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { User } from 'src/mongo/user-mongo/user-mongo.schema';

export class CreateProjectDto {
  @IsEnum(['team', 'personal'])
  @IsNotEmpty()
  mode: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  dbConnectionString: string;

  // @IsBoolean()
  // @IsOptional()
  // deleted?: boolean;
}

export class CreateProjectWithAdminDto extends CreateProjectDto {
  @IsString()
  admin: User;
}
