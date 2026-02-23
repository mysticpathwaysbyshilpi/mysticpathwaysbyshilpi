import mongoose from 'mongoose';

// Standard Mongoose connection caching for Next.js
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is missing in production.');
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            // Resource Management for Production (Hostinger)
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 8000,
            socketTimeoutMS: 45000,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts)
            .then((mongoose) => {
                return mongoose;
            })
            .catch((err) => {
                cached.promise = null; // Clear promise on failure to allow retry
                throw err;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null; // Ensure retry is possible on next request
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
