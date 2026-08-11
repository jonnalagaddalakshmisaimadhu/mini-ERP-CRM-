const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = '';
let customerId = '';
let productId = '';
let challanId = '';

async function runTests() {
  console.log('--- Starting End-to-End API Integration Test ---');
  
  try {
    // 1. Login
    console.log('\n[1] Testing Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@minierp.com',
      password: 'admin123'
    });
    token = loginRes.data.token;
    console.log('✅ Login Successful. Token received.');
    
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // 2. Create Customer
    console.log('\n[2] Testing Create Customer...');
    const custRes = await axios.post(`${API_URL}/customers`, {
      name: 'Test Customer ' + Date.now(),
      mobile: '1234567890',
      email: 'test@example.com',
      type: 'RETAIL',
      status: 'ACTIVE'
    }, config);
    customerId = custRes.data.id;
    console.log('✅ Customer Created. ID:', customerId);

    // 3. Create Product
    console.log('\n[3] Testing Create Product...');
    const prodRes = await axios.post(`${API_URL}/products`, {
      name: 'Test Product ' + Date.now(),
      sku: 'SKU-' + Date.now(),
      category: 'Electronics',
      unitPrice: 199.99,
      currentStock: 50,
      minStockAlert: 10
    }, config);
    productId = prodRes.data.id;
    console.log('✅ Product Created. ID:', productId);

    // 4. Add Follow up Note
    console.log('\n[4] Testing Customer Note...');
    await axios.post(`${API_URL}/customers/${customerId}/notes`, {
      note: 'Needs a follow up call next week.'
    }, config);
    console.log('✅ Note Added to Customer.');

    // 5. Create Draft Challan
    console.log('\n[5] Testing Create Draft Challan...');
    const challanRes = await axios.post(`${API_URL}/challans`, {
      customerId: customerId,
      items: [
        { productId: productId, quantity: 5 }
      ]
    }, config);
    challanId = challanRes.data.id;
    console.log(`✅ Draft Challan Created. ID: ${challanId}, No: ${challanRes.data.challanNumber}`);

    // 6. Confirm Challan and Check Stock Deduction
    console.log('\n[6] Testing Confirm Challan & Stock Logic...');
    await axios.post(`${API_URL}/challans/${challanId}/confirm`, {}, config);
    console.log('✅ Challan Confirmed.');
    
    // Check updated stock
    const updatedProdRes = await axios.get(`${API_URL}/products/${productId}`, config);
    const updatedStock = updatedProdRes.data.currentStock;
    console.log(`✅ Product Stock deducted. Expected: 45, Actual: ${updatedStock}`);

    if (updatedStock === 45) {
      console.log('\n🎉 ALL CORE BUSINESS LOGIC TESTS PASSED SUCCESSFULLY! 🎉');
    } else {
      console.log('\n❌ ERROR: Stock deduction did not match expected value.');
    }

  } catch (error) {
    console.error('\n❌ TEST FAILED!');
    console.error(error.response ? error.response.data : error.message);
  }
}

runTests();
