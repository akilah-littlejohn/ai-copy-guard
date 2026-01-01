const https = require('https');

const apiKey = 'db418eacbe355809f3f185fe8a7a0c82';
const sites = [
    'datadoghq.com',      // US1
    'us3.datadoghq.com',  // US3
    'us5.datadoghq.com',  // US5
    'datadoghq.eu',       // EU
    'ap1.datadoghq.com'   // AP1
];

console.log('🔍 Probing Datadog Regions for API Key...');

async function probe(site) {
    const url = `https://http-intake.logs.${site}/api/v2/logs`;
    const entry = {
        ddsource: 'probe-script',
        message: 'Datadog Region Probe - Hello World',
        service: 'region-check',
        hostname: 'localhost-probe'
    };

    return new Promise(resolve => {
        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'DD-API-KEY': apiKey
            }
        }, (res) => {
            if (res.statusCode === 200 || res.statusCode === 202) {
                console.log(`✅ SUCCESS: ${site} accepted the key!`);
                resolve(site);
            } else {
                console.log(`❌ Failed: ${site} (${res.statusCode})`);
                resolve(null);
            }
        });

        req.on('error', (e) => {
            console.log(`❌ Error: ${site} (${e.message})`);
            resolve(null);
        });

        req.write(JSON.stringify(entry));
        req.end();
    });
}

async function run() {
    for (const site of sites) {
        const success = await probe(site);
        if (success) process.exit(0);
    }
    console.log('All regions failed.');
    process.exit(1);
}

run();
