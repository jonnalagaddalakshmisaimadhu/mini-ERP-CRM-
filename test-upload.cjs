const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function testUpload() {
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@minierp.com',
      password: 'admin123'
    });
    const token = loginRes.data.token;

    // 2. Create dummy file
    fs.writeFileSync('dummy.jpg', 'fake image content');

    // 3. Upload
    const form = new FormData();
    form.append('image', fs.createReadStream('dummy.jpg'));

    const uploadRes = await axios.post('http://localhost:5000/api/upload', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log('✅ Upload Success:', uploadRes.data);
  } catch (err) {
    console.error('❌ Upload Failed:');
    if (err.response) {
      console.error(err.response.data);
    } else {
      console.error(err.message);
    }
  } finally {
    if (fs.existsSync('dummy.jpg')) fs.unlinkSync('dummy.jpg');
  }
}

testUpload();
