import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    try {
        console.log("Testing MongoDB Connection...");
        console.log(`URI: ${process.env.MONGODB_URI?.split('@')[1]}`); // Log only host part for checking

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connection Successful!");

        // Optional: List collections to be sure
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections valid:", collections.length > 0);

        await mongoose.disconnect();
    } catch (error) {
        console.error("MongoDB Connection Failed:");
        console.error(error.message);
    }
};

run();
