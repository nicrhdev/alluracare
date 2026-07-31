// src/app/[locale]/admin/components/DashboardStats.tsx

'use client';

interface Stat {
  label: string;
  value: number;
  icon: string;
}

interface DashboardStatsProps {
  stats: Stat[];
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-soft border border-brand-secondary/20 p-5 flex items-center gap-4 hover:shadow-medium transition-all duration-200"
        >
          <div className="text-3xl">{stat.icon}</div>
          <div>
            <p className="text-sm text-brand-text-secondary">{stat.label}</p>
            <p className="text-2xl font-bold text-brand-text">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}