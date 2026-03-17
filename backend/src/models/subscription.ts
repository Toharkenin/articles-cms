import mongoose, { Schema, Document } from 'mongoose';

export interface Subscription extends Document {
  email: string;
  isActive: boolean;
  subscribedAt: Date;
  unsubscribedAt?: Date;
}

const SubscriptionSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  unsubscribedAt: {
    type: Date,
    required: false,
  },
});

const SubscriptionModel = mongoose.model<Subscription>('Subscription', SubscriptionSchema);

export default SubscriptionModel;
