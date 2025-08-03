// frontend/src/app/utils/helper.ts

import { Status, HistoryPoint } from './types';

/**
 * Parsira podatke iz `Status` objekta u format prilagođen frontend komponentama.
 */
export function parseStatus(data: Status): {
  parsedStatus: Status & {
    cpuData: { name: string; Opterećenje: number }[];
    load_1: number;
    load_5: number;
    load_15: number;
  };
  newPoint: HistoryPoint;
} {
  const cpu_percent_parsed = data.cpu_percent
    .replace(/[{}]/g, '')
    .split(',')
    .map((v) => parseFloat(v));

  const cpuData = cpu_percent_parsed.map((value, index) => ({
    name: `Core ${index + 1}`,
    Opterećenje: value,
  }));

  const parsedLoad =
    data.load_average?.replace(/[()]/g, '').split(',').map((v) => parseFloat(v)) || [0, 0, 0];

  let net: { eth0?: { bytes_sent?: number; bytes_recv?: number } } = {};
  try {
    net = JSON.parse(data.network_json);
  } catch (e) {
    console.warn('Greška pri parsiranju network_json:', e);
    net = { eth0: { bytes_sent: 0, bytes_recv: 0 } };
  }

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
    eth_sent: net.eth0?.bytes_sent || 0,
    eth_recv: net.eth0?.bytes_recv || 0,
  };

  return {
    parsedStatus: {
      ...data,
      cpuData,
      load_1: parsedLoad[0],
      load_5: parsedLoad[1],
      load_15: parsedLoad[2],
    },
    newPoint,
  };
}

export function formatUsage(used: number, total: number): string {
  return `${used.toFixed(1)} / ${total.toFixed(1)} GB`;
}

export function calculateLoadPercentage(load: number, maxLoad = 10): number {
  return Math.min((load / maxLoad) * 100, 100);
}

export function calculateNvmeTbwPercentage(nvmeWrittenDU: number, maxWrittenMB: number): number {
  const writtenMB = nvmeWrittenDU * 0.5;
  const percentage = (writtenMB / maxWrittenMB) * 100;
  return Math.min(100, parseFloat(percentage.toFixed(2)));
}


