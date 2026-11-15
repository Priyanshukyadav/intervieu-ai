# InterviewIQ.AI

InterviewIQ.AI is a mock interview preparation platform built with React, Vite,
Express, MongoDB, Firebase Authentication, OpenRouter, Stripe, and Judge0.

## Features

- Google sign-in with Firebase Authentication.
- AI-generated technical and HR interview questions.
- Optional resume analysis to tailor interview practice.
- Voice-based interview flow with feedback and interview reports.
- Optional local candidate video recording with in-browser preview and download.
- Interview history and downloadable report support.
- DSA coding round with a side-by-side problem and code editor.
- C++, Python, Java, JavaScript, and Kotlin editor support.
- Judge0-backed test execution for the current Two Sum challenge.
- Stripe Checkout for Starter and Pro credit plans.
- An Upcoming page for planned platform features. These items are ideas, not
  features currently available.

## Requirements

- Node.js 20 or newer.
- npm.
- A MongoDB database.
- Firebase project with Google Authentication enabled.
- An OpenRouter API key for AI interview features.
- A Stripe account and test secret key for test payments.
- A Judge0 CE RapidAPI key for running DSA code.

## Environment setup

Copy the example files and replace each placeholder with your own configuration.
Do not commit `.env` files or share server secrets.

### Client

Create `client/.env` from `client/.env.example`:

```env
VITE_FIREBASE_APIKEY=your_firebase_web_api_key
```

The other Firebase settings are in `client/src/utils/firebase.js`. They must
belong to the same Firebase Web app as the API key. Enable Google under Firebase
Authentication sign-in providers and add your local/deployed host to Authorized
domains.

### Server

Create `server/.env` from `server/.env.example` and fill in:

```env
PORT=8000
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>/<database>
JWT_SECRET_KEY=replace_with_a_long_random_secret
OPENROUTER_API_KEY=replace_with_your_openrouter_key
STRIPE_SECRET_KEY=sk_test_replace_me
CLIENT_URL=http://localhost:5173
JUDGE0_API_KEY=replace_with_rapidapi_key
```

The client currently calls the API at `http://localhost:8000`, so keep the
server port at `8000` for local development unless you also update
`client/src/App.jsx`.

Candidate video recording uses the browser's camera and microphone APIs. It
does not upload videos or require a recording API key. Recordings remain in
browser memory for the current session, so candidates should download them
before leaving or refreshing the page. Camera and microphone access requires
permission and HTTPS in production.

#### DSA code runner

Subscribe to Judge0 CE through RapidAPI and copy the RapidAPI key into
`JUDGE0_API_KEY`. The key stays on the server. Candidate source code is sent to
the hosted Judge0 sandbox when Run tests is clicked; do not put passwords,
tokens, or other secrets in submitted code. The run endpoint is authenticated,
limits code size and execution resources, and rate-limits submissions.

#### Stripe test payments

Use a Stripe test secret key (`sk_test_...`) in `STRIPE_SECRET_KEY`. Stripe
Checkout is created by the server, so no Stripe key is needed in the client
environment. The Starter plan is INR 100 for 150 credits and the Pro plan is
INR 500 for 650 credits. The current flow verifies payment after the user
returns from Checkout; configure webhook fulfillment before production use.

## Run locally

Install dependencies and run the server and client in separate terminals:

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

Vite serves the client at `http://localhost:5173`; the API uses
`http://localhost:8000` by default when configured as above.

## Use the DSA coding round

1. Sign in and open **Start Interview**.
2. Select **DSA Coding Round** and start.
3. Choose C++, Python, Java, JavaScript, or Kotlin.
4. Write a solution for the Two Sum problem and click **Run tests**.

The test inputs are kept on the server. The current DSA flow contains one
starter problem and does not yet save coding-round reports to interview history.

## Main routes

- `/` - Home
- `/interview` - Interview setup and interview flow
- `/history` - Past interviews
- `/pricing` - Credit plans and Stripe Checkout
- `/upcoming` - Planned platform features
- `/report/:id` - Interview report

## Useful commands

Run these from `client/`:

```powershell
npm run build
npm run lint
```
