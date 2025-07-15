import mongoose from 'mongoose';

export interface IMessage {
  _id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
}

export interface IChat {
  _id: string;
  userId: string;
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  }
}, {
  timestamps: true
});

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'New Chat'
  },
  messages: [messageSchema]
}, {
  timestamps: true
});

export default mongoose.model<IChat>('Chat', chatSchema);