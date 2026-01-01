async function test() {
    try {
        console.log('Testing http://localhost:3000/api/analyze...');
        const res = await fetch('http://localhost:3000/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'const secret = "123";' })
        });
        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Raw Response:', text);
    } catch (e) {
        console.error('Connection Error:', e.cause || e);
    }
}
test();
