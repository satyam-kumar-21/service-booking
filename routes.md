# Backend API Documentation & Workflows

**Base Domain**: `http://localhost:5000`

## 🔄 System Workflows

### 1. User Authentication Flow (OTP Based)
1.  **Register/Login Initiate**: User provides `mobile` (and `name`, `email` if registering). System generates OTP (Mock: 123456).
2.  **Verify OTP**: User sends `mobile` and `otp`. System verifies and returns JWT Token.
3.  **Access**: User uses Token to book services.

### 2. Partner Onboarding Flow
1.  **Register**: Partner registers with details, credentials, service type, and uploads documents (ID/Address Proof).
2.  **Approval State**: Partner is initially `isApproved: false`. They can login but might be restricted.
3.  **Admin Verification**: Admin reviews documents via Admin Panel.
4.  **Activation**: Admin sets `isApproved: true`. Partner can now receive bookings.

### 3. Service Booking Flow
1.  **Browse**: User fetches Categories -> SubCategories -> Services.
2.  **Book**: User creates a Booking with `serviceId`, `schedule`, and `address`.
3.  **Assignment**: Admin assigns a Partner to the booking via `PUT /assign`.
4.  **Service Delivery**: Partner views assigned bookings.
5.  **Status Updates**: Partner updates status: `confirmed` -> `in-progress` -> `completed`.
6.  **Payment**: On completion, status updates to `paid` (Cash/Online).

---

## 📡 API Reference

### 👤 User Authentication

#### 1. Register User (Initiate)
*   **URL**: `http://localhost:5000/api/v1/auth/register-otp`
*   **Method**: `POST`
*   **Access**: Public
*   **JSON Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": "9876543210"
    }
    ```

#### 2. Login User (Initiate)
*   **URL**: `http://localhost:5000/api/v1/auth/login-otp`
*   **Method**: `POST`
*   **Access**: Public
*   **JSON Body**:
    ```json
    {
      "mobile": "9876543210"
    }
    ```

#### 3. Verify OTP (Finalize)
*   **URL**: `http://localhost:5000/api/v1/auth/verify-otp`
*   **Method**: `POST`
*   **Access**: Public
*   **JSON Body**:
    ```json
    {
      "mobile": "9876543210",
      "otp": "123456"
    }
    ```
*   **Returns**: `{ token, user }`

#### 4. Get Current User
*   **URL**: `http://localhost:5000/api/v1/auth/me`
*   **Method**: `GET`
*   **Access**: Private (User/Admin)

---

### 🤝 Partner Management

#### 1. Register Partner
*   **URL**: `http://localhost:5000/api/v1/partners/auth/register`
*   **Method**: `POST`
*   **Access**: Public
*   **Content-Type**: `multipart/form-data`
*   **Fields**:
    *   `name`: Text
    *   `email`: Text
    *   `mobile`: Text
    *   `password`: Text (Min 6 chars)
    *   `serviceType`: Service/Category ID (ObjectId)
    *   `serviceArea`: JSON String e.g. `{"pincodes":["110001"],"city":"Delhi"}`
    *   `idProof`: File
    *   `addressProof`: File
    *   `image`: File (Profile Pic)

#### 2. Login Partner
*   **URL**: `http://localhost:5000/api/v1/partners/auth/login`
*   **Method**: `POST`
*   **Access**: Public
*   **JSON Body**:
    ```json
    {
      "email": "partner@example.com",
      "password": "secretpassword"
    }
    ```

#### 3. Get Profile
*   **URL**: `http://localhost:5000/api/v1/partners/me`
*   **Method**: `GET`
*   **Access**: Private (Partner)

#### 4. Update Profile
*   **URL**: `http://localhost:5000/api/v1/partners/profile`
*   **Method**: `POST`
*   **Access**: Private (Partner)
*   **Content-Type**: `multipart/form-data`

---

### 🛠 Services & Categories (Admin)

#### 1. Create Category
*   **URL**: `http://localhost:5000/api/v1/categories`
*   **Method**: `POST`
*   **Access**: Admin
*   **Content-Type**: `multipart/form-data`
*   **Fields**:
    *   `name`: Text
    *   `image`: File

#### 2. Create SubCategory
*   **URL**: `http://localhost:5000/api/v1/subcategories`
*   **Method**: `POST`
*   **Access**: Admin
*   **Content-Type**: `multipart/form-data`
*   **Fields**:
    *   `name`: Text
    *   `category`: Category ID
    *   `image`: File

#### 3. Create Service
*   **URL**: `http://localhost:5000/api/v1/services`
*   **Method**: `POST`
*   **Access**: Admin
*   **Content-Type**: `multipart/form-data`
*   **Fields**:
    *   `name`: Text
    *   `category`: Category ID
    *   `subCategory`: SubCategory ID
    *   `description`: Text
    *   `basePrice`: Number
    *   `visitCharge`: Number
    *   `image`: File

#### 4. Get Services
*   **URL**: `http://localhost:5000/api/v1/services?categoryId=XXX&subCategoryId=YYY`
*   **Method**: `GET`
*   **Access**: Public

---

### 📅 Bookings

#### 1. Create Booking (User)
*   **URL**: `http://localhost:5000/api/v1/bookings`
*   **Method**: `POST`
*   **Access**: Private (User)
*   **JSON Body**:
    ```json
    {
      "serviceId": "65a123...", 
      "schedule": {
        "date": "2024-02-20",
        "slot": "10:00 AM - 11:00 AM"
      },
      "address": {
        "location": "123 Main St, Apt 4B",
        "pincode": "110001"
      }
    }
    ```

#### 2. Get Bookings
*   **URL**: `http://localhost:5000/api/v1/bookings`
*   **Method**: `GET`
*   **Access**: Private (User/Partner/Admin)

#### 3. Assign Partner (Admin)
*   **URL**: `http://localhost:5000/api/v1/bookings/:id/assign`
*   **Method**: `PUT`
*   **Access**: Admin
*   **JSON Body**:
    ```json
    {
      "partnerId": "65b987..."
    }
    ```

#### 4. Update Status (Partner/Admin)
*   **URL**: `http://localhost:5000/api/v1/bookings/:id/status`
*   **Method**: `PUT`
*   **Access**: Partner (Assigned) / Admin
*   **JSON Body**:
    ```json
    {
      "status": "in-progress" 
    }
    ```

---

### 📢 Notifications

#### 1. Get Notifications
*   **URL**: `http://localhost:5000/api/v1/notifications`
*   **Method**: `GET`
*   **Access**: Private (User/Partner)

#### 2. Mark Read
*   **URL**: `http://localhost:5000/api/v1/notifications/:id/read`
*   **Method**: `PUT`
*   **Access**: Private (User/Partner)

---

### 👮 Admin Management

#### 1. Admin Register
*   **URL**: `http://localhost:5000/api/v1/admin/auth/register`
*   **Method**: `POST`
*   **Access**: Public (Often restricted in prod)
*   **JSON Body**:
    ```json
    {
      "name": "Admin Name",
      "email": "admin@admin.com",
      "password": "password"
    }
    ```

#### 2. Admin Login
*   **URL**: `http://localhost:5000/api/v1/admin/auth/login`
*   **Method**: `POST`
*   **JSON Body**:
    ```json
    {
      "email": "admin@admin.com",
      "password": "password"
    }
    ```

#### 3. Approve Partner
*   **URL**: `http://localhost:5000/api/v1/admin/partners/:id/approval`
*   **Method**: `PUT`
*   **Access**: Admin
*   **JSON Body**:
    ```json
    {
      "isApproved": true
    }
    ```
