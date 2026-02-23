import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '../../../../lib/mongodb';
import Admin from '../../../../models/Admin';

export async function POST(req: Request) {
    try {
        const { password } = await req.json();
        await dbConnect();

        let admin = await Admin.findOne({ username: 'admin' });

        // Initial setup if no admin exists
        if (!admin) {
            const defaultPassword = process.env.ADMIN_PASSWORD || 'mystic2026';
            admin = await Admin.create({ username: 'admin', password: defaultPassword });
        }

        if (password === admin.password) {
            const response = NextResponse.json({ success: true });

            // Set a simple auth cookie
            (await cookies()).set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });

            return response;
        }

        return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
