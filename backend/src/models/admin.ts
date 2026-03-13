import mongoose, { Schema, Document } from 'mongoose';

export interface Admin extends Document {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'super_admin' | 'site_editor' | 'section_editor' | 'author';
}

const AdminSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['super_admin', 'site_editor', 'section_editor', 'author'],
    default: 'author',
    required: true,
  },
});

const AdminModel = mongoose.model<Admin>('Admin', AdminSchema);

export default AdminModel;
