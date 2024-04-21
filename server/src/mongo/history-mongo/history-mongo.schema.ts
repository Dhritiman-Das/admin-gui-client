import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user-mongo/user-mongo.schema';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Query } from '../query-mongo/query-mongo.schema';
import { Project } from '../project-mongo/project-mongo.schema';
import { Mutation } from '../mutation-mongo/mutation-mongo.schema';

export type HistoryDocument = HydratedDocument<History>;

export enum HistoryType {
  QUERY = 'query',
  MUTATION = 'mutation',
}
@Schema({
  timestamps: true,
})
export class History {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    type: String,
    enum: HistoryType,
    validate: {
      validator: function (value: string) {
        if (value === HistoryType.QUERY) {
          return this.query != null && this.mutationObjValues == null;
        } else if (value === HistoryType.MUTATION) {
          return this.mutation != null && this.mutationObjValues != null;
        }
        return false;
      },
      message: () => `Invalid combination of type and properties`,
    },
  })
  type: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Query' })
  query?: Query;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Mutation' })
  mutation?: Mutation;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  project: Project;

  @Prop({ type: Boolean })
  success: boolean;

  @Prop({ type: Object })
  queryValues: Record<string, any>;

  @Prop({ type: Object })
  mutationObjValues?: Record<string, any>;
}

export const HistorySchema = SchemaFactory.createForClass(History);
