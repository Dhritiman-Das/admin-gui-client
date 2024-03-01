import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserDocument } from '../user-mongo/user-mongo.schema';
import mongoose, { HydratedDocument } from 'mongoose';

export enum NotificationType {
  Query = 'Query',
  Mutation = 'Mutation',
  History = 'History',
  Members = 'Members',
  Project = 'Project',
  General = 'General',
}

export enum ButtonVariant {
  Primary = 'Primary',
  Secondary = 'Secondary',
  Success = 'Success',
  Danger = 'Danger',
  Warning = 'Warning',
  Info = 'Info',
  Light = 'Light',
  Dark = 'Dark',
}

export type NotificationsDocument = HydratedDocument<Notifications>;

@Schema({ _id: false })
export class Buttons {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: false,
    enum: ButtonVariant,
    default: ButtonVariant.Primary,
  })
  variant: ButtonVariant;

  @Prop({ required: true })
  targetUrl: string;
}

@Schema({ timestamps: true })
export class Notifications {
  @Prop({ required: true })
  message: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: UserDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  receivedFrom: UserDocument;

  @Prop({ default: false })
  seen: boolean;

  @Prop({ required: false })
  redirectTo: string;

  @Prop({ required: false, default: [] })
  buttons: Buttons[];

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;
}

export const NotificationsSchema = SchemaFactory.createForClass(Notifications);
