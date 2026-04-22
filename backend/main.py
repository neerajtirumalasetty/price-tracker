from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI(title="MarketPulse API")

# CORS (important for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Absolute path setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "cleaned_prices.csv")


def load_data():
    df = pd.read_csv(DATA_PATH)
    df['date'] = pd.to_datetime(df['date'])
    return df


@app.get("/")
def home():
    return {"message": "MarketPulse API running"}


# 🔥 Multi-city trend
@app.get("/trend")
def get_trend(item: str):
    df = load_data()
    df = df[df['item'] == item.lower()]
    df = df.sort_values("date")
    return df.to_dict(orient="records")


@app.get("/summary")
def get_summary():
    df = load_data()
    summary = df.groupby('item')['price'].mean().reset_index()
    summary.rename(columns={"price": "avg_price"}, inplace=True)
    return summary.to_dict(orient="records")