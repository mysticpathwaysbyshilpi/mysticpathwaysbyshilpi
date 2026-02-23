import mongoose from 'mongoose';

const globalWithMongoose = global as typeof globalThis & {
    mongoose: { conn: any; promise: any } | undefined;
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
    cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached!.conn) {
        return cached!.conn;
    }

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        const envKeys = Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('PASSWORD') && !k.includes('KEY'));
        console.error('DATABASE_ERROR: MONGODB_URI is missing.');
        console.error('Available Environment Keys:', envKeys);
        throw new Error('MONGODB_URI is not defined. Please check your environment variables.');
    }

    if (!cached!.promise) {
        const opts = {
            bufferCommands: false,
            // Strict resource conservation for Hostinger
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 15000,
            maxPoolSize: 1, // Stay extremely lean
        };

        cached!.promise = mongoose.connect(MONGODB_URI!, opts)
            .then((mongoose) => {
                return mongoose;
            })
            .catch((err) => {
                cached!.promise = null; // Reset on failure
                throw err;
            });
    }

    try {
        cached!.conn = await cached!.promise;
    } catch (e) {
        cached!.promise = null; // Ensure retry possible
        throw e;
    }

    return cached!.conn;
}

export default dbConnect;
