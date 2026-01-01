import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.DD_API_KEY;
const site = process.env.DD_SITE || 'datadoghq.com';

console.log('Sending test log to Datadog...');
console.log('API Key:', apiKey ? 'Present' : 'MISSING');
console.log('Site:', site);

async function sendLog() {
    const url = `https://http-intake.logs.${site}/api/v2/logs`;
    const entry = {
        ddsource: 'ai-copy-guard-test',
        service: 'test-script',
        message: 'Hello Datadog! Force Activation Log.',
        status: 'info',
        timestamp: Date.now()
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'DD-API-KEY': apiKey || ''
            },
            body: JSON.stringify(entry)
        });

        if (response.ok) {
            console.log('✅ Log sent successfully! Check your dashboard.');
        } else {
            console.error('❌ Failed:', response.status, response.statusText);
            const text = await response.text();
            console.error('Response:', text);
        }
    } catch (e) {
        console.error('Network Error:', e);
    }
}

sendLog();
