import mongoose, { Schema, Document } from 'mongoose';

export interface Article extends Document {
  title: string;
  slug: string;
  content: string;
  author: string;
  category: string;
  image: string;
  isFeatured: boolean;
  createdAt: Date;
  isActive: boolean;
}

const ArticleSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {  
    type: String,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,  
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ArticleModel = mongoose.model<Article>('Article', ArticleSchema);

export default ArticleModel;
