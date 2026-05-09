'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface Transaction {
  date: string;
  amount: number;
  category: string;
  subcategory: string;
  description: string;
}

interface MonthData {
  month: string;
  year: number;
  transactions: Transaction[];
  summary: {
    totalIncome: number;
    totalExpenses: number;
    byCategory: Record<string, number>;
  };
}

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16',
];

export default function Dashboard() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<MonthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [month, year]);

  async function fetchData() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/sheets/data?month=${month}&year=${year}`);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const monthData = await response.json();
      setData(monthData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const categoryData = Object.entries(data.summary.byCategory).map(([name, value]) => ({
    name,
    value: parseFloat(String(value).toFixed(2)),
  }));

  const monthDates = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(year, i);
    return { month: format(d, 'MMM'), month_num: i + 1 };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Budget Dashboard</h1>
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                  <option key={m} value={m}>
                    {format(new Date(year, m - 1), 'MMMM')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {[2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">
              Total Income
            </h3>
            <p className="text-3xl font-bold text-green-600">
              ${data.summary.totalIncome.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">
              Total Expenses
            </h3>
            <p className="text-3xl font-bold text-red-600">
              ${data.summary.totalExpenses.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">
              Net
            </h3>
            <p
              className={`text-3xl font-bold ${
                data.summary.totalIncome - data.summary.totalExpenses >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              ${(data.summary.totalIncome - data.summary.totalExpenses).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart - Category Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Spending by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Category Comparison */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Expenses by Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Transactions ({data.transactions.length})
          </h2>
          {data.transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions.map((tx, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 text-gray-600">{tx.date}</td>
                      <td className="py-3 px-2 text-gray-800">{tx.description}</td>
                      <td className="py-3 px-2">
                        <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {tx.subcategory}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-semibold text-gray-800">
                        ${tx.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No transactions for this month</p>
          )}
        </div>
      </div>
    </div>
  );
}
