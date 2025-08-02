from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ✅ dodano
from database import get_connection
from psycopg2.extras import RealDictCursor

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
