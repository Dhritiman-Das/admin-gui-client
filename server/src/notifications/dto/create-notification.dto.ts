import {
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { NotificationType } from 'src/mongo/notifications-mongo/notifications-mongo.schema';

export class CreateNotificationDto {
  @IsString()
  message: string;

  @IsMongoId()
  user: string;

  @IsMongoId()
  receivedFrom: string;

  @IsOptional()
  @IsBoolean()
  seen?: boolean;

  @IsOptional()
  @IsString()
  redirectTo?: string;

  @IsEnum(NotificationType)
  type: NotificationType;
}
