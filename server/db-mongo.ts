import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://intellitutorai123:w2nQz0Hbl3ME0rTA@intellitutorai.pq8w3g7.mongodb.net/?retryWrites=true&w=majority&appName=IntelliTutorAI';

if (!MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to environment variables');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;