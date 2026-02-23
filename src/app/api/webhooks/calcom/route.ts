import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '../../../../lib/mongodb';
import Booking from '../../../../models/Booking';

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-cal-signature-256');
        const webhookSecret = process.env.CALCOM_WEBHOOK_SECRET;

        // Verify signature if secret is configured
        if (webhookSecret && signature) {
            const hmac = crypto.createHmac('sha256', webhookSecret);
            const digest = hmac.update(rawBody).digest('hex');
            if (signature !== digest) {
                console.error('Invalid Cal.com webhook signature');
                return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
            }
        }

        const body = JSON.parse(rawBody);
        const { triggerEvent, payload } = body;

        if (!payload) {
            return NextResponse.json({ error: 'No payload provided' }, { status: 400 });
        }

        await dbConnect();

        // Map Cal.com payment status to our internal enum
        // Cal.com typical values: 'PAID', 'UNPAID', etc.
        const calPaymentStatus = payload.paymentStatus || (payload.metadata?.paymentStatus);
        const paymentStatus = calPaymentStatus === 'PAID' ? 'PAID' : 'PENDING';

        const bookingData = {
            calComBookingId: payload.uid,
            clientName: payload.attendees?.[0]?.name || 'Unknown',
            clientEmail: payload.attendees?.[0]?.email || 'Unknown',
            sessionType: payload.type || 'Standard Session',
            startTime: new Date(payload.startTime),
            endTime: new Date(payload.endTime),
            meetingLink: payload.metadata?.videoCallUrl || payload.location || '',
            status: triggerEvent === 'BOOKING_CANCELLED' ? 'CANCELLED' :
                triggerEvent === 'BOOKING_RESCHEDULED' ? 'RESCHEDULED' : 'BOOKED',
            paymentStatus
        };

        // Always use findOneAndUpdate with upsert to handle any event sequence
        await Booking.findOneAndUpdate(
            { calComBookingId: payload.uid },
            { $set: bookingData },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}
