import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ProjectDocument } from '../project-mongo/project-mongo.schema';
import mongoose, { HydratedDocument } from 'mongoose';
import {
  ProjectPermissionsDocument,
  ProjectPermissionsSchema,
} from '../user-mongo/user-mongo.schema';

export type WaitlistsDocument = HydratedDocument<Waitlists>;

@Schema({ timestamps: true })
export class Waitlists {
  @Prop({ required: true, type: String })
  email: string;

  @Prop({ type: [ProjectPermissionsSchema], default: [] })
  project: ProjectPermissionsDocument[];
}

export const WaitlistsSchema = SchemaFactory.createForClass(Waitlists);
