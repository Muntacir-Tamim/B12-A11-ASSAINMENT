# CivicFix – Public Infrastructure Issue Reporting System

## 🌐 Live Site URL

## 🔐 Admin Credentials

- **Email:** muntacirtamim202162@gmail.com
- **Password:** muntacirtamim202162@gmail.com

---

## ✨ Features

- **Citizen Issue Reporting** – Citizens can submit infrastructure issues (potholes, streetlights, water leakage, etc.) with photos, location, and category in a few clicks.
- **Role-Based Dashboards** – Three dedicated dashboards for Citizens, Staff, and Admins, each with tailored tools and data.
- **Live Issue Timeline** – Every issue has a full read-only timeline showing each status change, who made it, and when — for complete transparency.
- **Staff Assignment System** – Admins assign specific staff members to issues; assigned staff instantly see tasks in their dashboard.
- **Issue Status Workflow** – Issues move through a clear lifecycle: Pending → In-Progress → Working → Resolved → Closed, with only valid transitions allowed.
- **Boost Priority via Payment** – Citizens can pay ৳100 via Stripe to boost an issue to high priority, pushing it to the top of all lists.
- **Premium Subscription** – Citizens can pay ৳1,000 to become premium members and submit unlimited issues (free users capped at 3).
- **Upvote System** – Logged-in citizens can upvote issues once to signal public importance; upvote count is visible everywhere.
- **Admin Citizen Management** – Admins can block or unblock citizens; blocked users cannot submit, edit, upvote, or boost issues.
- **Server-Side Search, Filter & Pagination** – The public All Issues page supports full server-side search by title/location/category, filtering by status/priority/category, and paginated results.

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, TanStack Query, React Router v7, React Hook Form, Recharts, Headless UI, Firebase Auth, Axios

**Backend:** Node.js, Express, MongoDB, Firebase Admin SDK, Stripe

---

## 📁 Project Structure

```
backend/
├── index.js
├── .env
└── serviceKeyConverter.js

frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard/Sidebar/
│   │   ├── Home/
│   │   ├── Modal/
│   │   ├── Shared/
│   │   └── Dashboard/Statistics/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   │   ├── Home/
│   │   ├── AllIssues/
│   │   ├── IssueDetails/
│   │   ├── Dashboard/
│   │   │   ├── Admin/
│   │   │   ├── Staff/
│   │   │   ├── Citizen/
│   │   │   └── Common/
│   │   ├── Login/
│   │   └── SignUp/
│   ├── providers/
│   ├── routes/
│   └── utils/
```

---
