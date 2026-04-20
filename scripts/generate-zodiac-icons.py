import os
import time
import requests
import json

API_KEY = "FPSX79372c5e8772ed2878c0ae9bfaa04c4b"
BASE_URL = "https://api.freepik.com/v1/ai/text-to-icon"
OUTPUT_DIR = "public/icons/zodiac"

SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

def generate_icon(sign):
    prompt = f"{sign} zodiac sign symbol, minimalist flat vector icon, black"
    payload = {
        "prompt": prompt,
        "style": "flat",
        "format": "svg",
        "webhook_url": "https://example.com/webhook"
    }
    headers = {
        "Content-Type": "application/json",
        "x-freepik-api-key": API_KEY
    }
    response = requests.post(BASE_URL, json=payload, headers=headers)
    if response.status_code == 200:
        return response.json()["data"]["task_id"]
    else:
        print(f"Error starting task for {sign}: {response.text}")
        return None

def check_task(task_id):
    headers = {"x-freepik-api-key": API_KEY}
    response = requests.get(f"{BASE_URL}/{task_id}", headers=headers)
    if response.status_code == 200:
        return response.json()["data"]
    return None

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    tasks = {}
    for sign in SIGNS:
        print(f"Starting generation for {sign}...")
        task_id = generate_icon(sign)
        if task_id:
            tasks[sign] = task_id
        time.sleep(1) # Rate limit friendly

    results = {}
    pending = list(tasks.keys())
    
    print("\nWaiting for tasks to complete...")
    max_retries = 30
    retry_count = 0
    
    while pending and retry_count < max_retries:
        time.sleep(5)
        retry_count += 1
        still_pending = []
        for sign in pending:
            task_id = tasks[sign]
            data = check_task(task_id)
            if data and data["status"] == "COMPLETED":
                icon_url = data["generated"][0]
                results[sign] = icon_url
                print(f"✓ {sign} completed!")
            else:
                still_pending.append(sign)
        pending = still_pending

    for sign, url in results.items():
        print(f"Downloading {sign} icon...")
        img_data = requests.get(url).content
        with open(f"{OUTPUT_DIR}/{sign.lower()}.svg", "wb") as f:
            f.write(img_data)

    print("\nAll done!")

if __name__ == "__main__":
    main()
