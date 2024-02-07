import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Project } from '../project-mongo/project-mongo.schema';
import { User } from '../user-mongo/user-mongo.schema';

export type QueryDocument = HydratedDocument<Query>;

@Schema({
  timestamps: true,
})
export class Query {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  project: Project;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  dbName: string;

  @Prop({ required: true })
  dbCollectionName: string;

  @Prop({ required: true })
  queryString: string;
}

export const QuerySchema = SchemaFactory.createForClass(Query);
