import time
from datetime import datetime, timezone
from sensors import get_system_status
from db import get_conn
import json

def save_to_db(data):
    try:
        conn = get_conn()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO system_status (
                timestamp,
                hostname,
                uptime,
                cpu_percent,
                cpu_temp,
                load_average,
                cpu_count,
                cpu_count_logical,
                ram_total_gb,
                ram_used_gb,
                ram_free_gb,
                swap_total_gb,
                swap_used_gb,
                swap_free_gb,
                nvme_temp,
                nvme_read,
                nvme_written,
                num_processes,
                num_threads,
                num_users,
                disk_total_gb,
                disk_used_gb,
                disk_free_gb,
                network_json
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
        """, (
            datetime.now(timezone.utc),
            data["hostname"],
            data["uptime"],
            data["cpu_percent"],
            data["cpu_temp"],
            data["load_average"],
            data["cpu_count"],
            data["cpu_count_logical"],
            data["ram_total_gb"],
            data["ram_used_gb"],
            data["ram_free_gb"],
            data["swap_total_gb"],
            data["swap_used_gb"],
            data["swap_free_gb"],
            data["nvme_temp"],
            data["nvme_read"],
            data["nvme_written"],
            data["num_processes"],
            data["num_threads"],
            data["num_users"],
            data["disk_total_gb"],
            data["disk_used_gb"],
            data["disk_free_gb"],
            json.dumps(data["network"])  # spremamo kao JSON string
        ))

        conn.commit()
        cur.close()
        conn.close()

        print(f"✅ {datetime.now().isoformat()} - Status spremljen: hostname={data['hostname']}, CPU={data['cpu_percent']}%")

    except Exception as e:
        print(f"❌ Greška pri spremanju: {e}")

if __name__ == "__main__":
    while True:
        try:
            status = get_system_status()
            save_to_db(status)
        except Exception as err:
            print(f"❌ Greška prilikom dohvaćanja statusa: {err}")
        time.sleep(1)
