import { NextRequest, NextResponse } from 'next/server';

// Note: For production, use proper webhook setup
// This is a simplified version for demonstration

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify webhook token
    const token = request.headers.get('x-telegram-bot-api-secret-token');
    if (token !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Webhook received:', body);

    // Process update (photo, message, etc.)
    // Integration with BudgetBot would go here

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
