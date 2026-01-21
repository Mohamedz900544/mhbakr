
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vetcare';
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, 
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Do not exit process in dev to allow hot reload to try again
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

export default connectDB;
