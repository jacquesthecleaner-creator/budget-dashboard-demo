import { NextRequest, NextResponse } from 'next/server';
import { getMonthData } from '@/lib/google/sheets';
import { verifyToken } from '@/lib/auth/jwt';
import { getMockMonthData } from '@/lib/demo/mockData';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      await verifyToken(token);
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

    if (month < 1 || month > 12) {
      return NextResponse.json(
        { error: 'Invalid month' },
        { status: 400 }
      );
    }

    // Use demo data if DEMO_MODE is enabled
    let data;
    if (process.env.DEMO_MODE === 'true') {
      data = getMockMonthData(month, year);
    } else {
      data = await getMonthData(month, year);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Sheets data error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
