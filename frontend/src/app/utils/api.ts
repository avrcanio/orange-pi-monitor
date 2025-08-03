import { Status, HistoryPoint } from './types';
import { parseStatus } from './helper';

const BASE_URL = 'http://192.168.31.68:8001';

export async function fetchLatestStatus(): Promise<{
  parsedStatus: Status;
  newPoint: HistoryPoint;
} | null> {
  try {
    const res = await fetch(`${BASE_URL}/status/latest`);
    if (!res.ok) throw new Error(`Greška pri fetchu: ${res.status}`);
    const data: Status = await res.json();
    return parseStatus(data);
  } catch (err) {
    console.error('Greška prilikom dohvata statusa:', err);
    return null;
  }
}
