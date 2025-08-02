FROM python:3.12-slim

# Postavi radni direktorij unutar kontejnera
WORKDIR /app

# Kopiraj requirements.txt i instaliraj ovisnosti
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopiraj sve datoteke iz trenutnog direktorija (api/) u kontejner
COPY . .

# Pokreni aplikaciju koristeći uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
