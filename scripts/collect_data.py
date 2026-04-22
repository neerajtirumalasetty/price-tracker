import pandas as pd
from datetime import datetime, timedelta
import random
import os



BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILE_PATH = os.path.join(BASE_DIR, "data", "raw_prices.csv")

items = ["tomato", "onion", "potato"]
cities = ["vijayawada", "hyderabad", "bangalore"]

data = []

for city in cities:
    for item in items:
        price = random.randint(20, 60)
        data.append({
            "date": (datetime.today() - timedelta(days=random.randint(0, 5))).date(),
            "item": item,
            "city": city,
            "price": price,
            "source": "simulated",
            "collected_at": datetime.now()
        })

df = pd.DataFrame(data)

# Save logic
if not os.path.exists(FILE_PATH):
    df.to_csv(FILE_PATH, index=False)
else:
    df.to_csv(FILE_PATH, mode='a', index=False, header=False)

print("Data collected and stored ✅")