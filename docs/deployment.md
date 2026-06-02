# Deployment

---

## Vercel (primary)

This is the production deployment target. The app is built and served by Vercel, with Neon as the PostgreSQL provider and Vercel Blob for media storage.

### Environment variables

Set all of the following in the Vercel dashboard under **Settings → Environment Variables**:

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Neon connection string — SSL is pre-configured |
| `PAYLOAD_SECRET` | Yes | Any long random string; use `openssl rand -hex 32` |
| `BLOB_READ_WRITE_TOKEN` | Yes | From Vercel Blob store (see below) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Production domain, no trailing slash (e.g. `https://www.eprod-solutions.com`) |
| `SMTP_HOST` | No | Required for contact form emails and CTA emails |
| `SMTP_PORT` | No | Defaults to `587` |
| `SMTP_USER` | No | SMTP auth username |
| `SMTP_PASS` | No | SMTP auth password |
| `SMTP_FROM` | No | From address (defaults to `noreply@eprod.io`) |
| `NEXT_PUBLIC_GA_ID` | No | GA4 Measurement ID for frontend tracking |
| `GOOGLE_GA_PROPERTY_ID` | No | GA4 Property ID for the `/analytics` dashboard |
| `GOOGLE_SA_CREDENTIALS` | No | Stringified service account JSON for the reporting API |

### Vercel Blob Storage setup

1. Go to your Vercel project → **Storage** tab
2. Click **Create Database** → select **Blob**
3. Name it (e.g. `eprod-media`) and create
4. Go to the Blob store's **Settings** → copy the `BLOB_READ_WRITE_TOKEN`
5. Add it to your project's environment variables

### Build and deploy

The build command is `pnpm run build`, which does two things in sequence:

```bash
payload migrate   # runs any pending database migrations
next build        # compiles the Next.js app
```

Migrations run automatically on every deploy — no manual step needed. Ensure `DATABASE_URL` is set before the first deploy.

The admin panel is available at `https://your-domain.com/admin` after the first deploy. Create your first admin user on that page.

---

## Docker (local / staging)

The provided `docker-compose.yml` spins up a PostgreSQL database only. The Next.js app still runs via Node on your machine.

### Steps

1. Copy and fill in `.env`:
   ```bash
   cp .env.example .env
   ```

2. Set the database URL to point at the Docker container:
   ```
   DATABASE_URL=postgresql://postgres:postgres@127.0.0.1/eprod
   ```

3. Start the database:
   ```bash
   docker-compose up -d
   ```

4. Install dependencies and start the dev server:
   ```bash
   pnpm install
   pnpm dev
   ```

5. Open `http://localhost:3000`

### Notes

- Vercel Blob Storage is not available in local development unless you provide a `BLOB_READ_WRITE_TOKEN`. Without it, the plugin disables itself gracefully — media uploads will fail but the rest of the app works fine.
- To stop the database: `docker-compose down`
- To wipe the database volume: `docker-compose down -v`

---

## Self-hosted (raw server)

For running the app on a VPS, dedicated server, or any non-Vercel environment.

### Requirements

- Node.js `^18.20.2 || >=20.9.0`
- pnpm `^9 || ^10`
- PostgreSQL database (Neon, Supabase, Railway, or self-hosted)

### Install and build

```bash
# Install dependencies
pnpm install

# Build (runs migrations then next build)
pnpm run build
```

Ensure all required environment variables are set before running the build (see the Vercel table above — same variables apply). `DATABASE_URL` and `PAYLOAD_SECRET` are the minimum required to build.

### Start the app

```bash
pnpm start
```

This runs `next start` on port 3000.

### Process management with PM2

Install PM2 globally and use it to keep the app running:

```bash
npm install -g pm2

# Start
pm2 start "pnpm start" --name eprod

# Auto-restart on server reboot
pm2 save
pm2 startup
```

### Nginx reverse proxy

Put this in your Nginx site config to forward traffic from port 80/443 to the app:

```nginx
server {
    listen 80;
    server_name www.eprod-solutions.com eprod-solutions.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Use [Certbot](https://certbot.eff.org/) to add SSL:

```bash
sudo certbot --nginx -d www.eprod-solutions.com -d eprod-solutions.com
```
