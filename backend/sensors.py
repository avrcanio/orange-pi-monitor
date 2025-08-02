import psutil
import subprocess
import socket
import time
from datetime import timedelta

def read_cpu_temp():
    try:
        with open("/sys/class/thermal/thermal_zone0/temp", "r") as f:
            temp_str = f.read()
            return int(temp_str) / 1000.0  # °C
    except:
        return None

def read_nvme_status():
    try:
        result = subprocess.run(["nvme", "smart-log", "/dev/nvme0"], capture_output=True, text=True)
        lines = result.stdout.splitlines()
        data = {}
        for line in lines:
            if "temperature" in line and "Sensor" not in line:
                parts = line.split(":")
                if len(parts) >= 2 and "°C" in parts[1]:
                    data["nvme_temp"] = int(parts[1].split("°")[0].strip())
            if "Data Units Read" in line:
                data["data_units_read"] = int(line.split(":")[1].split("(")[0].strip())
            if "Data Units Written" in line:
                data["data_units_written"] = int(line.split(":")[1].split("(")[0].strip())
        return data
    except Exception as e:
        return {}

def get_system_status():
    status = {}

    # Osnovno
    status["hostname"] = socket.gethostname()
    status["uptime"] = timedelta(seconds=int(time.time() - psutil.boot_time()))

    # CPU
    status["cpu_percent"] = psutil.cpu_percent(percpu=True)
    status["cpu_temp"] = read_cpu_temp()
    status["load_average"] = psutil.getloadavg()
    status["cpu_count"] = psutil.cpu_count(logical=False)
    status["cpu_count_logical"] = psutil.cpu_count()

    # RAM
    vm = psutil.virtual_memory()
    status["ram_total_gb"] = round(vm.total / (1024**3), 2)
    status["ram_used_gb"] = round(vm.used / (1024**3), 2)
    status["ram_free_gb"] = round(vm.available / (1024**3), 2)

    # Swap
    sw = psutil.swap_memory()
    status["swap_total_gb"] = round(sw.total / (1024**3), 2)
    status["swap_used_gb"] = round(sw.used / (1024**3), 2)
    status["swap_free_gb"] = round((sw.total - sw.used) / (1024**3), 2)

    # NVMe
    nvme_data = read_nvme_status()
    status.update(nvme_data)

    # Mrežni promet
    net_io = psutil.net_io_counters(pernic=True)
    network_data = {}
    for iface, stats in net_io.items():
        network_data[iface] = {
            "bytes_sent": stats.bytes_sent,
            "bytes_recv": stats.bytes_recv
        }
    status["network"] = network_data

    # Procesi / dretve / korisnici
    status["num_processes"] = len(psutil.pids())
    status["num_threads"] = sum(p.num_threads() for p in psutil.process_iter())
    status["num_users"] = len(psutil.users())

    # Disk prostor
    disk = psutil.disk_usage("/")
    status["disk_total_gb"] = round(disk.total / (1024 ** 3), 2)
    status["disk_used_gb"] = round(disk.used / (1024 ** 3), 2)
    status["disk_free_gb"] = round(disk.free / (1024 ** 3), 2)

    # NVMe pročitanih i zapisanih jedinica
    try:
        import subprocess
        result = subprocess.run(["nvme", "smart-log", "/dev/nvme0"], capture_output=True, text=True)
        output = result.stdout

        for line in output.splitlines():
            if "Data Units Read" in line:
                status["nvme_read"] = int(line.split(":")[1].split("(")[0].strip())
            elif "Data Units Written" in line:
                status["nvme_written"] = int(line.split(":")[1].split("(")[0].strip())
    except:
        status["nvme_read"] = None
        status["nvme_written"] = None
        




    return status
