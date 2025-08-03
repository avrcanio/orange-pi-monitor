from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ili ["http://localhost:3000"] za sigurnije
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/status/latest")
def get_latest_status():
    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT * FROM system_status
            ORDER BY timestamp DESC
            LIMIT 1;
        """)
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        return {"error": str(e)}

# ✅ Dodani model i novi endpoint
class CpuTempPoint(BaseModel):
    timestamp: datetime
    cpu_temp: Optional[float]
    nvme_temp: Optional[float]

@app.get("/status/temp_history", response_model=List[CpuTempPoint])
def get_cpu_temp_history():
    try:
        with get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cursor:
                cursor.execute("""
                    SELECT timestamp, cpu_temp, nvme_temp
                    FROM system_status
                    ORDER BY timestamp ASC;
                """)
                return cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
