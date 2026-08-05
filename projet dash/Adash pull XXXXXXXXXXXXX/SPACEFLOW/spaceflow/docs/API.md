# API Reference

Base URL: `https://api.spaceflow.com/v1`

## Authentication

All endpoints (except `/auth/login` and `/auth/register`) require a Bearer token.

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.spaceflow.com/spaces
```

## Endpoints

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user

### Spaces
- `GET /spaces` - List spaces
- `POST /spaces` - Create space
- `GET /spaces/:id` - Get space
- `PUT /spaces/:id` - Update
- `DELETE /spaces/:id` - Soft delete

### Bookings
- `GET /bookings` - List
- `POST /bookings` - Create
- `POST /bookings/:id/checkin` - Check-in
- `GET /bookings/availability` - Check availability

### Members
- `GET /members` - List
- `POST /members` - Create
- `GET /members/:id` - Get
- `PUT /members/:id` - Update
- `DELETE /members/:id` - Soft delete

### Invoices
- `GET /invoices` - List
- `POST /invoices` - Create
- `GET /invoices/:id` - Get
- `POST /invoices/:id/mark-paid` - Mark paid
- `GET /invoices/stats` - Stats

### Billing
- `GET /billing/plans` - List plans
- `POST /billing/checkout` - Create Stripe session
- `POST /billing/portal` - Open customer portal
- `POST /billing/cancel` - Cancel subscription

### Stats & Dashboard
- `GET /stats/kpis` - Get KPIs
- `GET /stats/revenue-chart` - Revenue over time
- `GET /stats/top-spaces` - Top performing spaces

### WebSocket Events
Connect to `wss://api.spaceflow.com/socket.io` with Bearer token.

Events:
- `booking:created` - New booking
- `booking:checked-in` - Member checked in
- `booking:cancelled` - Booking cancelled
- `presence:changed` - User online/offline

## Rate Limiting
- 1000 requests / 15min per IP
- 5 auth requests / 15min per IP
