import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import ContactRequest from '../../../models/ContactRequest';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();

        if (!data.email && !data.phone) {
            return NextResponse.json({ success: false, error: 'Either email or phone must be provided.' }, { status: 400 });
        }

        const contactRequest = await ContactRequest.create(data);

        // Send email notification asynchronously (don't block the response)
        const { sendContactEmail } = await import('../../../lib/mail');
        sendContactEmail(data).catch(err => console.error('Failed to send contact email:', err));

        return NextResponse.json({ success: true, data: contactRequest }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
