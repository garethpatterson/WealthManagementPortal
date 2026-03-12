/**
 * Wealth Manager Data Schema (Firestore Canada Region - northamerica-northeast1)
 *
 * COLLECTIONS:
 * 
 * users/{uid}
 *   - email: string
 *   - name: string
 *   - role: 'client' | 'advisor'
 *   - createdAt: timestamp
 *
 * accounts/{accountId}
 *   - userId: ref(users)
 *   - name: string (e.g., "Individual Brokerage", "RRSP")
 *   - type: 'Taxable' | 'Retirement' | 'Custodial'
 *   - balance: number
 *   - currency: 'CAD' | 'USD'
 * 
 * positions/{positionId}
 *   - accountId: ref(accounts)
 *   - symbol: string
 *   - shares: number
 *   - price: number
 *   - marketValue: number
 *   - costBasis: number
 * 
 * history/{historyId}
 *   - userId: ref(users)
 *   - date: string (YYYY-MM-DD)
 *   - netWorth: number
 *   - twr: number (Time-Weighted Return)
 *   - irr: number (Internal Rate of Return)
 */

export const MOCK_USER = {
  uid: "mock-client-uid-123",
  email: "client@example.com",
};

export const MOCK_ACCOUNTS = [
  { id: "acc-1", name: "Individual Taxable (CAD)", type: "Taxable", balance: 1450200.50, currency: "CAD" },
  { id: "acc-2", name: "Registered Retirement Savings Plan", type: "Retirement", balance: 825400.00, currency: "CAD" },
  { id: "acc-3", name: "Tax-Free Savings Account", type: "Taxable", balance: 95000.00, currency: "CAD" },
];

// Generate 60 months of history (5 years)
const generateHistory = () => {
  const history = [];
  const today = new Date();
  
  // Starting values 5 years ago
  let netWorth = 1500000;
  let benchmarkValue = 1500000;
  
  for (let i = 60; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    
    // Add some random volatility but generally trending up
    const portfolioReturn = (Math.random() * 0.04) - 0.01; // -1% to +3% per month
    const benchmarkReturn = (Math.random() * 0.05) - 0.015; // slightly more volatile
    
    netWorth = netWorth * (1 + portfolioReturn);
    benchmarkValue = benchmarkValue * (1 + benchmarkReturn);
    
    // Add scheduled contributions occasionally
    if (i % 6 === 0 && i !== 60) {
      netWorth += 25000; 
      benchmarkValue += 25000;
    }

    history.push({
      date: d.toISOString().split('T')[0],
      netWorth,
      benchmarkValue,
      twr: 0.04 + ((60 - i) * 0.001), 
      irr: 0.038 + ((60 - i) * 0.0008)
    });
  }
  return history;
};

export const MOCK_HISTORY = generateHistory();

export const MOCK_POSITIONS = [
  { accountId: "acc-1", symbol: "VFV.TO", name: "Vanguard S&P 500 ETF", shares: 4500, price: 124.50, costBasis: 105.20, marketValue: 560250, type: "Equity", region: "US" },
  { accountId: "acc-1", symbol: "XIC.TO", name: "iShares Core S&P/TSX Capped", shares: 8200, price: 34.10, costBasis: 30.00, marketValue: 279620, type: "Equity", region: "Canada" },
  { accountId: "acc-1", symbol: "RY.TO", name: "Royal Bank of Canada", shares: 1500, price: 135.20, costBasis: 98.50, marketValue: 202800, type: "Equity", region: "Canada" },
  { accountId: "acc-1", symbol: "AAPL", name: "Apple Inc.", shares: 800, price: 185.00, costBasis: 120.00, marketValue: 148000, type: "Equity", region: "US" },
  { accountId: "acc-2", symbol: "XBB.TO", name: "iShares Core Canadian Universe Bond", shares: 12500, price: 27.80, costBasis: 28.10, marketValue: 347500, type: "Fixed Income", region: "Canada" },
  { accountId: "acc-2", symbol: "XAW.TO", name: "iShares Core MSCI All Country World ex Canada", shares: 10500, price: 38.45, costBasis: 32.10, marketValue: 403725, type: "Equity", region: "Global" },
  { accountId: "acc-2", symbol: "TD.TO", name: "Toronto-Dominion Bank", shares: 900, price: 82.40, costBasis: 85.00, marketValue: 74160, type: "Equity", region: "Canada" },
  { accountId: "acc-3", symbol: "CASH.TO", name: "Global X High Interest Savings", shares: 1900, price: 50.04, costBasis: 50.00, marketValue: 95076, type: "Cash", region: "Canada" }
];

export const MOCK_ALLOCATION = [
  { name: 'Canadian Equity', value: 556580, color: '#2563eb' }, // blue-600
  { name: 'US Equity', value: 708250, color: '#3b82f6' },      // blue-500
  { name: 'Global Equity', value: 403725, color: '#60a5fa' },  // blue-400
  { name: 'Fixed Income', value: 347500, color: '#94a3b8' },   // slate-400
  { name: 'Cash equivalents', value: 95076, color: '#cbd5e1' } // slate-300
];

export const MOCK_DOCUMENTS = [
  { id: "doc-1", name: "Q4 2023 Quarterly Statement", type: "Statement", date: "2024-01-15", size: "1.2 MB" },
  { id: "doc-2", name: "2023 T5 Statement of Investment Income", type: "Tax Form", date: "2024-02-28", size: "845 KB" },
  { id: "doc-3", name: "2023 RRSP Contribution Receipt", type: "Tax Form", date: "2024-03-01", size: "420 KB" },
  { id: "doc-4", name: "Q3 2023 Quarterly Statement", type: "Statement", date: "2023-10-15", size: "1.1 MB" },
  { id: "doc-5", name: "Wealth Management Agreement", type: "Legal", date: "2022-06-10", size: "2.4 MB" },
];
