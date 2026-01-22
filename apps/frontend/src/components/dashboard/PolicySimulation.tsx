import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { name: 'FOH', value: 12295, percentage: 50, color: 'hsl(142 70% 45%)' },
  { name: 'BOH', value: 7377, percentage: 30, color: 'hsl(220 70% 55%)' },
  { name: 'Bar', value: 4918, percentage: 20, color: 'hsl(270 70% 55%)' },
];

const COLORS = ['hsl(142, 70%, 45%)', 'hsl(220, 70%, 55%)', 'hsl(270, 70%, 55%)'];

export function PolicySimulation() {
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Policy Simulation</CardTitle>
        <p className="text-sm text-muted-foreground">Projected distribution based on $24,590</p>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-3 mt-4">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-sm text-muted-foreground">{item.name} ({item.percentage}%)</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                ${item.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
