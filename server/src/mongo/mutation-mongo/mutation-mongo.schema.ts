import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, ObjectId } from 'mongoose';
import {
  Project,
  ProjectDocument,
} from '../project-mongo/project-mongo.schema';
import { User, UserDocument } from '../user-mongo/user-mongo.schema';

export type MutationDocument = HydratedDocument<Mutation>;

@Schema()
export class FieldObject {
  @Prop()
  field: string;

  @Prop()
  type: string;

  @Prop()
  required: boolean;
}

export const FieldObjectSchema = SchemaFactory.createForClass(FieldObject);

@Schema({
  _id: true,
  timestamps: true,
})
export class Mutation {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  project: ProjectDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;

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

  @Prop({ default: {}, type: {} })
  queryDataTypes: Record<string, any>;

  @Prop({ default: {}, type: {} })
  projection?: Record<string, number>;

  @Prop({ type: [FieldObjectSchema] })
  mutateObj: FieldObject[];

  @Prop({ type: Object, default: {} })
  sort?: Record<string, number>;

  //   @Prop({ default: {}, type: {} })
  //   collation?: Document;
}

export const MutationSchema = SchemaFactory.createForClass(Mutation);
