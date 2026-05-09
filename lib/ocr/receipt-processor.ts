import Anthropic from '@anthropic-ai/sdk';
import { Buffer } from 'buffer';

export interface ExtractedReceipt {
  date: string;
  amount: number;
  merchant: string;
  suggestedCategory: string;
  suggestedSubcategory: string;
  confidence: number;
  raw: string;
}

const categoryMap: Record<string, { category: string; subcategory: string }> = {
  // Grocery stores
  safeway: { category: 'Variable Expenses', subcategory: 'Groceries' },
  kroger: { category: 'Variable Expenses', subcategory: 'Groceries' },
  whole_foods: { category: 'Variable Expenses', subcategory: 'Groceries' },
  walmart: { category: 'Variable Expenses', subcategory: 'Groceries' },
  trader_joes: { category: 'Variable Expenses', subcategory: 'Groceries' },
  costco: { category: 'Variable Expenses', subcategory: 'Groceries' },
  
  // Fuel
  chevron: { category: 'Variable Expenses', subcategory: 'Fuel' },
  shell: { category: 'Variable Expenses', subcategory: 'Fuel' },
  bp: { category: 'Variable Expenses', subcategory: 'Fuel' },
  exxon: { category: 'Variable Expenses', subcategory: 'Fuel' },
  
  // Dining
  restaurant: { category: 'Variable Expenses', subcategory: 'Eating Out' },
  cafe: { category: 'Variable Expenses', subcategory: 'Eating Out' },
  starbucks: { category: 'Variable Expenses', subcategory: 'Eating Out' },
  mcdonalds: { category: 'Variable Expenses', subcategory: 'Eating Out' },
  chipotle: { category: 'Variable Expenses', subcategory: 'Eating Out' },
  
  // Entertainment
  movie: { category: 'Variable Expenses', subcategory: 'Entertainment' },
  cinema: { category: 'Variable Expenses', subcategory: 'Entertainment' },
  netflix: { category: 'Monthly Bills', subcategory: 'Netflix' },
  disney: { category: 'Monthly Bills', subcategory: 'Disney/Hulu' },
  
  // Utilities
  water: { category: 'Monthly Bills', subcategory: 'Water Softener' },
  nipsco: { category: 'Monthly Bills', subcategory: 'NIPSCO' },
  
  // Medical
  pharmacy: { category: 'Variable Expenses', subcategory: 'Medical Bills' },
  doctor: { category: 'Variable Expenses', subcategory: 'Medical Bills' },
  
  // Pet
  petco: { category: 'Variable Expenses', subcategory: 'Pet food' },
  petsmart: { category: 'Variable Expenses', subcategory: 'Pet food' },
};

function findBestCategory(merchant: string): { category: string; subcategory: string } {
  const normalizedMerchant = merchant.toLowerCase();

  // Exact match
  if (categoryMap[normalizedMerchant]) {
    return categoryMap[normalizedMerchant];
  }

  // Fuzzy match - check if merchant contains key keywords
  for (const [key, mapping] of Object.entries(categoryMap)) {
    if (normalizedMerchant.includes(key.replace('_', ' '))) {
      return mapping;
    }
  }

  // Default
  return { category: 'Variable Expenses', subcategory: 'Shopping' };
}

export async function processReceiptImage(
  imageBuffer: Buffer,
  imageMediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg'
): Promise<ExtractedReceipt> {
  const client = new Anthropic();

  const base64Image = imageBuffer.toString('base64');

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: imageMediaType,
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: `Extract receipt information from this image. Return a JSON object with:
- date (YYYY-MM-DD format)
- amount (numeric value only)
- merchant (store/business name)
- description (any additional details)

Return ONLY valid JSON, no other text.
Example: {"date":"2024-05-15","amount":25.50,"merchant":"Whole Foods","description":"Groceries"}`,
          },
        ],
      },
    ],
  });

  let extractedData: any = {};
  const rawText = message.content[0].type === 'text' ? message.content[0].text : '';

  try {
    extractedData = JSON.parse(rawText);
  } catch (error) {
    console.error('Failed to parse OCR response:', rawText);
    throw new Error('Failed to parse receipt data from image');
  }

  const { date, amount, merchant, description } = extractedData;

  if (!date || !amount || !merchant) {
    throw new Error('Missing required fields in receipt');
  }

  const categoryMapping = findBestCategory(merchant);

  return {
    date,
    amount: parseFloat(String(amount)),
    merchant,
    suggestedCategory: categoryMapping.category,
    suggestedSubcategory: categoryMapping.subcategory,
    confidence: 0.85, // Placeholder - could be calculated based on image quality
    raw: rawText,
  };
}
