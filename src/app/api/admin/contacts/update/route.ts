import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import ContactRequest from '@/models/ContactRequest';

export async function PATCH(req: Request) {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session || session.value !== 'authenticated') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id, notes } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
        }

        await dbConnect();

        const updated = await ContactRequest.findByIdAndUpdate(
            id,
            { notes },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ success: false, error: 'Contact not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updated });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
