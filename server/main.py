# =========================================== imports =============================================

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
import uvicorn
import asyncpg

# ======================================== database setup =========================================

# Database connection details
DATABASE_URL = "postgresql://p_user:p_password@localhost:5432/sparkbytes_db"

# Establishing a connection to the database
async def connect(): return await asyncpg.connect(DATABASE_URL)

# Context manager to handle the database connection
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.db = await connect()
    try: yield
    finally: await app.state.db.close()

# =========================================== app setup ===========================================

# Creating a FastAPI instance
app = FastAPI(lifespan=lifespan)

# Setting up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================ routing  ===========================================

# root route, testing that the connection to the database works
@app.get("/")
async def root():
    try:
        await app.state.db.execute("SELECT 1")
        return {"message": "Hello World! Database connection is successful."}
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail="Bye World! Database connection failed.")
    
# get request to get the count of products in the database
# your code here
@app.get("/{table_name}/count")
async def count_all(table_name : str, q : str = ""):
    q = q.replace("'", "\\'")
    try:
        db_response = await app.state.db.fetch(f"SELECT COUNT(*) FROM {table_name} WHERE UPPER(name) LIKE '%{q.upper()}%'")
        return db_response[0]["count"]
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail=[{"msg": "Database error."}])

# get request to get all products in the database
# your code here
@app.get("/products")
async def get_product_by_id(q : str = "", page : int = 1, limit : int = 10):
    q = q.replace("'", "\\'")
    try:
        #db_response = await app.state.db.fetch(f"SELECT * FROM products WHERE UPPER(name) LIKE '%{q.upper()}%' LIMIT {limit} OFFSET {(page - 1) * limit}")
        db_response = await app.state.db.fetch(f"SELECT owner_id, name FROM events INNER JOIN users ON users.id=events.owner_id LIMIT 10")
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail=[{"msg": "Internal server error."}])
    return db_response

# get request to get a product by its id
# your code here
@app.get("/products/{id}")
async def get_product_by_id(id : int):
    try:
        db_response = await app.state.db.fetch(f"SELECT * FROM products WHERE id = {id}")
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail=[{"msg": "Internal server error."}])
    if not db_response:
        raise HTTPException(status_code=422, detail=[{"msg": "ID not present in database."}])
    return db_response

class Product(BaseModel):
    title: str
    description: str

@app.post("/products/create")
async def create_new_product(product : Product):
    product.title = product.title.replace("'", "\\'")
    product.description = product.description.replace("'", "\\'")
    try:
        db_response = await app.state.db.fetch(f"INSERT INTO products (name, description) VALUES ('{product.title}', ('hello it' || CHAR(39) || 's me'))")
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail=[{"msg": "Internal server error."}])
    return db_response

# ======================================== run the app =========================================
    
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5002, reload=True)

# ==============================================================================================