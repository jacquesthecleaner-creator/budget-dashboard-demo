import { NextRequest, NextResponse } from 'next/server';
import { processReceiptImage } from '@/lib/ocr/receipt-processor';
import { appendTransaction, getMonthData } from '@/lib/google/sheets';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request: NextRequest) {
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

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const confirmCategory = formData.get('confirmCategory') === 'true';
    const category = formData.get('category') as string;
    const subcategory = formData.get('subcategory') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

    // Process receipt with OCR
    const extracted = await processReceiptImage(buffer, mimeType);

    // Use confirmed category if provided, otherwise use suggested
    if (confirmCategory && category && subcategory) {
      extracted.suggestedCategory = category;
      extracted.suggestedSubcategory = subcategory;
    }

    // Determine the correct sheet name (month/year)
    const [year, month, day] = extracted.date.split('-');
    const monthNum = parseInt(month);
    const monthName = new Date(parseInt(year), monthNum - 1).toLocaleString('default', {
      month: 'long',
    });
    const sheetName = `${monthName} ${year}`;

    // Append to Google Sheets
    await appendTransaction(sheetName, {
      date: extracted.date,
      amount: extracted.amount,
      category: extracted.suggestedCategory,
      subcategory: extracted.suggestedSubcategory,
      description: extracted.merchant,
    });

    return NextResponse.json(
      {
        success: true,
        extracted: {
          date: extracted.date,
          amount: extracted.amount,
          merchant: extracted.merchant,
          category: extracted.suggestedCategory,
          subcategory: extracted.suggestedSubcategory,
        },
        message: 'Receipt processed and saved successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('OCR processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process receipt' },
      { status: 500 }
    );
  }
}
