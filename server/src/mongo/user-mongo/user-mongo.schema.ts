import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import {
  Project,
  ProjectDocument,
} from '../project-mongo/project-mongo.schema';

export type UserDocument = HydratedDocument<User>;
export type ProjectPermissionsDocument = HydratedDocument<ProjectPermissions>;

export enum UserRoles {
  admin = 'admin',
  developer = 'developer',
  support = 'support',
}

export enum Permissions {
  ReadOnly = 'read-only',
  ReadWrite = 'read-write',
  Admin = 'admin',
}

// type PermissionsType = (typeof Permissions)[keyof typeof Permissions];

type PermissionsType = 'read-only' | 'read-write' | 'admin';

@Schema({ _id: false })
export class AdvancedSettings {
  @Prop({
    type: String,
    enum: Object.values(Permissions),
    default: Permissions.ReadOnly,
  })
  query: PermissionsType;

  @Prop({
    type: String,
    enum: Object.values(Permissions),
    default: Permissions.ReadOnly,
  })
  mutate: PermissionsType;

  @Prop({
    type: String,
    enum: Object.values(Permissions),
    default: Permissions.ReadOnly,
  })
  members: PermissionsType;

  @Prop({
    type: String,
    enum: Object.values(Permissions),
    default: Permissions.ReadOnly,
  })
  projects: PermissionsType;
}

export const AdvancedSettingsSchema =
  SchemaFactory.createForClass(AdvancedSettings);

@Schema({ _id: false })
export class ProjectPermissions {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  project: ProjectDocument;

  @Prop({ enum: UserRoles, default: UserRoles.support })
  role: UserRoles;

  @Prop({ default: false })
  isAdvancedSettings: boolean;

  @Prop({ type: AdvancedSettings, default: () => ({}) })
  advancedSettings: HydratedDocument<AdvancedSettings>;
}

export const ProjectPermissionsSchema =
  SchemaFactory.createForClass(ProjectPermissions);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: false })
  verified: boolean;

  @Prop({ default: '' })
  profilePic: string;

  @Prop({ default: '' })
  telephone?: string;

  @Prop({ default: '' })
  displayName?: string;

  @Prop({ default: '' })
  title?: string;

  @Prop({ default: '' })
  timeZone?: string;

  @Prop({ default: '' })
  bio?: string;

  @Prop({ default: '' })
  namePronounciation?: string;

  @Prop({
    type: [ProjectPermissionsSchema],
    default: [],
  })
  projects?: ProjectPermissionsDocument[];

  @Prop({
    type: [ProjectPermissionsSchema],
    default: [],
  })
  invitedProjects?: ProjectPermissionsDocument[];

  @Prop({ default: false })
  deleted?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
