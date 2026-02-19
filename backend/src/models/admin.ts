import mongoose, { Schema, Document } from 'mongoose';

export interface Admin extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: 'super_admin' | 'admin';
}

const AdminSchema: Schema = new Schema({
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
     enum: ['super_admin', 'admin'],
     default: 'admin',
     required: true,
    }
});

const AdminModel = mongoose.model<Admin>('Admin', AdminSchema);

export default AdminModel;
