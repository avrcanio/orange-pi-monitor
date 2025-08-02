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
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

function GaugeChart({
  label,
  value,
  max = 100,
}: {
  label: string;
  value: number;
  max?: number;
}) {
  const percentage = Math.min(value / max, 1);

  const data = [
    { name: 'Used', value: percentage },
    { name: 'Remaining', value: 1 - percentage },
  ];

  const COLORS = ['#ff7300', '#f0f0f0'];

  return (
    <div style={{ width: 200, height: 200, textAlign: 'center' }}>
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
      <div style={{ marginTop: '-60px', fontSize: '1.2rem' }}>
        {label}: {Math.round(value)} °C
      </div>
    </div>
  );
}

type Status = {
  cpuData: { name: string; Opterećenje: number }[];
  cpu_percent: string;
  load_average: string;
  cpu_temp: number;
  nvme_temp: number;
  ram_used_gb: number;
  ram_free_gb: number;
  swap_used_gb: number;
  swap_free_gb: number;
  disk_used_gb: number;
  disk_free_gb: number;
  network_json: string;
};

type HistoryPoint = {
  time: string;
  cpu_temp: number;
  nvme_temp: number;
  load_1: number;
  load_5: number;
  load_15: number;
  ram_used: number;
  ram_free: number;
  swap_used: number;
  swap_free: number;
  disk_used: number;
  disk_free: number;
  eth_sent: number;
  eth_recv: number;
};

export default function Home() {
  const [status, setStatus] = useState<Status | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);

  useEffect(() => {
    const fetchData = () => {
      fetch('http://192.168.31.68:8001/status/latest')
        .then((res) => res.json())
        .then((data: Status) => {
          const cpu_percent_parsed = data.cpu_percent
            .replace(/[{}]/g, '')
            .split(',')
            .map((v) => parseFloat(v));

          const parsedLoad = data.load_average
            .replace(/[()]/g, '')
            .split(',')
            .map((v) => parseFloat(v));

          const cpuData = cpu_percent_parsed.map((value, index) => ({
            name: `Jezgra ${index + 1}`,
            Opterećenje: value,
          }));

          const net = JSON.parse(data.network_json);

          const newPoint: HistoryPoint = {
            time: new Date().toLocaleTimeString(),
            cpu_temp: data.cpu_temp,
            nvme_temp: data.nvme_temp,
            load_1: parsedLoad[0],
            load_5: parsedLoad[1],
            load_15: parsedLoad[2],
            ram_used: data.ram_used_gb,
            ram_free: data.ram_free_gb,
            swap_used: data.swap_used_gb,
            swap_free: data.swap_free_gb,
            disk_used: data.disk_used_gb,
            disk_free: data.disk_free_gb,
            eth_sent: net.eth0.bytes_sent,
            eth_recv: net.eth0.bytes_recv,
          };

          setStatus({ ...data, cpuData });
          setHistory((prev) => [...prev.slice(-29), newPoint]);
        })
        .catch((err) => console.error('Greška prilikom dohvata:', err));
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return <div>Učitavanje...</div>;

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📊 Status Orange Pi sustava</h1>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={status.cpuData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis unit="%" />
          <Tooltip />
          <Bar dataKey="Opterećenje" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h2>🌡️ Temperature (Gauge)</h2>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <GaugeChart value={status.cpu_temp} label="CPU temperatura" />
        <GaugeChart value={status.nvme_temp} label="NVMe temperatura" />
      </div>

      <h2>🌡️ Temperature, RAM, Load avg</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={history}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cpu_temp" stroke="#ff7300" name="CPU temp" />
          <Line type="monotone" dataKey="nvme_temp" stroke="#0070f3" name="NVMe temp" />
          <Line type="monotone" dataKey="load_1" stroke="#00c49f" name="Load 1m" />
          <Line type="monotone" dataKey="load_5" stroke="#82ca9d" name="Load 5m" />
          <Line type="monotone" dataKey="load_15" stroke="#8884d8" name="Load 15m" />
        </LineChart>
      </ResponsiveContainer>

      <h2>💾 RAM i SWAP</h2>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={history}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="ram_used" stackId="1" stroke="#ff7300" fill="#ff7300" name="RAM used" />
          <Area type="monotone" dataKey="ram_free" stackId="1" stroke="#00c49f" fill="#00c49f" name="RAM free" />
          <Area type="monotone" dataKey="swap_used" stackId="2" stroke="#8884d8" fill="#8884d8" name="SWAP used" />
          <Area type="monotone" dataKey="swap_free" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="SWAP free" />
        </AreaChart>
      </ResponsiveContainer>

      <h2>🗄️ Disk</h2>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={history}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="disk_used" stackId="1" stroke="#8884d8" fill="#8884d8" name="Disk used" />
          <Area type="monotone" dataKey="disk_free" stackId="1" stroke="#00c49f" fill="#00c49f" name="Disk free" />
        </AreaChart>
      </ResponsiveContainer>

      <h2>🌐 Mreža (eth0)</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={history}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="eth_sent" stroke="#ff7300" name="Bytes sent" />
          <Line type="monotone" dataKey="eth_recv" stroke="#0070f3" name="Bytes recv" />
        </LineChart>
      </ResponsiveContainer>
    </main>
  );
}
