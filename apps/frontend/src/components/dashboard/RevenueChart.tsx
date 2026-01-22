import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Mon', revenue: 3200 },
  { name: 'Tue', revenue: 4100 },
  { name: 'Wed', revenue: 3800 },
  { name: 'Thu', revenue: 5200 },
  { name: 'Fri', revenue: 4800 },
  { name: 'Sat', revenue: 6500 },
  { name: 'Sun', revenue: 5900 },
];

export function RevenueChart() {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(270 70% 55%)" stopOpacity={0.4} />
              <stop offset="50%" stopColor="hsl(220 70% 55%)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(220 70% 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(270 70% 55%)" />
              <stop offset="100%" stopColor="hsl(330 70% 55%)" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 50% 15%)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="hsl(215 20% 55%)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="hsl(215 20% 55%)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(220 50% 6%)',
              border: '1px solid hsl(220 50% 15%)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
            labelStyle={{ color: 'hsl(210 40% 98%)' }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="url(#strokeGradient)"
            strokeWidth={2}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
