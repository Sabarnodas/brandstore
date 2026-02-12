const https = require('http'); // Using http since it's localhost:5000

const data = JSON.stringify({
    name: 'Test Verify User',
    email: 'sabarnodas365@gmail.com', // Using the user's secondary email
    password: 'TestPassword123!'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Sending registration request...');

const req = https.request(options, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);
    let responseBody = '';

    res.on('data', (d) => {
        responseBody += d;
    });

    res.on('end', () => {
        console.log('Response:', responseBody);
    });
});

req.on('error', (error) => {
    console.error('Error sending request:', error);
});

req.write(data);
req.end();
