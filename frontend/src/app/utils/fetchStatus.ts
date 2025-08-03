import { Status, HistoryPoint ,TempPoint } from './types';
import { parseStatus } from './helper';

const API_URL = 'http://192.168.31.68:8001/status/latest';
const HISTORY_URL = 'http://192.168.31.68:8001/status/temp_history';

export async function fetchLatestStatus(): Promise<{
  parsedStatus: Status;
  newPoint: HistoryPoint;
} | null> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Greška pri fetchu: ${res.status}`);
    const data: Status = await res.json();
    return parseStatus(data);
  } catch (err) {
    console.error('Greška prilikom dohvata statusa:', err);
    return null;
  }
}

export async function fetchTempHistory(): Promise<TempPoint[] | null> {
  try {
    const res = await fetch('http://192.168.31.68:8001/status/temp_history');
    if (!res.ok) throw new Error(`Greška pri fetchu: ${res.status}`);
    const data: TempPoint[] = await res.json();
    return data;
  } catch (err) {
    console.error('Greška prilikom dohvata temperature povijesti:', err);
    return null;
  }
}

