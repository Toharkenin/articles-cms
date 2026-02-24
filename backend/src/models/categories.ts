import mongoose, { Schema, Document } from 'mongoose';

export interface Category extends Document {
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  heder?: string;
  image?: string;
}

const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  heder: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
});

const CategoryModel = mongoose.model<Category>('Category', CategorySchema);

export default CategoryModel;
