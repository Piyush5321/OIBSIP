# PizzaWizza

Full-stack pizza delivery app (React + Node + MongoDB). Razorpay integration is planned for later.

## Run backend

```bash
cd server
npm install
# Set MONGO_URI and JWT_SECRET in .env
npm run seed   # optional: creates admin user + pizza options + inventory
npm run dev    # http://localhost:5000
```

**Admin login (after seed):** `admin@pizza.com` / `admin123`

## Run frontend

```bash
cd client
npm install
npm run dev    # http://localhost:5173
```

Ensure the backend is running so API calls (via proxy) work.

## Features

- User: Register, login, view pizza varieties, build custom pizza (base, sauce, cheese, veggies), cart, place order, view order status.
- Admin: Orders list and status updates (placed → in_kitchen → sent_to_delivery → delivered), inventory list and edit quantity/threshold.
