import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '../../../../lib/mongodb';
import Admin from '../../../../models/Admin';

export async function POST(req: Request) {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session || session.value !== 'authenticated') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
        }

        await dbConnect();

        let admin = await Admin.findOne({ username: 'admin' });

        if (!admin) {
            return NextResponse.json({ success: false, error: 'Admin account not initialized' }, { status: 404 });
        }

        if (admin.password !== currentPassword) {
            return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 401 });
        }

        admin.password = newPassword;
        await admin.save();

        return NextResponse.json({ success: true, message: 'Password changed successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
