# InterviewIQ.AI

InterviewIQ.AI is a mock interview preparation platform built with React, Vite,
Express, MongoDB, Firebase Authentication, OpenRouter, Stripe, and Judge0.

## Features

- Google sign-in with Firebase Authentication.
- AI-generated technical and HR interview questions.
- Optional resume analysis to tailor interview practice.
- Voice-based interview flow with feedback and interview reports.
- Optional local candidate video recording with in-browser preview and download.
- Interview history with date, time, duration, and deletion controls.
- Interview duration is saved both when completed and when the candidate leaves early.
- DSA coding round with a side-by-side problem and code editor.
- C++, Python, Java, JavaScript, and Kotlin editor support.
- Judge0-backed test execution for the current Two Sum challenge.
- Stripe Checkout for Starter and Pro credit plans.
- An Upcoming page for planned platform features. These items are ideas, not
  features currently available.

## Upcoming platform features

These features are planned and are not available in the platform yet:

- Choose between 5 and 25 questions for an AI interview.
- Free peer-to-peer mock interviews with video calls.
- Debate Corner for student debates on guided topics.
- Pro subscription interviews with industry professionals, with interviewer
  selection and scheduling.
- A candidate learning roadmap with study plans and counselor support.
- Structured peer feedback after practice sessions.
- Smarter scheduling with time-zone coordination, reminders, and rescheduling.
- **Multi-panelist “Bar Raiser” mode:** Two AI personas—a friendly tech lead
  and a skeptical interviewer—use distinct voices to explore architecture,
  scale, security, and edge cases.
- **System Design whiteboard:** Draw systems such as a URL shortener and receive
  visual AI feedback on bottlenecks, caching, and data-storage choices.
- **Peer-to-peer Mock Arena with an AI referee:** Practice by video with another
  student while an AI co-pilot provides interviewer prompts, timekeeping, and
  post-session feedback for both participants.
- **Company-specific Placement Sprint:** A 7-day adaptive practice plan based
  on a target interview and areas to improve from past sessions.
- **Optional proctoring simulation:** Practice with transparent, opt-in checks
  for tab changes, clipboard actions, and multiple faces, with privacy controls.

## Requirements

- Node.js 22.13 or newer.
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
VITE_API_URL=http://localhost:8000
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

`CLIENT_URL` may contain a comma-separated list of allowed client origins. The
client calls `VITE_API_URL`; set it to the API's base URL without a trailing
slash. Render supplies `PORT` automatically in production.

## Deploy

### Render API

1. Create a Render Blueprint from this repository using the root
   [`render.yaml`](../render.yaml). It creates the web service with `server/`
   as its root directory, `npm ci` as its build command, and `npm start` as its
   start command.
2. Set the prompted secret/environment values in Render:
   `MONGODB_URL`, `JWT_SECRET_KEY`, `OPENROUTER_API_KEY`,
   `STRIPE_SECRET_KEY`, `JUDGE0_API_KEY`, and `CLIENT_URL`.
   Set `CLIENT_URL` to the Vercel site's exact origin, such as
   `https://your-app.vercel.app` (no path or trailing slash). Include any
   additional Vercel preview origins as comma-separated values if those
   previews need API access.
3. Wait for `/api/health` to pass. The server connects to MongoDB before it
   starts listening, so a missing or invalid database URL fails the deployment
   instead of leaving an apparently healthy but unusable service.

### Vercel client

1. Import the repository in Vercel and set the project **Root Directory** to
   `client`. The included [`vercel.json`](./vercel.json) configures the Vite
   build output and SPA route fallback.
2. Add these Vercel environment variables for Production (and Preview if used):
   - `VITE_API_URL`: the Render service origin, such as
     `https://your-api.onrender.com` (no trailing slash).
   - `VITE_FIREBASE_APIKEY`: the Firebase Web API key.
3. Deploy, then add the Vercel domain to Firebase Authentication's authorized
   domains. Configure Render's `CLIENT_URL` with that same origin.

The API uses credentialed CORS and secure cross-site cookies in production.
For more reliable browser cookie behavior, use custom domains for both
services under the same registrable domain (for example, `app.example.com`
and `api.example.com`).

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
