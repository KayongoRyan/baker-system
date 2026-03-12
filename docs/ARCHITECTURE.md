# Bakery System Architecture

## Overview

Grand Ville Bakery is a full-stack system for a small cafe, built with:
- **Frontend**: React, Bootstrap 5, Chart.js
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose

## System Architecture

### Full System (Production-Style)

```
Internet → Load Balancer → API Servers (x3) → Redis Cache → MongoDB
                ↓
            CDN (Static)
```

### Request Flow

1. Client (browser/POS) sends request to Load Balancer
2. Load Balancer distributes to available API servers (round-robin or least connections)
3. API server handles request, optionally checks Redis cache
4. MongoDB stores/retrieves data
5. Response returned to client

### Infrastructure Zones

- **DMZ**: Load Balancer (ports 80/443)
- **Application Zone**: API servers, static file server
- **Data Zone**: MongoDB cluster, Redis cache

## Data Model

| Collection | Purpose |
|------------|---------|
| products | Menu items (name, price, category, description) |
| orders | Sales transactions (items, total, status) |
| users | Customers and staff accounts |
| staff | Staff login (PIN, role: cashier/manager) |
| inventory | Stock levels and low-stock thresholds |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Health check for load balancer |
| GET | /api/products | List available products |
| GET | /api/products/all | List all products (admin) |
| GET | /api/products/:id | Get single product |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /api/orders | List orders |
| POST | /api/orders | Create order |
| PUT | /api/orders/:id | Update order status |
| POST | /api/users | Register user |
| GET | /api/users/:id | Get user |
| GET | /api/inventory | List inventory |
| GET | /api/inventory/low-stock | Low stock items |
| PUT | /api/inventory/:id | Update inventory |
| GET | /api/reports/sales | Sales report |
| GET | /api/reports/top-products | Top products |
| GET | /api/reports/sales-overview | Daily sales (for charts) |
| POST | /api/auth/login | Staff login (PIN) |

## User Flows

### Customer Order
1. Register (username, email, password, address)
2. Browse/search products
3. Add to cart
4. Checkout → Order created

### Staff POS
1. Login with PIN
2. Search products, add to cart
3. Submit order
4. View recent orders, update status (complete/cancel)

### Manager Dashboard
1. Login with PIN
2. View sales overview, top products
3. Check low stock alerts
4. Filter by date range

### Admin (Menu Management)
1. Login with PIN
2. Add/edit/delete products
3. Set categories and descriptions

## File Structure

```
baker-system/
├── server.js           # Express app
├── config/db.js        # MongoDB connection
├── models/             # Mongoose models
├── routes/             # API routes
├── scripts/seed.js     # Database seeder
├── client/             # React app
│   ├── src/
│   │   ├── pages/      # Home, POS, Dashboard, Admin, Login
│   │   ├── context/    # AuthContext
│   │   └── api.js      # API client
│   └── dist/           # Production build
└── docs/
```

## Setup

1. Install dependencies: `npm install` (root) and `cd client && npm install`
2. Create `.env` with `MONGODB_URI=mongodb://localhost:27017/bakery`
3. Start MongoDB
4. Seed database: `npm run seed`
5. Build client: `npm run build`
6. Start server: `npm run start`

## Development

- Backend: `npm run start` (port 3000)
- Frontend: `npm run dev:client` (port 5173, proxies /api to 3000)

## Demo Credentials

- Manager: PIN `1234`
- Cashier: PIN `5678`
