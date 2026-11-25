# InterviewIQ.AI

InterviewIQ.AI is a full-stack mock interview platform for practicing technical
and HR interviews. It combines AI-generated questions, resume-aware interview
setup, voice-based interview flow, interview reports, Stripe credit plans, and a
Judge0-powered DSA coding round.

## Repository structure

```text
.
├── client/        # React + Vite frontend
├── server/        # Express + MongoDB API
└── render.yaml    # Render Blueprint for the API service
```

## Features

- **Google sign-in** with Firebase Authentication.
- **AI interview practice** for technical and HR rounds, with optional resume
  analysis to tailor questions.
- **Voice interview flow** with answer submission, feedback, and generated
  interview reports.
- **Interview history** with date, time, duration, report access, and deletion
  controls. Duration is saved when an interview is completed or abandoned.
- **Optional local candidate video recording** with in-browser preview and
  download. Recordings stay in browser memory for the current session and are
  not uploaded.
- **DSA coding round** with a side-by-side problem and CodeMirror editor.
  Supported languages: C++, Python, Java, JavaScript, and Kotlin.
- **Judge0 test execution** for the current Two Sum challenge through an
  authenticated, rate-limited server endpoint.
- **Stripe Checkout credit plans**: Starter (INR 100 / 150 credits) and Pro
  (INR 500 / 650 credits).
- **Upcoming features page** for planned ideas that are not yet available in the
  product.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, Redux Toolkit, React Router, Tailwind CSS, Firebase Auth |
| Backend | Node.js, Express 5, MongoDB/Mongoose, JWT cookies, Multer, PDF parsing |
| AI / Integrations | OpenRouter, Judge0 CE via RapidAPI, Stripe Checkout |

## Requirements

- Node.js 22.13 or newer
- npm
- MongoDB database
- Firebase project with Google Authentication enabled
- OpenRouter API key
- Stripe test secret key
- Judge0 CE RapidAPI key

## Environment setup

Copy the example files and replace placeholders with your own values. Do not
commit `.env` files or share server secrets.

### Client (`client/.env`)

Create `client/.env` from [`client/.env.example`](./.env.example):

```env
VITE_API_URL=http://localhost:8000
VITE_FIREBASE_APIKEY=your_firebase_web_api_key
```

The remaining Firebase settings are configured in
[`client/src/utils/firebase.js`](./src/utils/firebase.js). They must belong to
the same Firebase Web app as `VITE_FIREBASE_APIKEY`. Enable Google in Firebase
Authentication sign-in providers and add local/deployed hosts to Authorized
domains.

### Server (`server/.env`)

Create `server/.env` from [`server/.env.example`](../server/.env.example):

```env
PORT=8000
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET_KEY=replace_with_a_long_random_secret
OPENROUTER_API_KEY=replace_with_your_openrouter_key
STRIPE_SECRET_KEY=sk_test_replace_me
CLIENT_URL=http://localhost:5173
JUDGE0_API_KEY=replace_with_rapidapi_key
```

Notes:

- `CLIENT_URL` accepts a comma-separated list of allowed origins.
- `VITE_API_URL` should be the API base URL with no trailing slash.
- Render provides `PORT` automatically in production.

## Run locally

Run the API and client in separate terminals from the repository root.

```powershell
cd server
npm install
npm run dev
```

```powershell
cd client
npm install
npm run dev
```

Default local URLs:

- Client: `http://localhost:5173`
- API: `http://localhost:8000`
- Health check: `http://localhost:8000/api/health`

## Deployment

### Render API

1. Create a Render Blueprint from this repository using
   [`render.yaml`](../render.yaml). It configures `server/` as the root
   directory, runs `npm ci`, starts with `npm start`, and checks `/api/health`.
2. Set required Render environment variables: `MONGODB_URL`, `JWT_SECRET_KEY`,
   `OPENROUTER_API_KEY`, `STRIPE_SECRET_KEY`, `JUDGE0_API_KEY`, and
   `CLIENT_URL`.
3. Set `CLIENT_URL` to the exact Vercel origin, e.g.
   `https://your-app.vercel.app` (no trailing slash). Add preview origins as
   comma-separated values only if those previews need API access.

The server connects to MongoDB before listening, so invalid database
configuration fails deployment instead of serving an unusable API.

### Vercel client

1. Import the repository in Vercel and set **Root Directory** to `client`. The
   included [`vercel.json`](./vercel.json) configures the Vite build and SPA
   route fallback.
2. Add Vercel environment variables:
   - `VITE_API_URL`: Render API origin, e.g. `https://your-api.onrender.com`
   - `VITE_FIREBASE_APIKEY`: Firebase Web API key
3. Deploy, then add the Vercel domain to Firebase Authentication authorized
   domains and include that same origin in Render `CLIENT_URL`.

The API uses credentialed CORS and secure cross-site cookies in production. For
more reliable browser cookie behavior, prefer custom domains under the same
registrable domain (for example, `app.example.com` and `api.example.com`).

## DSA coding round

1. Sign in and open **Start Interview**.
2. Select **DSA Coding Round**.
3. Choose C++, Python, Java, JavaScript, or Kotlin.
4. Write a solution for the Two Sum problem and click **Run tests**.

Candidate code is sent to the hosted Judge0 sandbox when tests are run. Do not
include passwords, tokens, or other secrets in submitted code. The current DSA
flow includes one starter problem and does not yet save coding-round reports to
interview history.

## Stripe test payments

Use a Stripe test secret key (`sk_test_...`) in `STRIPE_SECRET_KEY`. Stripe
Checkout is created on the server; no Stripe secret is exposed to the client.
The current flow verifies payment after returning from Checkout; configure
webhook fulfillment before production use.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Home |
| `/interview` | Interview setup and interview flow |
| `/history` | Past interviews |
| `/pricing` | Credit plans and Stripe Checkout |
| `/upcoming` | Planned platform features |
| `/report/:id` | Interview report |

## API overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/google` | Google/Firebase authentication |
| `GET` | `/api/auth/logout` | Log out current user |
| `GET` | `/api/user/current-user` | Fetch authenticated user |
| `POST` | `/api/interview/resume` | Analyze uploaded resume |
| `POST` | `/api/interview/generate-questions` | Generate interview questions |
| `POST` | `/api/interview/submit-answer` | Submit interview answer |
| `POST` | `/api/interview/finish` | Finish interview and generate report |
| `POST` | `/api/interview/abandon` | Mark interview as abandoned |
| `GET` | `/api/interview/get-interview` | List interview history |
| `DELETE` | `/api/interview/:id` | Delete interview |
| `GET` | `/api/interview/report/:id` | Fetch interview report |
| `POST` | `/api/payment/order` | Create Stripe Checkout order |
| `POST` | `/api/payment/verify` | Verify Stripe payment |
| `POST` | `/api/code/run` | Run DSA code against Judge0 tests |

## Useful commands

From `client/`:

```powershell
npm run build
npm run lint
```

From `server/`:

```powershell
npm run dev
npm start
```
