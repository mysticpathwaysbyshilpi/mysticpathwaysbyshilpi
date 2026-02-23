// Database connection fully disabled for debugging
// import mongoose from 'mongoose';

async function dbConnect() {
    console.log('Database connection fully disabled for debugging.');
    // Return a dummy object to satisfy API consumers
    return { connection: { label: 'fully-disabled' } };
}

export default dbConnect;
