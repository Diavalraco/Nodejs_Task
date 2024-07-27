import { Document, Schema, model } from 'mongoose';
import { ITag } from './Tag';

export interface IPost extends Document {
  title: string;
  desc?: string;
  image?: string;
  tags: ITag[];
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  desc: { type: String },
  image: { type: String },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }]
});

export const Post = model<IPost>('Post', postSchema);
