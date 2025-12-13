import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
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
