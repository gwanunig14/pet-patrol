# Pet Patrol

Pet Patrol is a small Expo app for pet-sitting bookings. It has two roles:

- Owner: log in, create bookings, and see your appointments
- Sitter: review upcoming bookings and manage them by date

The app uses a local JSON Server API for data, so it is meant to run on your machine.

## Quick Start

1. Install dependencies.

```bash
npm install
```

2. Make sure the app can talk to the local API.

Create a `.env` file in the project root if you do not already have one, and set:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3001
```

3. Start the API and the Expo app together.

```bash
npm run dev
```

4. Open the app in Expo Go, the simulator, or the browser.

If you prefer to run them separately:

```bash
npm run api
npm start
```

## Other Useful Commands

```bash
npm run ios
npm run android
npm run web
npm test
```

## Project Story

This started as a simple local scheduling app with a few intentional limits. The pet options, pricing, and the two users are hardcoded because this is not a production app, and that keeps the focus on the booking flow instead of account management.

The build happened in a rough sequence:

1. Build a simple login page with a text field and a button.
2. Set up a local API so login actually does something.
3. Build and navigate to the owner view, then fetch and submit bookings for the current user.
4. Fetch and display the user's bookings.
5. Build the owner schedule view and generate enough bookings to make it useful.
6. Clean up the Expo starter files that were not being used.
7. Simplify the code.
8. Make the login view presentable.
9. Improve the owner view.
10. Build the sitter view.
11. Finish the first pass.
12. Improve the scheduling view.
13. Add the tests I almost forgot.

## Notes

- The API data lives in `api/db.json`.
- The app expects `EXPO_PUBLIC_API_URL` to point at the local API server.
- The test files live in `src/__tests__/app/` so they do not conflict with Expo Router routes.
