# Techcelerators Centralized Lead Management & Allocation Platform

Phase 1 foundation for a SaaS-style LMS MVP with centralized MySQL storage, REST API backend, and Next.js frontend scaffold.

## Project Structure

```text
techcelerators-lms/
├── backend/
│   ├── src/
│   │   ├── config/database.js
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── controllers/
│   │   ├── utils/
│   │   └── app.js
│   ├── database/
│   │   ├── migrations/001_initial_schema.sql
│   │   ├── schema.sql
│   │   └── seeds.sql
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── .env.example
│   ├── components.json
│   ├── package.json
│   ├── next.config.js
│   └── vercel.json
├── docker-compose.yml
├── render.yaml
└── README.md
```

## Database Schema

Core tables:
- `leads`
- `counselors`
- `allocations`
- `lead_activity`

### Enum values

- `source`: `Meta | Instagram | Website | WhatsApp | Referral | Walk-in | FormCirculation`
- `connectivity_status`: `connected | dnp | vulgar | cut_call | switch_off | wrong_number | time_given`
- `current_status`: `follow_up | dnp | denied | payment_done`

## Seed Data

`backend/database/seeds.sql` inserts:
- 25 counselors
- 560 leads distributed across all 7 sources
- allocation history for assigned leads
- lead activity logs

## Backend API (Express + MySQL)

Base URL: `http://localhost:5000/api`

- `POST /leads` - create lead
- `GET /leads` - paginated leads list
- `GET /leads/:id` - single lead
- `PUT /leads/:id` - update lead
- `GET /leads/search` - filter by `source`, `status`, `connectivity`, `assigned_to`
- `POST /allocations` - allocate lead to counselor
- `GET /allocations/lead/:id` - allocation history
- `GET /counselors` - list counselors
- `POST /counselors` - create counselor
- `GET /activity/lead/:id` - activity timeline
- `GET /reports/dashboard` - dashboard metrics

## Frontend (Next.js 15)

Includes:
- App Router layout
- Tailwind CSS setup
- shadcn-ready config (`components.json`, `lib/utils.js`)
- Base routes: `/`, `/leads`, `/counselors`
- Axios API client at `frontend/lib/api.js`

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=techcelerators_lms
DB_CONNECTION_LIMIT=10
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=300
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Local Development

### Option 1: Docker Compose

```bash
docker compose up --build
```

### Option 2: Run services manually

Backend:
```bash
cd backend
npm install
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Deployment

- Backend: Render (`render.yaml`)
- Frontend: Vercel (`frontend/vercel.json`)

## Scalability Notes

The schema and API are built to scale for high-volume lead operations (50,000+ leads) without redesign and keep full allocation/activity audit trails for future automation phases.
