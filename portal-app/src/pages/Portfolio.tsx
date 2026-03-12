import React from 'react';
import { useClientData, useAssetAllocation } from '../hooks/useData';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';
import { ShieldCheck, BarChart3 } from 'lucide-react';

export const Portfolio: React.FC = () => {
  const { data: clientData, loading: clientLoading } = useClientData();
  const { allocation, loading: allocationLoading } = useAssetAllocation();

  if (clientLoading || allocationLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const calculateTotal = (data: any[]) => data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Portfolio Analysis</h1>
          <p className="text-muted-foreground mt-2 font-medium">Deep dive into your asset allocation and risk profile.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 w-fit">
          <BarChart3 className="w-4 h-4" />
          <span className="font-semibold uppercase tracking-wider">Target: Balanced Growth</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Allocation Donut Chart */}
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-premium flex flex-col h-[450px]">
          <h3 className="font-semibold text-foreground text-lg mb-6">Asset Allocation</h3>
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={allocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {allocation.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ReTooltip 
                  formatter={(value: any) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(value as number)}
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: 'var(--foreground)', fontWeight: 600 }}
                />
              </RePieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm text-muted-foreground font-medium">Total Assets</span>
              <span className="text-2xl font-bold text-foreground">
                {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(clientData.totalNetWorth)}
              </span>
            </div>
          </div>
        </div>

        {/* Allocation Breakdown Table */}
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-premium flex flex-col">
          <h3 className="font-semibold text-foreground text-lg mb-6">Allocation Breakdown</h3>
          <div className="space-y-4 flex-1">
            {allocation.map((item: any) => {
              const total = calculateTotal(allocation);
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={item.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-foreground text-sm">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm text-foreground">
                      {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(item.value)}
                    </div>
                    <div className="text-xs text-muted-foreground">{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Risk & Policy Overview */}
      <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-premium mt-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary rounded-xl text-blue-600 mt-1">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">Investment Policy Statement</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-3xl">
              Your portfolio is currently aligned with your target "Balanced Growth" objective. The maximum allowable drift for any major asset class is ±5.0%. Your current allocation is within tolerance parameters. Data reflects end-of-day balances and corporate actions up to the prior trading day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
