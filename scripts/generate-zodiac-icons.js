const fs = require('fs');
const path = require('path');

const API_KEY = "FPSX79372c5e8772ed2878c0ae9bfaa04c4b";
const BASE_URL = "https://api.freepik.com/v1/ai/text-to-icon";
const OUTPUT_DIR = path.join(process.cwd(), "public/icons/zodiac");

const SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

async function generateIcon(sign) {
    const prompt = `${sign} zodiac sign symbol, minimalist flat vector icon, black`;
    const payload = {
        prompt,
        style: "flat",
        format: "svg",
        webhook_url: "https://example.com/webhook"
    };
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-freepik-api-key': API_KEY
        },
        body: JSON.stringify(payload)
    });
    if (response.ok) {
        const json = await response.json();
        return json.data.task_id;
    } else {
        const text = await response.text();
        console.error(`Error starting task for ${sign}: ${text}`);
        return null;
    }
}

async function checkTask(taskId) {
    const response = await fetch(`${BASE_URL}/${taskId}`, {
        headers: { 'x-freepik-api-key': API_KEY }
    });
    if (response.ok) {
        const json = await response.json();
        return json.data;
    }
    return null;
}

async function main() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const tasks = {};
    for (const sign of SIGNS) {
        console.log(`Starting generation for ${sign}...`);
        const taskId = await generateIcon(sign);
        if (taskId) {
            tasks[sign] = taskId;
        }
        await new Promise(r => setTimeout(r, 1000));
    }

    const results = {};
    let pending = Object.keys(tasks);
    
    console.log("\nWaiting for tasks to complete...");
    let retryCount = 0;
    while (pending.length > 0 && retryCount < 30) {
        await new Promise(r => setTimeout(r, 5000));
        retryCount++;
        const stillPending = [];
        for (const sign of pending) {
            const taskId = tasks[sign];
            const data = await checkTask(taskId);
            if (data && data.status === "COMPLETED") {
                const iconUrl = data.generated[0];
                results[sign] = iconUrl;
                console.log(`✓ ${sign} completed!`);
            } else {
                stillPending.push(sign);
            }
        }
        pending = stillPending;
    }

    for (const sign of Object.keys(results)) {
        const url = results[sign];
        console.log(`Downloading ${sign} icon...`);
        const response = await fetch(url);
        const buffer = Buffer.from(await response.arrayBuffer());
        fs.writeFileSync(path.join(OUTPUT_DIR, `${sign.toLowerCase()}.svg`), buffer);
    }

    console.log("\nAll done!");
}

main().catch(console.error);
