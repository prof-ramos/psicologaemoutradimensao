const fs = require('fs');
const path = require('path');

const API_KEY = "FPSX79372c5e8772ed2878c0ae9bfaa04c4b";
const BASE_URL = "https://api.freepik.com/v1/ai/text-to-icon";
const OUTPUT_DIR = path.join(process.cwd(), "public/icons/zodiac");

const SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

async function generateAndPoll(sign) {
    console.log(`\n--- Processing ${sign} ---`);
    const prompt = `${sign} zodiac sign symbol, minimalist flat vector icon, black`;
    const payload = {
        prompt,
        style: "flat",
        format: "svg",
        webhook_url: "https://example.com/webhook"
    };
    
    let response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-freepik-api-key': API_KEY
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        console.error(`Error starting ${sign}: ${await response.text()}`);
        return;
    }

    const startData = await response.json();
    const taskId = startData.data.task_id;
    console.log(`Task ID for ${sign}: ${taskId}`);

    let completed = false;
    let retries = 0;
    while (!completed && retries < 20) {
        await new Promise(r => setTimeout(r, 10000));
        retries++;
        console.log(`Polling ${sign} (${retries}/20)...`);
        
        response = await fetch(`${BASE_URL}/${taskId}`, {
            headers: { 'x-freepik-api-key': API_KEY }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.data.status === 'COMPLETED') {
                const url = data.data.generated[0];
                console.log(`✓ ${sign} DONE: ${url}`);
                const imgRes = await fetch(url);
                const buffer = Buffer.from(await imgRes.arrayBuffer());
                fs.writeFileSync(path.join(OUTPUT_DIR, `${sign.toLowerCase()}.svg`), buffer);
                completed = true;
            } else if (data.data.status === 'FAILED') {
                console.error(`✗ ${sign} FAILED`);
                break;
            }
        }
    }
}

async function main() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Process only first 4 to save time in this turn
    for (const sign of SIGNS.slice(0, 4)) {
        await generateAndPoll(sign);
    }
    console.log("\nFirst batch done!");
}

main().catch(console.error);
