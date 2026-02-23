import mongoose from 'mongoose';

const globalWithMongoose = global as typeof globalThis & {
    mongoose: { conn: any; promise: any } | undefined;
};

let cached = globalWithMongoose.mongoose;

if (!cached) {
    cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    console.log('Database connection temporarily disabled for debugging.');
    return { connection: { label: 'mocked' } };
}

export default dbConnect;
