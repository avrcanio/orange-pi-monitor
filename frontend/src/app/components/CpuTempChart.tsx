'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import { TempPoint } from '@/app/utils/types';
import { fetchTempHistory } from '@/app/utils/fetchStatus';

export default function CpuTempChart() {
  const [data, setData] = useState<TempPoint[]>([]);

  useEffect(() => {
    const load = async () => {
      const result = await fetchTempHistory();
      if (result) {
        const last = result.slice(-60); // zadnjih 60 točaka
        const formatted = last.map((d) => ({
          ...d,
          timestamp: new Date(d.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        }));
        setData(formatted);
      }
    };
    load();
  }, []);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
          <YAxis unit="°C" domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="cpu_temp"
            stroke="#ff7300"
            dot={false}
            name="CPU Temp"
          />
          <Line
            type="monotone"
            dataKey="nvme_temp"
            stroke="#007bff"
            dot={false}
            name="NVMe Temp"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
