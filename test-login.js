
const axios = require('axios');

async function testLogin() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@eshop.com',
            password: 'admin123'
        });
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    } catch (error) {
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testLogin();
