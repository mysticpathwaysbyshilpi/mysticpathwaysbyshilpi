import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '../../../../lib/mongodb';
import ContactRequest from '../../../../models/ContactRequest';

export async function GET(req: Request) {
    try {
        // Simple security check
        const session = (await cookies()).get('admin_session');
        if (!session || session.value !== 'authenticated') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const archived = searchParams.get('archived') === 'true';
        const sortField = searchParams.get('sortField') || 'date';
        const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;
        const search = searchParams.get('search') || '';
        const skip = (page - 1) * limit;

        await dbConnect();

        const searchFilter = search ? {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { countryCode: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } },
                { notes: { $regex: search, $options: 'i' } },
            ]
        } : {};

        const query = {
            ...(archived ? { isArchived: true } : { isArchived: { $ne: true } }),
            ...searchFilter
        };

        // Multi-tasking counts
        const Booking = (await import('../../../../models/Booking')).default;
        const Newsletter = (await import('../../../../models/Newsletter')).default;
        const [total, activeCount, archivedCount, bookingsCount, newsletterCount] = await Promise.all([
            ContactRequest.countDocuments(query),
            ContactRequest.countDocuments({ isArchived: { $ne: true }, ...searchFilter }),
            ContactRequest.countDocuments({ isArchived: true, ...searchFilter }),
            Booking.countDocuments(),
            Newsletter.countDocuments()
        ]);

        const contacts = await ContactRequest.find(query)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit);

        return NextResponse.json({
            success: true,
            data: contacts,
            counts: {
                active: activeCount,
                archived: archivedCount,
                bookings: bookingsCount,
                newsletter: newsletterCount
            },
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
