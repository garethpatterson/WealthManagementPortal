import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useClientData, usePortfolioHistory, usePositions } from '../hooks/useData';
import { ShieldCheck, TrendingUp, DollarSign, Activity, PieChart, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { data: clientData, loading: clientLoading } = useClientData();
  const { history, loading: historyLoading } = usePortfolioHistory();
  const { positions, loading: positionsLoading } = usePositions();

  const [timeframe, setTimeframe] = React.useState<'1M' | '3M' | 'YTD' | '1Y' | 'INCEP'>('1Y');

  const formattedNetWorth = useMemo(() => {
    if (!clientData) return '$0.00';
    return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(clientData.totalNetWorth);
  }, [clientData]);

  const chartData = useMemo(() => {
    if (!history || history.length === 0) return [];
    
    const today = new Date();
    let startDate = new Date();
    
    switch (timeframe) {
      case '1M':
        startDate.setMonth(today.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(today.getMonth() - 3);
        break;
      case 'YTD':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      case '1Y':
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      case 'INCEP':
      default:
        return history;
    }
    
    return history.filter((point: any) => new Date(point.date) >= startDate);
  }, [history, timeframe]);

  if (clientLoading || historyLoading || positionsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Portfolio Overview</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Welcome back, <span className="text-foreground">{currentUser?.email?.split('@')[0] || 'Client'}</span>. Here is your secure summary.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-500/20 w-fit">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-semibold uppercase tracking-wider">Canada Secure Servers</span>
        </div>
      </div>

      {/* High-level metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-premium relative overflow-hidden group hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <DollarSign className="w-24 h-24 text-blue-600" />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Total Net Worth</h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-4xl font-semibold tracking-tight text-foreground relative z-10">{formattedNetWorth}</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-green-600 font-medium relative z-10">
            <TrendingUp className="w-4 h-4" />
            <span>+8.4% YTD</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-premium relative overflow-hidden group hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Time-Weighted Return (TWR)</h3>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-4xl font-semibold tracking-tight text-foreground relative z-10">6.2%</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground font-medium relative z-10">
            <span>Annualized Since Inception</span>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-premium relative overflow-hidden group hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">Internal Rate of Return (IRR)</h3>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/40 rounded-xl text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-4xl font-semibold tracking-tight text-foreground relative z-10">5.9%</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground font-medium relative z-10">
            <span>Money-Weighted Return</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-premium lg:col-span-2 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-foreground text-lg">Portfolio Growth vs. Benchmark</h3>
            <div className="flex gap-2 bg-secondary p-1 rounded-xl">
              {(['1M', '3M', 'YTD', '1Y', 'INCEP'] as const).map((period) => (
                <button 
                  key={period} 
                  onClick={() => setTimeframe(period)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${timeframe === period ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full" style={{ minHeight: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
                  dy={10}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return d.toLocaleDateString('en-CA', { month: 'short', year: timeframe === 'INCEP' || timeframe === '1Y' ? '2-digit' : undefined });
                  }}
                  minTickGap={30}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
                  domain={['dataMin - (dataMin * 0.05)', 'dataMax + (dataMax * 0.05)']}
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(2)}M`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontWeight: 600 }}
                  labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '8px' }}
                  formatter={(value: any, name: any) => [
                    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(value as number), 
                    name === 'netWorth' ? 'Your Portfolio' : 'S&P/TSX 60 Benchmark'
                  ]}
                  labelFormatter={(label) => new Date(label as string).toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}
                />
                <Area 
                  type="monotone" 
                  dataKey="benchmarkValue" 
                  name="benchmarkValue"
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  fillOpacity={1} 
                  fill="url(#colorBenchmark)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="netWorth" 
                  name="netWorth"
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorNetWorth)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accounts List */}
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-premium flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground text-lg">Accounts Summary</h3>
            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4 flex-1">
            {clientData?.accounts.map((acc: any) => (
              <div key={acc.id} className="p-4 rounded-xl border border-border bg-slate-50/50 dark:bg-slate-900/50 hover:bg-secondary cursor-pointer transition-colors group">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{acc.name}</h4>
                    <span className="text-xs text-muted-foreground mt-1 inline-block border border-border px-2 py-0.5 rounded shadow-sm bg-card">{acc.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm text-foreground">
                      {new Intl.NumberFormat('en-CA', { style: 'currency', currency: acc.currency }).format(acc.balance)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Top Positions Section */}
      <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-premium">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-foreground text-lg">Top Holdings</h3>
          <button className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center hover:underline">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 pt-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Symbol / Name</th>
                <th className="pb-3 pt-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Shares</th>
                <th className="pb-3 pt-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Price</th>
                <th className="pb-3 pt-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Market Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {positions.slice(0, 4).map((pos: any, idx: number) => (
                <tr key={idx} className="hover:bg-secondary/50 transition-colors cursor-pointer group">
                  <td className="py-4 px-4">
                    <div className="font-semibold text-sm text-foreground">{pos.symbol}</div>
                    <div className="text-xs text-muted-foreground">{pos.name}</div>
                  </td>
                  <td className="py-4 px-4 text-right text-sm font-medium">{pos.shares.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right text-sm text-muted-foreground">${pos.price.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right text-sm font-semibold">${pos.marketValue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
