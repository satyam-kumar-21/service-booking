const fetch = require('node-fetch'); // backend might not have node-fetch if node < 18, but wait, usually standard fetch is available in Node 18+
// In verify script I used standard fetch.
// Let's assume Node 18+ as per walkthrough.

async function testCategory() {
    try {
        console.log('Testing GET /api/v1/categories...');
        const res = await fetch('http://localhost:5000/api/v1/categories');
        console.log(`Status: ${res.status}`);
        if(res.status === 200) {
            const data = await res.json();
            console.log('Data:', data);
        } else {
            console.log('Text:', await res.text());
        }
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

testCategory();
