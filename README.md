# 🧠 orange-pi-monitor

Dockerizirani Python backend za prikupljanje hardverskih podataka s Orange Pi Ultra uređaja i spremanje u PostgreSQL bazu.

## 🎯 Podaci koji se prikupljaju:
- CPU iskorištenost po jezgrama
- Load average (1m, 5m, 15m)
- Temperatura CPU-a (više zona)
- Temperatura M.2 NVMe SSD-a
- Broj fizičkih/logičkih jezgri

## 📦 Tehnologije
- Python 3.12
- psutil
- nvme-cli
- PostgreSQL
- Docker

## 🚀 Pokretanje (lokalno)

```bash
docker build -t orange-pi-monitor .
docker run --env-file .env orange-pi-monitor
