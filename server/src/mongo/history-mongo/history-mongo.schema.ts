import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user-mongo/user-mongo.schema';
import mongoose, { HydratedDocument } from 'mongoose';
import { Query } from '../query-mongo/query-mongo.schema';
import { Project } from '../project-mongo/project-mongo.schema';

export type HistoryDocument = HydratedDocument<History>;

@Schema({
  timestamps: true,
})
export class History {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Query' })
  query: Query;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  project: Project;

  @Prop({ type: Boolean })
  success: boolean;

  @Prop({ type: Object })
  queryValues: Record<string, any>;
}

export const HistorySchema = SchemaFactory.createForClass(History);
