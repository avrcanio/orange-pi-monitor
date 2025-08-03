// frontend/src/app/utils/types.ts

/**
 * Trenutno stanje sustava – dohvaćeno s API-ja
 */
export type Status = {
  cpuData: { name: string; Opterećenje: number }[]; // izračunato polje na frontend strani
  cpu_count: number;           // broj fizičkih CPU jezgri
  cpu_percent: string;         // niz postotaka opterećenja po jezgrama
  load_average: string;         // "(1.31,1.42,1.39)" → 1m, 5m, 15m
  load_1: number;
  load_5: number;
  load_15: number;
  cpu_temp: number;            // °C
  nvme_temp: number;             // °C
  nvme_read: number;      // npr. 502319 (Data Units Read)
  nvme_written: number;   // npr. 895327 (Data Units Written)
  ram_total_gb: number;
  ram_used_gb: number;
  ram_free_gb: number;
  swap_total_gb: number;
  swap_used_gb: number;
  swap_free_gb: number;
  disk_total_gb: number;
  disk_used_gb: number;
  disk_free_gb: number;
  network_json: string;        // JSON string s eth0, lo, itd.
};

/**
 * Povijesna točka za crtanje vremenskih grafova
 */
export type HistoryPoint = {
  time: string;            // lokalno vrijeme točke
  cpu_temp: number;
  nvme_temp: number;
  load_1: number;          // load avg 1 min
  load_5: number;          // load avg 5 min
  load_15: number;         // load avg 15 min
  ram_used: number;
  ram_free: number;
  swap_used: number;
  swap_free: number;
  disk_used: number;
  disk_free: number;
  eth_sent: number;
  eth_recv: number;
};

/**
 * Povijesna točka temperature CPU-a i NVMe diska
 * iz endpointa /status/temp_history
 */
export type TempPoint = {
  timestamp: string;     // ISO datetime string
  cpu_temp: number;      // °C
  nvme_temp: number;     // °C
};