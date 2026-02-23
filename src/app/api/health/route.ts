import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'online',
        time: new Date().toISOString(),
        version: '2.0.1 (Celestial)',
        node_env: process.env.NODE_ENV
    });
}
