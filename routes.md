# API Routes Reference
**Base URL:** `http://localhost:5000`

---

## Model: User / Auth
**Who can access**: Public (for registration/login), Authenticated Users (for profile)

- **Login (OTP Request)**: `POST http://localhost:5000/api/v1/auth/login-otp`
- **Login (Verify OTP)**: `POST http://localhost:5000/api/v1/auth/verify-otp`
- **Read Profile**: `GET http://localhost:5000/api/v1/auth/me`

---

## Model: Admin (Auth)
**Who can access**: Public (Login/Register), Admins (Profile)

- **Register**: `POST http://localhost:5000/api/v1/admin/auth/register`
- **Login**: `POST http://localhost:5000/api/v1/admin/auth/login`
- **Read Profile**: `GET http://localhost:5000/api/v1/admin/auth/me`

---

## Model: Category
**Who can access**: Admin (Create/Update), Public (Read)

- **Create**: `POST http://localhost:5000/api/v1/categories`
- **Read All**: `GET http://localhost:5000/api/v1/categories`
- **Update**: `PUT http://localhost:5000/api/v1/categories/:id`
- **Delete**: `DELETE http://localhost:5000/api/v1/categories/:id`

---

## Model: Service
**Who can access**: Admin (Create/Update), Public (Read)

- **Create**: `POST http://localhost:5000/api/v1/services`
- **Read All**: `GET http://localhost:5000/api/v1/services`
- **Update**: `PUT http://localhost:5000/api/v1/services/:id`
- **Delete**: `DELETE http://localhost:5000/api/v1/services/:id`

---

## Model: User (Management)
**Who can access**: Admin

- **Read All**: `GET http://localhost:5000/api/v1/admin/users`
- **Update Status (Block/Unblock)**: `PUT http://localhost:5000/api/v1/admin/users/:id/status`

---

## Model: Partner
**Who can access**: Admin (Approve/List), Partner (Update Profile)

- **Read All (Admin)**: `GET http://localhost:5000/api/v1/admin/partners`
- **Update Approval (Admin)**: `PUT http://localhost:5000/api/v1/admin/partners/:id/approval`
- **Update Profile (Partner)**: `POST http://localhost:5000/api/v1/partners/profile`
- **Read Profile (Partner)**: `GET http://localhost:5000/api/v1/partners/me`

---

## Model: Booking
**Who can access**: User (Create/Read Own), Partner (Read/Update Status), Admin (Read All/Assign)

- **Create (User)**: `POST http://localhost:5000/api/v1/bookings`
- **Read All**: `GET http://localhost:5000/api/v1/bookings`
- **Update Status (Partner/Admin)**: `PUT http://localhost:5000/api/v1/bookings/:id/status`
- **Assign Partner (Admin)**: `PUT http://localhost:5000/api/v1/bookings/:id/assign`

---

## Model: Notification
**Who can access**: Authenticated Users

- **Read All**: `GET http://localhost:5000/api/v1/notifications`
- **Update (Mark Read)**: `PUT http://localhost:5000/api/v1/notifications/:id/read`

---

## Documentation
- **Swagger UI**: `http://localhost:5000/api-docs`
