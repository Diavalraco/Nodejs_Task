import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  name: string;
}

const tagSchema = new Schema<ITag>({
  name: { type: String, required: true }
});

export const Tag = mongoose.model<ITag>('Tag', tagSchema);
