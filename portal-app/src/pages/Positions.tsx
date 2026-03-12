import React, { useMemo, useState } from 'react';
import { usePositions } from '../hooks/useData';
import { Briefcase, ArrowUpDown, Download, Filter } from 'lucide-react';

export const Positions: React.FC = () => {
  const { positions, loading } = usePositions();
  const [sortField, setSortField] = useState<string>('marketValue');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sortedPositions = useMemo(() => {
    return [...positions].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDir === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [positions, sortField, sortDir]);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalMarketValue = positions.reduce((sum, p) => sum + p.marketValue, 0);
  const totalCostBasis = positions.reduce((sum, p) => sum + (p.costBasis * p.shares), 0);
  const totalUnrealizedGain = totalMarketValue - totalCostBasis;
  const unrealizedGainPct = (totalUnrealizedGain / totalCostBasis) * 100;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Positions & Tax Lots</h1>
          <p className="text-muted-foreground mt-2 font-medium">Detailed view of your current holdings and cost basis.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground text-sm font-medium rounded-xl hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-premium">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Market Value</p>
          <p className="text-2xl font-semibold">{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(totalMarketValue)}</p>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-premium">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Cost Basis</p>
          <p className="text-2xl font-semibold">{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(totalCostBasis)}</p>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-premium md:col-span-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Est. Unrealized Gain/Loss</p>
          <div className="flex items-baseline gap-3">
            <p className={`text-2xl font-semibold ${totalUnrealizedGain >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
              {totalUnrealizedGain >= 0 ? '+' : ''}{new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(totalUnrealizedGain)}
            </p>
            <span className={`text-sm font-medium px-2 py-0.5 rounded-md ${totalUnrealizedGain >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
              {totalUnrealizedGain >= 0 ? '+' : ''}{unrealizedGainPct.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-premium overflow-hidden">
        <div className="p-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-3">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-foreground">All Accounts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-card border-b border-border">
                <th className="group py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => toggleSort('symbol')}>
                  <div className="flex items-center gap-2">Symbol / Name <ArrowUpDown className="w-3 h-3 opacity-50 group-hover:opacity-100" /></div>
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Asset Class</th>
                <th className="group py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => toggleSort('shares')}>
                  <div className="flex items-center justify-end gap-2"><ArrowUpDown className="w-3 h-3 opacity-50 group-hover:opacity-100" /> Quantity</div>
                </th>
                <th className="group py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => toggleSort('price')}>
                  <div className="flex items-center justify-end gap-2"><ArrowUpDown className="w-3 h-3 opacity-50 group-hover:opacity-100" /> Price</div>
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Cost Basis</th>
                <th className="group py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => toggleSort('marketValue')}>
                  <div className="flex items-center justify-end gap-2"><ArrowUpDown className="w-3 h-3 opacity-50 group-hover:opacity-100" /> Market Value</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedPositions.map((pos: any, idx: number) => {
                const isGain = pos.price > pos.costBasis;
                return (
                  <tr key={idx} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-sm text-foreground">{pos.symbol}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{pos.name}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded-md">{pos.type}</span>
                    </td>
                    <td className="py-4 px-6 text-right text-sm font-medium text-foreground">{pos.shares.toLocaleString()}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="text-sm font-medium text-foreground">${pos.price.toFixed(2)}</div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="text-sm text-muted-foreground">${pos.costBasis.toFixed(2)}</div>
                      <div className={`text-xs mt-0.5 ${isGain ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                        {isGain ? '▲' : '▼'} {Math.abs(((pos.price - pos.costBasis) / pos.costBasis) * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right text-sm font-semibold text-foreground">
                      ${pos.marketValue.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
