import mongoose from 'mongoose';

const ContactRequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
        type: String,
        required: false,
        maxlength: [100, 'Email cannot be more than 100 characters'],
    },
    phone: {
        type: String,
        required: false,
        maxlength: [15, 'Phone cannot be more than 15 characters'],
    },
    countryCode: {
        type: String,
        required: false,
        maxlength: [5, 'Country code cannot be more than 5 characters'],
    },
    message: {
        type: String,
        required: [true, 'Please provide a message.'],
        maxlength: [1000, 'Message cannot be more than 1000 characters'],
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    notes: {
        type: String,
        default: '',
    },
});

export default mongoose.models.ContactRequest || mongoose.model('ContactRequest', ContactRequestSchema);
