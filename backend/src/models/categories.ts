import mongoose, { Schema, Document } from 'mongoose';

export interface Category extends Document {
  id?: number;
  name: string;
  description?: string;
  createdAt: Date;
  isActive: boolean;
  heder?: string;
  image?: string;
}

const CategorySchema: Schema = new Schema({
  id: {
    type: Number,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
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
