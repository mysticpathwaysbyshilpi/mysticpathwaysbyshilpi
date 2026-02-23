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

        return NextResponse.json({ success: true, data: contactRequest }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
