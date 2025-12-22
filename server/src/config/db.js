import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // WHY: Tune pool & timeouts to avoid stalls under bursty tracking writes
      maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE || 50),
      serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 5000),
      socketTimeoutMS: Number(process.env.MONGO_SOCKET_TIMEOUT_MS || 20000),
      // Legacy flags for compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ Database: ${conn.connection.name}`);
    
    // Warn if not using 'eatclub' database
    if (conn.connection.name !== 'eatclub') {
      console.warn(`⚠️  WARNING: Using database "${conn.connection.name}" instead of "eatclub"`);
      console.warn(`⚠️  Please update MONGODB_URI in .env to use /eatclub`);
    }
    
    return conn;
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
