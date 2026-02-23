import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Settings from '../../../models/Settings';

export async function GET() {
    try {
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
