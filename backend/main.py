from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from theft import router as theft_router

app = FastAPI()

 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include theft routes
app.include_router(theft_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Backend running!"}
