import { connect } from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGODB_URI, {
      // Add connection options for better stability
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Monitor connection events
    conn.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    conn.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    conn.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await conn.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
