# Grand Ville Bakery System

A full-stack bakery and cafe management system with React frontend, Express backend, and MongoDB.

## Features

- **Customer Order**: Register, browse menu, add to cart, checkout
- **POS (Point of Sale)**: Staff order entry, order status management
- **Dashboard**: Sales overview, top products, low stock alerts
- **Admin**: Menu/product management (add, edit, delete)
- **Auth**: Staff login with PIN (manager: 1234, cashier: 5678)

## Tech Stack

- **Frontend**: React, React Router, Bootstrap 5, Chart.js, Axios
- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Quick Start

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Configure (optional)
cp .env.example .env
# Edit .env: MONGODB_URI=mongodb://localhost:27017/bakery

# Seed database
npm run seed

# Build React app
npm run build

# Start server
npm run start
```

Open http://localhost:3000

## Development

```bash
# Terminal 1: Backend
npm run start

# Terminal 2: Frontend (with hot reload)
npm run dev:client
```

Frontend runs at http://localhost:5173 and proxies `/api` to the backend.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Express server |
| `npm run seed` | Seed products and default staff |
| `npm run build` | Build React client |
| `npm run dev:client` | Run React dev server |

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system architecture, API reference, and deployment options.
