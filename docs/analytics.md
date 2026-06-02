# Analytics

There are two separate analytics systems in this project.

---

## 1. GA4 Event Tracking (frontend)

Tracks page views and user interactions across the site using Google Analytics 4.

### Setup

Add your GA4 Measurement ID to `.env`:

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Where to find it:** GA4 Admin → Data Streams → select your web stream → **Measurement ID** (starts with `G-`).

### How it works

The `@next/third-parties` package injects the GA4 script into every page via the root layout (`src/app/(frontend)/layout.tsx`). No code changes are needed — adding the env var is sufficient.

### Custom events

Custom event names are defined in `src/lib/ga-events.ts`. To add a new event, add its name as a constant there and call `window.gtag('event', ...)` from the relevant component.

---

## 2. GA4 Reporting API (internal dashboard)

Pulls live traffic data from the GA4 Data API and displays it at `/analytics`. This is for internal team use and requires a Google service account.

### Required environment variables

| Variable | Description |
|---|---|
| `GOOGLE_GA_PROPERTY_ID` | Numeric GA4 Property ID (not the Measurement ID) |
| `GOOGLE_SA_CREDENTIALS` | Full service account JSON, stringified to a single line |

**Where to find the Property ID:** GA4 Admin → Property Settings → **Property ID** (a plain number like `123456789`, not `G-XXXXXXXX`).

### Service account setup (step by step)

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **IAM & Admin → Service Accounts**
2. Click **Create Service Account** — give it a name (e.g. `eprod-ga-reader`)
3. Skip role assignment on the Cloud Console side — permissions are granted in GA4 directly
4. Once created, click the service account → **Keys** tab → **Add Key → Create new key → JSON**
5. Download the JSON file (keep this secret — treat it like a password)
6. In GA4: **Admin → Property Access Management** → click **+** → add the service account email address with **Viewer** role
7. Stringify the JSON for use as an env var:
   ```bash
   # In your terminal (replace with your actual filename)
   node -e "console.log(JSON.stringify(require('./service-account.json')))"
   ```
8. Copy the output and set it as `GOOGLE_SA_CREDENTIALS` in your `.env` or Vercel dashboard

### Reporting implementation

The reporting logic lives in `src/lib/ga-reporting.ts`, which uses the `@google-analytics/data` package to query the GA4 Data API. The admin package (`@google-analytics/admin`) is also installed for property management queries.

### Security note

The `/analytics` route has no authentication at the application level. In production, restrict access at the infrastructure level:

- **Vercel:** use [Password Protection](https://vercel.com/docs/security/password-protection) or configure an allowlist via Vercel Firewall
- **Self-hosted:** add HTTP basic auth in your Nginx config for the `/analytics` path
