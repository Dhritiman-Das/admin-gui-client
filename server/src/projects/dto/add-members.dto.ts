import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Permissions as ProjectPermissions,
  UserRoles,
} from 'src/mongo/user-mongo/user-mongo.schema';

export class AdvancedRoles {
  @IsEnum(ProjectPermissions, { each: true })
  query: ProjectPermissions;

  @IsEnum(ProjectPermissions, { each: true })
  mutate: ProjectPermissions;

  @IsEnum(ProjectPermissions, { each: true })
  members: ProjectPermissions;

  @IsEnum(ProjectPermissions, { each: true })
  projects: ProjectPermissions;
}

export class AddMembersDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsEnum(UserRoles)
  role: UserRoles;

  @IsNotEmpty()
  isAdvancedRolesOpen: boolean;

  @IsNotEmpty()
  @IsObject()
  advancedRoles: AdvancedRoles;
}

export class ProjectPermissionsDto {
  @IsMongoId()
  project: string;

  @IsEnum(UserRoles)
  role: UserRoles;

  @IsBoolean()
  isAdvancedSettings: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => AdvancedRoles)
  advancedSettings: AdvancedRoles;
}
