import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '../../../../lib/mongodb';
import ContactRequest from '../../../../models/ContactRequest';

export async function POST(req: Request) {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session || session.value !== 'authenticated') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { ids, action } = await req.json();
        const cleanIds = ids.map((id: string) => id.trim());

        if (!cleanIds || cleanIds.length === 0) {
            return NextResponse.json({ success: false, error: 'No valid IDs provided' }, { status: 400 });
        }

        await dbConnect();

        if (action === 'delete') {
            await ContactRequest.deleteMany({ _id: { $in: cleanIds } });
        } else if (action === 'archive') {
            await ContactRequest.updateMany({ _id: { $in: cleanIds } }, { isArchived: true });
        } else if (action === 'restore') {
            await ContactRequest.updateMany({ _id: { $in: cleanIds } }, { isArchived: false });
        } else {
            return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
