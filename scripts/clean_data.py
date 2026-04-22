import pandas as pd

df = pd.read_csv("data/raw_prices.csv")

df['item'] = df['item'].str.lower()
df['city'] = df['city'].str.lower()

df['dates'] = pd.to_datetime(df['date'])
df['collected_at'] = pd.to_datetime(df['collected_at'])

df = df.sort_values("collected_at")
df = df.drop_duplicates(subset=["date", "item", "city"], keep = "last")

df.to_csv("data/cleaned_prices.csv", index=False)

print("cleaned data ready")