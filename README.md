# FF MTG Tracker

A cross-device collection tracker for the Magic: The Gathering × Final Fantasy sets
(FIN main set + FIC Commander). Your owned/quantity data is stored in a shared cloud
database so every device sees the same collection.

## How it works

- `public/index.html` — the app. Loads instantly from a local cache, then syncs with the server.
- `api/collection.js` — a Vercel serverless function. `GET` loads the collection, `POST` saves it.
- Data lives in **Upstash Redis** (added via the Vercel Marketplace) under one key, `ff:collection`.

## Deploy (one-time)

1. Push this folder to a new GitHub repository.
2. At https://vercel.com → **Add New Project** → import the repo → **Deploy**.
3. In the project, open the **Storage** tab → **Marketplace** → add a **Redis (Upstash)** store
   and connect it to this project. Vercel injects the credentials as environment variables
   automatically — no keys to copy.
4. **Redeploy** so the function picks up those credentials.

Open the deployed URL on any device; they all share one collection.

> Note: the local cache is offline-safe, but the server is the source of truth on page load.
> Edits made while offline are kept locally and pushed on the next save while online; if the
> page is reloaded online before that push happens, the server copy wins.
