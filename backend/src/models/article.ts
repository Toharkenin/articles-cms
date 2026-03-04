import mongoose, { Schema, Document } from 'mongoose';

export interface Article extends Document {
  id: number;
  articleId: string;
  title?: string;
  slug: string;
  author: string;
  category: mongoose.Types.ObjectId;
  isFeatured?: boolean;
  createdAt?: Date;
  status: 'draft' | 'published' | 'inactive' | 'archived';
  contentJson?: Object;
  contentHtml?: string;
  featuredImage?: string;
  languages?: string[];
}

const ArticleSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  articleId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: false,
  },
  slug: {
    type: String,
    required: false,
  },
  contentJson: {
    type: Object,
    required: false,
  },
  contentHtml: {
    type: String,
    required: false,
  },
  author: {
    type: String,
    required: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'inactive', 'archived'],
    default: 'draft',
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
