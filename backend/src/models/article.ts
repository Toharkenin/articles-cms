import mongoose, { Schema, Document } from 'mongoose';

export interface Article extends Document {
  title: string;
  slug: string;
  author: string;
  category: mongoose.Types.ObjectId;
  image: string;
  isFeatured: boolean;
  createdAt: Date;
  isActive: boolean;
  contentJson: Object;
  contentHtml?: string;
  featuredImage?: string;
  languages?: string[];
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
  contentJson: {
    type: Object,
    required: true,
  },
  contentHtml: {
    type: String,
    required: false,
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
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
  featuredImage: {
    type: String,
    required: false,
  },
  languages: {
    type: [String],
    required: false,
  },
});

const ArticleModel = mongoose.model<Article>('Article', ArticleSchema);

export default ArticleModel;
