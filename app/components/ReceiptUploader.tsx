'use client';

import { useState, useRef } from 'react';

interface ExtractedReceipt {
  date: string;
  amount: number;
  merchant: string;
  category: string;
  subcategory: string;
}

const CATEGORIES = {
  'Variable Expenses': [
    'Groceries',
    'Fuel',
    'Household',
    'Pet food',
    'Diapers',
    'Entertainment',
    'Eating Out',
    'Office Expense',
    'Shopping',
    'Medical Bills',
  ],
  'Monthly Bills': [
    'EzPass',
    'Water Softener',
    'Vehicle Maintenance',
    'Internet',
    'NIPSCO',
    'Health Insurance',
    'YMCA',
    'Life Insurance',
    'Car Insurance',
    'Telephone',
    'Netflix',
    'Disney/Hulu',
    'Pandora',
  ],
  Income: [],
  Savings: [],
  Debt: [],
};

export default function ReceiptUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<ExtractedReceipt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');
    setSuccess('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  }

  async function handleUpload() {
    if (!file) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/ocr/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to process receipt');
      }

      const result = await response.json();
      setExtracted(result.extracted);
      setSuccess('Receipt processed successfully! ✓');

      // Reset form after 2 seconds
      setTimeout(() => {
        setFile(null);
        setPreview(null);
        setExtracted(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Submit Receipt</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {preview ? (
              <div>
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 mx-auto mb-4 rounded"
                />
                <p className="text-sm text-gray-600 mb-2">{file?.name}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-600 font-medium">Click to upload receipt</p>
                <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {file && !extracted && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className="w-full mt-4 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Process Receipt'}
            </button>
          )}
        </div>

        {/* Extracted Data */}
        {extracted && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Extracted Data</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Date</p>
                <p className="font-medium text-gray-800">{extracted.date}</p>
              </div>
              <div>
                <p className="text-gray-600">Merchant</p>
                <p className="font-medium text-gray-800">{extracted.merchant}</p>
              </div>
              <div>
                <p className="text-gray-600">Amount</p>
                <p className="font-medium text-gray-800">${extracted.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Category</p>
                <p className="font-medium text-gray-800">{extracted.category}</p>
              </div>
              <div>
                <p className="text-gray-600">Subcategory</p>
                <p className="font-medium text-gray-800">{extracted.subcategory}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setExtracted(null);
                setFile(null);
                setPreview(null);
              }}
              className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Upload Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
