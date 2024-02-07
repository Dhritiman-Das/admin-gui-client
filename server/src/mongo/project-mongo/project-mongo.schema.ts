import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Query as DbQuery } from '../query-mongo/query-mongo.schema';
import { User } from '../user-mongo/user-mongo.schema';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
  @Prop({ enum: ['team', 'personal'], required: true })
  mode: string;

  @Prop({ default: '' })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  dbConnectionString: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  admin: User;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  members: User[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: DbQuery.name }],
    default: [],
  })
  queries?: DbQuery[];

  @Prop({ default: false })
  deleted?: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
