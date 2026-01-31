from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"mesaj": "İsviçre Çakısı Projesi Başladı!", "durum": "Aktif"}

@app.get("/test")
def test_endpoint():
    return {"veri": "Burası test endpointi"}