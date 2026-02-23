import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
        }

        await dbConnect();

        // Check if already subscribed
        const existing = await Newsletter.findOne({ email });
        if (existing) {
            return NextResponse.json({ success: true, message: 'You are already in our circle!' });
        }

        await Newsletter.create({ email });

        return NextResponse.json({ success: true, message: 'Welcome to our spiritual community!' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: 'Failed to join. Please try again.' }, { status: 500 });
    }
}
