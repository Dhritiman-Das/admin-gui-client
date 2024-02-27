import { IsEmail, IsEnum, IsNotEmpty, IsObject } from 'class-validator';

export class AdvancedRoles {
  @IsNotEmpty()
  @IsEnum(['read-only', 'read-write', 'admin'])
  query: string;

  @IsNotEmpty()
  @IsEnum(['read-only', 'read-write', 'admin'])
  mutate: string;

  @IsNotEmpty()
  @IsEnum(['read-only', 'read-write', 'admin'])
  members: string;

  @IsNotEmpty()
  @IsEnum(['read-only', 'read-write', 'admin'])
  projects: string;
}

export class AddMembersDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsEnum(['admin', 'developer', 'support'])
  role: string;

  @IsNotEmpty()
  isAdvancedRolesOpen: boolean;

  @IsNotEmpty()
  @IsObject()
  advancedRoles: AdvancedRoles;
}
