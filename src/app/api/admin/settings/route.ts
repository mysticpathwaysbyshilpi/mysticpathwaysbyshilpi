import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session || session.value !== 'authenticated') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();
        const settings = await Settings.find({ key: { $in: ['calComLink', 'meetingTypes'] } });

        const result: any = {};
        settings.forEach(s => {
            result[s.key] = s.value;
        });

        return NextResponse.json({
            calComLink: result.calComLink || 'shilpi-mystic-pathways/session',
            meetingTypes: result.meetingTypes || []
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const session = (await cookies()).get('admin_session');
        if (!session || session.value !== 'authenticated') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { calComLink, meetingTypes } = body;

        await dbConnect();

        if (calComLink !== undefined) {
            await Settings.findOneAndUpdate(
                { key: 'calComLink' },
                { value: calComLink },
                { upsert: true, new: true }
            );
        }

        if (meetingTypes !== undefined) {
            await Settings.findOneAndUpdate(
                { key: 'meetingTypes' },
                { value: meetingTypes },
                { upsert: true, new: true }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Settings update error:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
