import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        default: 'admin',
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// For Next.js hot reloading
export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
