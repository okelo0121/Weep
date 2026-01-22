import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Anchor, RotateCcw } from 'lucide-react';

interface PolicySliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  color: string;
}

function PolicySlider({ label, value, onChange, color }: PolicySliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-bold text-foreground">{value}%</span>
      </div>
      <div className="relative">
        <Slider
          value={[value]}
          onValueChange={(v) => onChange(v[0])}
          max={100}
          step={5}
          className="w-full"
        />
        <div 
          className="absolute top-0 left-0 h-2 rounded-full transition-all"
          style={{ 
            width: `${value}%`,
            background: color
          }}
        />
      </div>
    </div>
  );
}

export function DistributionPolicy() {
  const [foh, setFoh] = useState(50);
  const [boh, setBoh] = useState(30);
  const [bar, setBar] = useState(20);

  const total = foh + boh + bar;
  const isValid = total === 100;

  const handleFohChange = (value: number) => {
    const remaining = 100 - value;
    const bohRatio = boh / (boh + bar) || 0.5;
    setFoh(value);
    setBoh(Math.round(remaining * bohRatio));
    setBar(remaining - Math.round(remaining * bohRatio));
  };

  const handleBohChange = (value: number) => {
    const remaining = 100 - foh;
    setBoh(Math.min(value, remaining));
    setBar(remaining - Math.min(value, remaining));
  };

  const handleBarChange = (value: number) => {
    const remaining = 100 - foh;
    setBar(Math.min(value, remaining));
    setBoh(remaining - Math.min(value, remaining));
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Distribution Policy Setup</CardTitle>
        <p className="text-sm text-muted-foreground">Adjust tip distribution ratios for staff pools</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <PolicySlider 
          label="Front of House (FOH)" 
          value={foh} 
          onChange={handleFohChange}
          color="hsl(142 70% 45%)"
        />
        <PolicySlider 
          label="Back of House (BOH)" 
          value={boh} 
          onChange={handleBohChange}
          color="hsl(220 70% 55%)"
        />
        <PolicySlider 
          label="Bar" 
          value={bar} 
          onChange={handleBarChange}
          color="hsl(270 70% 55%)"
        />

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Total Allocation</span>
          <span className={`text-lg font-bold ${isValid ? 'text-primary' : 'text-destructive'}`}>
            {total}%
          </span>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1 gradient-primary text-primary-foreground gap-2">
            <Anchor className="h-4 w-4" />
            Anchor & Activate Policy
          </Button>
          <Button variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Discard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
