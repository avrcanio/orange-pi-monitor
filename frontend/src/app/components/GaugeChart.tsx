'use client';

import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export type GaugeChartProps = {
  label: string;
  value: number;
  max?: number;
  unit?: string; // npr. "°C", "GB", "%"
  title?: string; // Tooltip prikaz stvarnih vrijednosti
};

export default function GaugeChart({
  label,
  value,
  max = 100,
  unit = '',
  title = '',
}: GaugeChartProps) {
  const percentage = Math.min(value / max, 1);

  const data = [
    { name: 'Used', value: percentage },
    { name: 'Remaining', value: 1 - percentage },
  ];

  const COLORS = ['#ff7300', '#f0f0f0'];

  return (
    <div
      style={{ width: 200, height: 200, textAlign: 'center' }}
      title={title} // Tooltip prikaz na hover
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div style={{ marginTop: '-60px', fontSize: '1.1rem', fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ fontSize: '1rem' }}>
        {value.toFixed(2)} {unit}
      </div>
    </div>
  );
}
