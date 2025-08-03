'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import { Status, HistoryPoint } from '@/app/utils/types';
import { fetchLatestStatus } from '@/app/utils/fetchStatus';
import { formatUsage, calculateLoadPercentage , calculateNvmeTbwPercentage } from '@/app/utils/helper';
import GaugeChart from '@/app/components/GaugeChart';
import CpuTempChart from '@/app/components/CpuTempChart'; // ✅ novo

export default function Home() {
  const [status, setStatus] = useState<Status | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const maxWrittenMB = 600_000_000;

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchLatestStatus();
      if (!result) return;
      const { parsedStatus, newPoint } = result;
      setStatus(parsedStatus);
      setHistory((prev) => [...prev.slice(-29), newPoint]);
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return <div>Učitavanje...</div>;

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📊 Orange Pi core usage</h1>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={status.cpuData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis unit="%" />
          <Tooltip />
          <Bar dataKey="Opterećenje" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h2>📈 Load Average</h2>
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '2rem' }}>
        <GaugeChart value={status.load_1} max={10} label="Load avg (1m)" unit="" />
        <GaugeChart value={status.load_5} max={10} label="Load avg (5m)" unit="" />
        <GaugeChart value={status.load_15} max={10} label="Load avg (15m)" unit="" />
      </div>

      <h2>🌡️ Temperature</h2>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <GaugeChart value={status.cpu_temp} label="CPU temp" unit="°C" />
      
      </div>

      <h2>💾 RAM, SWAP</h2>
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 200 }}>
          <GaugeChart value={status.ram_used_gb} max={status.ram_total_gb} label="RAM used" unit="GB" />
          <div style={{ marginTop: '-0.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {formatUsage(status.ram_used_gb, status.ram_total_gb)}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 200 }}>
          <GaugeChart value={status.swap_used_gb} max={status.swap_total_gb} label="SWAP used" unit="GB" />
          <div style={{ marginTop: '-0.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {formatUsage(status.swap_used_gb, status.swap_total_gb)}
          </div>
        </div>
      </div>

      <h2>🌡️ NVMe + Disk</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 200 }}>
          <GaugeChart value={status.nvme_temp} label="NVMe temp" unit="°C" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 200 }}>
          <GaugeChart
            value={status.disk_used_gb}
            max={status.disk_total_gb}
            label="Disk used"
            unit="GB"
          />
          <div style={{ marginTop: '-0.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {formatUsage(status.disk_used_gb, status.disk_total_gb)}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '4rem', marginBottom: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>NVMe Read</div>
              <div style={{ fontSize: '1.1rem' }}>
                {Math.round(status.nvme_read * 0.512)} GB
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>NVMe Written</div>
              <div style={{ fontSize: '1.1rem' }}>
                {Math.round(status.nvme_written * 0.512)} GB
              </div>
            </div>
          </div>

          <GaugeChart
            value={calculateNvmeTbwPercentage(status.nvme_written, maxWrittenMB)}
            max={100}
            label="NVMe Written usage"
            unit="%"
            title={`Zapisano: ${Math.round(status.nvme_written * 0.512)} GB / ${Math.round(maxWrittenMB / 1024)} GB ukupno`}
          />
        </div>
          <div style={{ flex: 1, minWidth: '300px' }}>
          <CpuTempChart /> {/* ✅ dodano */}
        </div>
      </div>
    </main>
  );
}
