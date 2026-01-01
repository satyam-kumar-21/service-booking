const http = require('http');

const BASE_URL = 'http://localhost:5000/api/v1';

async function request(method, endpoint, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
    const data = await response.json();
    console.log(`[${method}] ${endpoint} -> ${response.status}`);
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('--- Starting API Tests ---\n');

  // 1. Admin Registration
  const adminEmail = `admin${Date.now()}@example.com`;
  console.log(`Testing with Admin Email: ${adminEmail}`);

  let res = await request('POST', '/admin/auth/register', {
    name: 'Test Admin',
    email: adminEmail,
    password: 'password123'
  });
  
  let adminToken = null;
  if (res && res.status === 201) {
    console.log('✅ Admin Registered');
    adminToken = res.data.token;
  } else {
    console.log('❌ Admin Registration Failed', res?.data);
  }

  // 2. Admin Login
  if (!adminToken) {
      res = await request('POST', '/admin/auth/login', {
        email: adminEmail,
        password: 'password123'
      });
      if (res && res.status === 200) {
        console.log('✅ Admin Login Success');
        adminToken = res.data.token;
      } else {
        console.log('❌ Admin Login Failed', res?.data);
      }
  }

  // 3. Admin Profile (Protected)
  if (adminToken) {
      res = await request('GET', '/admin/auth/me', null, adminToken);
      if (res && res.status === 200) {
        console.log('✅ Get Admin Profile Success');
      } else {
        console.log('❌ Get Admin Profile Failed', res?.data);
      }
  }

  console.log('\n--- Testing User Auth ---\n');

  // 4. User OTP Login
  const userMobile = '9876543210';
  res = await request('POST', '/auth/login-otp', { mobile: userMobile });
  if (res && res.status === 200) {
      console.log('✅ User OTP Request Success');
  } else {
      console.log('❌ User OTP Request Failed', res?.data);
  }

  // 5. User Verify OTP (Mock: 123456)
  res = await request('POST', '/auth/verify-otp', { mobile: userMobile, otp: '123456' });
  let userToken = null;
  if (res && res.status === 200) {
      console.log('✅ User Verify OTP Success');
      userToken = res.data.token;
  } else {
      console.log('❌ User Verify OTP Failed', res?.data);
  }

  // 6. User Profile
  if (userToken) {
      res = await request('GET', '/auth/me', null, userToken);
      if (res && res.status === 200) {
          console.log('✅ Get User Profile Success');
      } else {
          console.log('❌ Get User Profile Failed', res?.data);
      }

      // 7. Get Notifications
      res = await request('GET', '/notifications', null, userToken); // /api/v1/notifications
      if (res && res.status === 200) {
          console.log('✅ Get Notifications Success');
      } else {
          console.log('❌ Get Notifications Failed', res?.data);
      }
  }

  // 8. Swagger Docs Check
  // Note: This is an HTML page, so we just check status 301/200 
  // Swagger UI redirects /api-docs to /api-docs/ usually or serves index
  try {
      const response = await fetch('http://localhost:5000/api-docs/');
      if (response.status === 200) {
          console.log('✅ Swagger UI Reachable');
      } else {
          console.log(`❌ Swagger UI Status: ${response.status}`);
      }
  } catch (e) {
      console.log('❌ Swagger UI Unreachable');
  }

  console.log('\n--- Tests Completed ---');
}

runTests();
