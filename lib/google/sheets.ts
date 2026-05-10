import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

interface Transaction {
  date: string;
  amount: number;
  category: string;
  subcategory: string;
  description: string;
}

interface SheetMonthData {
  month: string;
  year: number;
  transactions: Transaction[];
  summary: {
    totalIncome: number;
    totalExpenses: number;
    byCategory: Record<string, number>;
  };
}

const sheets = google.sheets('v4');

let authClient: JWT | null = null;

function getAuthClient(): JWT {
  if (authClient) return authClient;

  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!privateKey || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    throw new Error('Missing Google credentials in environment');
  }

  authClient = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return authClient;
}

export async function getSheetData(
  sheetName: string
): Promise<string[][]> {
  const auth = getAuthClient();

  const response = await sheets.spreadsheets.values.get({
    auth: auth as any,
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: `${sheetName}!A:E`,
  });

  return response.data.values || [];
}

export async function appendTransaction(
  sheetName: string,
  transaction: Transaction
): Promise<void> {
  const auth = getAuthClient();

  await sheets.spreadsheets.values.append({
    auth: auth as any,
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: `${sheetName}!A:E`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [
          transaction.date,
          transaction.amount,
          transaction.category,
          transaction.subcategory,
          transaction.description,
        ],
      ],
    },
  });
}

export async function getMonthData(month: number, year: number): Promise<SheetMonthData> {
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
  const sheetName = `${monthName} ${year}`;

  try {
    const rows = await getSheetData(sheetName);

    if (!rows || rows.length === 0) {
      return {
        month: monthName,
        year,
        transactions: [],
        summary: {
          totalIncome: 0,
          totalExpenses: 0,
          byCategory: {},
        },
      };
    }

    // Skip header row
    const transactions: Transaction[] = [];
    const categoryTotals: Record<string, number> = {};
    let totalIncome = 0;
    let totalExpenses = 0;

    for (let i = 1; i < rows.length; i++) {
      const [date, amount, category, subcategory, description] = rows[i];

      if (!date || !amount) continue;

      const numAmount = parseFloat(String(amount));

      const transaction: Transaction = {
        date: String(date),
        amount: numAmount,
        category: String(category),
        subcategory: String(subcategory),
        description: String(description),
      };

      transactions.push(transaction);

      // Track by category
      categoryTotals[category] = (categoryTotals[category] || 0) + numAmount;

      // Separate income and expenses
      if (String(category).toLowerCase() === 'income') {
        totalIncome += numAmount;
      } else {
        totalExpenses += numAmount;
      }
    }

    return {
      month: monthName,
      year,
      transactions,
      summary: {
        totalIncome,
        totalExpenses,
        byCategory: categoryTotals,
      },
    };
  } catch (error) {
    console.error(`Error fetching sheet data for ${sheetName}:`, error);
    throw error;
  }
}

export async function getAllMonthData(year: number): Promise<SheetMonthData[]> {
  const results: SheetMonthData[] = [];

  for (let month = 1; month <= 12; month++) {
    try {
      const data = await getMonthData(month, year);
      if (data.transactions.length > 0 || month <= new Date().getMonth() + 1) {
        results.push(data);
      }
    } catch (error) {
      console.warn(`Failed to fetch ${month}/${year}`);
    }
  }

  return results;
}
