import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'NIMS'
    });

    console.log('✅ MongoDB connected');

    mongoose.connection.on('disconnected', () =>
      console.log('❌ MongoDB disconnected')
    );

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
