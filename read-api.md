# 📘 Live API Documentation

**Base URL**: `https://service-booking-theta.vercel.app`

This document provides a systematic guide to the API endpoints hosted on the production server.

---

## 🔐 1. User Authentication
Manage user accounts via OTP or Password.

### Register (New User)
*   **Method**: `POST`
*   **URL**: `https://service-booking-theta.vercel.app/api/v1/auth/register-otp`
*   **Description**: Creates a new user account. You can optionally provide a password.
*   **Body (JSON)**:
    ```json
    {
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "mobile": "9876543210",
      "password": "securePassword123" 
    }
    ```
    *(Note: `password` is optional if you only want to use OTP)*

### Login (via OTP)
*   **Method**: `POST`
*   **URL**: `https://service-booking-theta.vercel.app/api/v1/auth/login-otp`
*   **Description**: request an OTP to login.
*   **Body (JSON)**:
    ```json
    {
      "mobile": "9876543210"
    }
    ```

### Login (via Password)
*   **Method**: `POST`
*   **URL**: `https://service-booking-theta.vercel.app/api/v1/auth/login-password`
*   **Description**: Login directly using password (if set).
*   **Body (JSON)**:
    ```json
    {
      "mobile": "9876543210",
      "password": "securePassword123"
    }
    ```

### Verify OTP (Complete Login/Register)
*   **Method**: `POST`
*   **URL**: `https://service-booking-theta.vercel.app/api/v1/auth/verify-otp`
*   **Description**: Verify the OTP received on mobile to get your Access Token.
*   **Body (JSON)**:
    ```json
    {
      "mobile": "9876543210",
      "otp": "123456"
    }
    ```
*   **Response**: Returns `{ token, user }`. **Save this Token!**

### Get My Profile
*   **Method**: `GET`
*   **URL**: `https://service-booking-theta.vercel.app/api/v1/auth/me`
*   **Header**: `Authorization: Bearer <YOUR_TOKEN>`

---

## 🤝 2. Partner Management
For service providers to register and manage their profiles.

### Register Partner
*   **Method**: `POST`
*   **URL**: `https://service-booking-theta.vercel.app/api/v1/partners/auth/register`
*   **Type**: `multipart/form-data` (File Uploads)
*   **Fields**:
    *   `name`: "Vikram Singh"
    *   `email`: "vikram@partner.com"
    *   `mobile`: "9988776655"
    *   `password`: "partnerPass123"
    *   `serviceType`: "65a1234567890abcdef12345" (ID of the Service category)
    *   `serviceArea`: `{"pincodes":["110001", "110002"],"city":"Delhi"}` (JSON String)
    *   `idProof`: [Upload File]
    *   `addressProof`: [Upload File]
    *   `image`: [Upload File]

### Login Partner
*   **Method**: `POST`
*   **URL**: `https://service-booking-theta.vercel.app/api/v1/partners/auth/login`
*   **Body (JSON)**:
    ```json
    {
      "email": "vikram@partner.com",
      "password": "partnerPass123"
    }
    ```

### Get Partner Profile
*   **Method**: `GET`
*   **URL**: `https://service-booking-theta.vercel.app/api/v1/partners/me`
*   **Header**: `Authorization: Bearer <PARTNER_TOKEN>`

---

## 🛠️ 3. Services & Categories (Public)
Browse available services.

### Get All Categories
*   **Method**: `GET`
*   **URL**: `https://service-booking-theta.vercel.app/api/v1/categories`

### Get Services
*   **Method**: `GET`
*   **URL**: `https://service-booking-theta.vercel.app/api/v1/services`
*   **Query Params**:
    *   `?categoryId=...` (Filter by Category)
    *   `?subCategoryId=...` (Filter by SubCategory)

---

## 📅 4. Bookings
Create and manage service appointments.

### Create Booking
*   **Method**: `POST`
*   **URL**: `https://service-booking-theta.vercel.app/api/v1/bookings`
*   **Header**: `Authorization: Bearer <USER_TOKEN>`
*   **Body (JSON)**:
    ```json
    {
      "serviceId": "65a1234567890abcdef12345",
      "schedule": {
        "date": "2024-03-25",
        "slot": "10:00 AM - 12:00 PM"
      },
      "address": {
        "location": "Flat 402, Sunshine Apts, MG Road",
        "pincode": "110001"
      }
    }
    ```

### Get My Bookings
*   **Method**: `GET`
*   **URL**: `https://service-booking-theta.vercel.app/api/v1/bookings`
*   **Header**: `Authorization: Bearer <TOKEN>`
*   **Description**:
    *   **Users**: See their own bookings.
    *   **Partners**: See bookings assigned to them.

---

## 👮 5. Admin & Management (Restricted)

### Admin Login
*   **Method**: `POST`
*   **URL**: `https://service-booking-theta.vercel.app/api/v1/admin/auth/login`
*   **Body (JSON)**:
    ```json
    {
      "email": "admin@admin.com",
      "password": "adminPassword"
    }
    ```

### Assign Partner to Booking
*   **Method**: `PUT`
*   **URL**: `https://service-booking-theta.vercel.app/api/v1/bookings/:id/assign`
*   **Header**: `Authorization: Bearer <ADMIN_TOKEN>`
*   **Body (JSON)**:
    ```json
    {
      "partnerId": "65b9876543210abcdef54321"
    }
    ```

### Update Booking Status
*   **Method**: `PUT`
*   **URL**: `https://service-booking-theta.vercel.app/api/v1/bookings/:id/status`
*   **Header**: `Authorization: Bearer <ADMIN_OR_PARTNER_TOKEN>`
*   **Body (JSON)**:
    ```json
    {
      "status": "in-progress"
    }
    ```
    *Options: `requested`, `assigned`, `in-progress`, `completed`, `cancelled`*
