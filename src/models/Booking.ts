import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    calComBookingId: {
        type: String,
        required: true,
        unique: true,
    },
    clientName: {
        type: String,
        required: true,
    },
    clientEmail: {
        type: String,
        required: true,
    },
    sessionType: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['BOOKED', 'CANCELLED', 'RESCHEDULED'],
        default: 'BOOKED',
    },
    meetingLink: {
        type: String,
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID'],
        default: 'PENDING',
    },
}, { timestamps: true });

if (mongoose.models.Booking) {
    delete mongoose.models.Booking;
}

const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;
