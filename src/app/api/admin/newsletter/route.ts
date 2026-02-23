import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';

export async function GET(req: Request) {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session || session.value !== 'authenticated') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = (page - 1) * limit;

        await dbConnect();

        const [subscribers, total] = await Promise.all([
            Newsletter.find({}).sort({ subscribedAt: -1 }).skip(skip).limit(limit),
            Newsletter.countDocuments({})
        ]);

        return NextResponse.json({
            success: true,
            data: subscribers,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session || session.value !== 'authenticated') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { ids } = await req.json();
        if (!ids || ids.length === 0) {
            return NextResponse.json({ success: false, error: 'No IDs provided' }, { status: 400 });
        }

        await dbConnect();
        await Newsletter.deleteMany({ _id: { $in: ids } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
