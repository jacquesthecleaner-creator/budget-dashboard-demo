// Mock data for demo version - April & May 2026

interface MockTransaction {
  date: string;
  amount: number;
  category: string;
  subcategory: string;
  description: string;
}

const aprilTransactions: MockTransaction[] = [
  // Groceries
  { date: '2026-04-02', amount: 85.42, category: 'Groceries', subcategory: 'Supermarket', description: 'Weekly grocery shopping' },
  { date: '2026-04-05', amount: 32.15, category: 'Groceries', subcategory: 'Farmers Market', description: 'Fresh produce' },
  { date: '2026-04-09', amount: 112.67, category: 'Groceries', subcategory: 'Supermarket', description: 'Weekly grocery shopping' },
  { date: '2026-04-16', amount: 78.34, category: 'Groceries', subcategory: 'Supermarket', description: 'Weekly grocery shopping' },
  { date: '2026-04-23', amount: 95.21, category: 'Groceries', subcategory: 'Supermarket', description: 'Weekly grocery shopping' },
  { date: '2026-04-28', amount: 55.89, category: 'Groceries', subcategory: 'Supermarket', description: 'Restocking pantry' },

  // Fuel
  { date: '2026-04-03', amount: 52.00, category: 'Fuel', subcategory: 'Gas', description: 'Fill up - Shell' },
  { date: '2026-04-10', amount: 48.50, category: 'Fuel', subcategory: 'Gas', description: 'Fill up - Chevron' },
  { date: '2026-04-17', amount: 55.75, category: 'Fuel', subcategory: 'Gas', description: 'Fill up - Shell' },
  { date: '2026-04-24', amount: 50.25, category: 'Fuel', subcategory: 'Gas', description: 'Fill up - Chevron' },

  // Utilities
  { date: '2026-04-01', amount: 145.00, category: 'Utilities', subcategory: 'Electricity', description: 'Electric bill - April' },
  { date: '2026-04-01', amount: 65.00, category: 'Utilities', subcategory: 'Internet', description: 'Internet service' },
  { date: '2026-04-01', amount: 89.99, category: 'Utilities', subcategory: 'Water', description: 'Water and sewage' },

  // Entertainment
  { date: '2026-04-08', amount: 15.99, category: 'Entertainment', subcategory: 'Streaming', description: 'Netflix subscription' },
  { date: '2026-04-12', amount: 45.00, category: 'Entertainment', subcategory: 'Dining', description: 'Dinner at restaurant' },
  { date: '2026-04-15', amount: 22.50, category: 'Entertainment', subcategory: 'Movies', description: 'Movie tickets' },
  { date: '2026-04-20', amount: 35.00, category: 'Entertainment', subcategory: 'Dining', description: 'Brunch with friends' },

  // Healthcare
  { date: '2026-04-06', amount: 28.99, category: 'Healthcare', subcategory: 'Pharmacy', description: 'Vitamins and supplements' },
  { date: '2026-04-14', amount: 75.00, category: 'Healthcare', subcategory: 'Medical', description: 'Doctor copay' },
];

const mayTransactions: MockTransaction[] = [
  // Groceries
  { date: '2026-05-02', amount: 92.35, category: 'Groceries', subcategory: 'Supermarket', description: 'Weekly grocery shopping' },
  { date: '2026-05-06', amount: 38.42, category: 'Groceries', subcategory: 'Farmers Market', description: 'Fresh produce' },
  { date: '2026-05-09', amount: 118.56, category: 'Groceries', subcategory: 'Supermarket', description: 'Weekly grocery shopping' },
  { date: '2026-05-16', amount: 85.20, category: 'Groceries', subcategory: 'Supermarket', description: 'Weekly grocery shopping' },
  { date: '2026-05-23', amount: 102.45, category: 'Groceries', subcategory: 'Supermarket', description: 'Weekly grocery shopping' },
  { date: '2026-05-29', amount: 62.75, category: 'Groceries', subcategory: 'Supermarket', description: 'Restocking pantry' },

  // Fuel
  { date: '2026-05-03', amount: 51.00, category: 'Fuel', subcategory: 'Gas', description: 'Fill up - Shell' },
  { date: '2026-05-10', amount: 49.75, category: 'Fuel', subcategory: 'Gas', description: 'Fill up - Chevron' },
  { date: '2026-05-17', amount: 54.50, category: 'Fuel', subcategory: 'Gas', description: 'Fill up - Shell' },
  { date: '2026-05-24', amount: 52.25, category: 'Fuel', subcategory: 'Gas', description: 'Fill up - Chevron' },

  // Utilities
  { date: '2026-05-01', amount: 152.00, category: 'Utilities', subcategory: 'Electricity', description: 'Electric bill - May' },
  { date: '2026-05-01', amount: 65.00, category: 'Utilities', subcategory: 'Internet', description: 'Internet service' },
  { date: '2026-05-01', amount: 92.50, category: 'Utilities', subcategory: 'Water', description: 'Water and sewage' },

  // Entertainment
  { date: '2026-05-08', amount: 15.99, category: 'Entertainment', subcategory: 'Streaming', description: 'Netflix subscription' },
  { date: '2026-05-12', amount: 58.00, category: 'Entertainment', subcategory: 'Dining', description: 'Dinner with family' },
  { date: '2026-05-15', amount: 19.99, category: 'Entertainment', subcategory: 'Movies', description: 'Movie tickets' },
  { date: '2026-05-22', amount: 42.50, category: 'Entertainment', subcategory: 'Dining', description: 'Lunch at cafe' },

  // Healthcare
  { date: '2026-05-05', amount: 28.99, category: 'Healthcare', subcategory: 'Pharmacy', description: 'Vitamins and supplements' },
  { date: '2026-05-18', amount: 150.00, category: 'Healthcare', subcategory: 'Medical', description: 'Dental checkup' },
];

export function getMockMonthData(month: number, year: number) {
  const transactions = (month === 4 && year === 2026) ? aprilTransactions : 
                      (month === 5 && year === 2026) ? mayTransactions : [];

  // Calculate summary
  let totalIncome = 0;
  let totalExpenses = 0;
  const byCategory: Record<string, number> = {};

  transactions.forEach(tx => {
    totalExpenses += tx.amount;
    if (!byCategory[tx.category]) {
      byCategory[tx.category] = 0;
    }
    byCategory[tx.category] += tx.amount;
  });

  return {
    month,
    year,
    transactions,
    summary: {
      totalIncome,
      totalExpenses,
      byCategory,
    },
  };
}

export const ALL_TRANSACTIONS = [...aprilTransactions, ...mayTransactions];
