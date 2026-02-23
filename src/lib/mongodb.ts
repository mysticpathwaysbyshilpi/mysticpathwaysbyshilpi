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
        throw new Error('MONGODB_URI is not defined. Please check your environment variables.');
    }

    if (!cached!.promise) {
        const opts = {
            bufferCommands: false,
            // Strict resource conservation for Hostinger
            serverSelectionTimeoutMS: 3000,
            socketTimeoutMS: 15000,
            maxPoolSize: 1,
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
