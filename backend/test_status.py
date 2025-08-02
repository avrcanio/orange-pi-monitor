from sensors import get_system_status
import time

if __name__ == "__main__":
    while True:
        status = get_system_status()

        print("\n📊 HARDVERSKI STATUS")
        print(f"  🖥️ Hostname:               {status['hostname']}")
        print(f"  ⏱️ Uptime:                 {status['uptime']}")
        print(f"  🧠 CPU jezgre (%):         {status['cpu_percent']}")
        print(f"  🌡️ CPU temperatura:        {status['cpu_temp']} °C")
        print(f"  📉 Load average:           {status['load_average']}")
        print(f"  🧮 Fizičke jezgre:         {status['cpu_count']}")
        print(f"  🔢 Logičke jezgre:         {status['cpu_count_logical']}")
        print(f"  💾 RAM ukupno:             {status['ram_total_gb']} GB")
        print(f"  📊 RAM zauzeto:            {status['ram_used_gb']} GB")
        print(f"  🟢 RAM slobodno:           {status['ram_free_gb']} GB")
        print(f"  💾 Swap ukupno:            {status['swap_total_gb']} GB")
        print(f"  💾 Swap zauzeto:           {status['swap_used_gb']} GB")
        print(f"  💾 Swap slobodno:          {status['swap_free_gb']} GB")
        print(f"  📦 NVMe temperatura:       {status['nvme_temp']} °C")
        print(f"  📘 NVMe pročitao:          {status['nvme_read']} jedinica")
        print(f"  📕 NVMe zapisao:           {status['nvme_written']} jedinica")
        print(f"  🧮 Broj procesa:           {status['num_processes']}")
        print(f"  🔁 Broj dretvi:            {status['num_threads']}")
        print(f"  👤 Broj korisnika:         {status['num_users']}")
        print(f"  💽 Disk ukupno:            {status['disk_total_gb']} GB")
        print(f"  💽 Disk zauzeto:           {status['disk_used_gb']} GB")
        print(f"  💽 Disk slobodno:          {status['disk_free_gb']} GB")

        print("\n🌐 Mrežni promet po sučeljima:")
        for iface, net in status["network"].items():
            rx = round(net["bytes_recv"] / (1024**2), 2)
            tx = round(net["bytes_sent"] / (1024**2), 2)
            print(f"  🔌 {iface}: RX {rx} MB | TX {tx} MB")

        time.sleep(1)
