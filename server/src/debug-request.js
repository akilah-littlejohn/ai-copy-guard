async function testServer() {
    try {
        const response = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'const AWS_KEY = "AKIA1234567890";' })
        });

        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Body:', text);

    } catch (e) {
        console.error('Fetch Error:', e.message);
    }
}

testServer();
