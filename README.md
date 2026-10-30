# Rotaract Club of Butwal Synergy — Website

```
rotaract-butwal-synergy/
├── backend/    → API (Node.js + Express + MongoDB + Cloudinary)
└── frontend/   → Website + Admin panel (Next.js)
```

- **backend** stores all data in MongoDB, uploads images to Cloudinary, and handles admin login.
- **frontend** is the website people visit, plus the admin panel at **`/adminlogin`**.
  It gets all its content from the backend.

---

## PART A — What you need (all free)

1. **GitHub** account — <https://github.com>
2. **MongoDB Atlas** account (database) — <https://www.mongodb.com/cloud/atlas>
3. **Cloudinary** account (images) — <https://cloudinary.com>
4. **Vercel** account (hosting) — <https://vercel.com> (sign up with GitHub)
5. **Node.js 20 or newer** on your computer (only needed to run it locally) — <https://nodejs.org>

---

## PART B — Get your keys

### 1. MongoDB connection string
1. In Atlas, create a **free (M0) cluster**.
2. **Database Access** → *Add New Database User* → choose a username and strong password.
3. **Network Access** → *Add IP Address* → **Allow access from anywhere** (`0.0.0.0/0`).
4. **Database → Connect → Drivers** → copy the string. Put your password in it and add the
   database name before the `?`:
   ```
   mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/rotaract-butwal-synergy?retryWrites=true&w=majority
   ```

### 2. Cloudinary keys
Cloudinary dashboard → **Settings → API Keys** → copy **Cloud name**, **API Key**, **API Secret**.

### 3. Two secret passwords
Run this command **twice** on your computer and save both results:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```
- First result → **JWT_SECRET** (backend only)
- Second result → **INTERNAL_SECRET** (same value in backend AND frontend)

> No Node.js yet? Any long random text of 40+ letters and numbers also works.

---

## PART C — Put the code on GitHub

1. Create a new **private** repository on GitHub (e.g. `rotaract-butwal-synergy`).
2. Upload the whole folder (both `backend` and `frontend`) to it.
   *(On github.com: “uploading an existing file” → drag the folders in → Commit.)*

---

## PART D — Deploy the BACKEND on Vercel

1. Vercel → **Add New… → Project** → import your repository.
2. **Root Directory** → click *Edit* → choose **`backend`**.
3. Framework preset: **Other**.
4. Open **Environment Variables** and add:

| Name | Value |
|---|---|
| `MONGODB_URI` | your MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | from Cloudinary |
| `CLOUDINARY_API_KEY` | from Cloudinary |
| `CLOUDINARY_API_SECRET` | from Cloudinary |
| `JWT_SECRET` | first secret |
| `INTERNAL_SECRET` | second secret |
| `ADMIN_EMAIL` | the email you will log in with |
| `ADMIN_PASSWORD` | a first password (min 8 characters — you will change it later) |
| `FRONTEND_URL` | leave as `http://localhost:3000` for now (you will change it in Part F) |

5. Click **Deploy**. When done, copy the address, e.g. `https://rotaract-backend.vercel.app`.
6. Test it: open `https://rotaract-backend.vercel.app/api/health` → you should see `{"ok":true}`.

---

## PART E — Deploy the FRONTEND on Vercel

1. Vercel → **Add New… → Project** → import the **same** repository again.
2. **Root Directory** → choose **`frontend`**. Framework preset: **Next.js**.
3. **Environment Variables**:

| Name | Value |
|---|---|
| `BACKEND_URL` | your backend address from Part D (no `/` at the end) |
| `INTERNAL_SECRET` | the **same** second secret as in the backend |
| `NEXT_PUBLIC_SITE_URL` | your website address, e.g. `https://rotract-synergy.vercel.app` |

4. Click **Deploy** and copy the website address.

---

## PART F — Connect them

1. Go to the **backend** project on Vercel → **Settings → Environment Variables**.
2. Change `FRONTEND_URL` to your website address (e.g. `https://rotract-synergy.vercel.app`).
   If you use more than one address (e.g. your own domain too), separate them with commas.
3. **Deployments → ⋯ → Redeploy** the backend.

---

## PART G — First login

1. Open `https://YOUR-WEBSITE/adminlogin`.
2. Log in with `ADMIN_EMAIL` and `ADMIN_PASSWORD` (the admin account is created now).
3. Go to **Account & password** → **change the password**.
   After that you can delete `ADMIN_PASSWORD` from the backend settings on Vercel.
4. On the **Dashboard**, click **Copy to Cloudinary** — this moves the starter images from the
   old website into your own Cloudinary.
5. Fill in **Site settings → Contact & social media**, add your **Team**, **Events** and **Gallery** photos.

✅ Done! Every change you save in the admin panel appears on the website straight away.

**For Google:** add your site in Google Search Console and submit `https://YOUR-WEBSITE/sitemap.xml`.

---

## Run it on your computer (optional)

Open **two** terminals.

**Terminal 1 — backend**
```bash
cd backend
npm install
cp .env.example .env        # then open .env and fill in the values
npm run dev                 # runs on https://rotaract-club-rwb4.onrender.com
```

**Terminal 2 — frontend**
```bash
cd frontend
npm install
cp .env.example .env.local  # BACKEND_URL=https://rotaract-club-rwb4.onrender.com, same INTERNAL_SECRET
npm run dev                 # open http://localhost:3000
```
For local use, set `FRONTEND_URL=http://localhost:3000` in `backend/.env`.

---

## Forgot the admin password?

On your computer, inside the `backend` folder (with `MONGODB_URI` in `.env`):
```bash
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='New-Strong-Pass-123' npm run reset-admin
```
On Windows PowerShell:
```powershell
$env:ADMIN_EMAIL="you@example.com"; $env:ADMIN_PASSWORD="New-Strong-Pass-123"; npm run reset-admin
```

---

## Common problems

| Problem | Fix |
|---|---|
| Website shows only starter content / changes don’t appear | Check `BACKEND_URL` in the frontend and that `INTERNAL_SECRET` is **exactly the same** in both projects. |
| “Request blocked” when logging in or saving | `FRONTEND_URL` in the backend must match your website address exactly (https, no `/` at the end). Redeploy the backend after changing it. |
| “Database is not connected” | Check `MONGODB_URI`, and that Atlas **Network Access** allows `0.0.0.0/0`. |
| “Cloudinary is not set up” | Add the three `CLOUDINARY_*` values to the **backend** and redeploy. |
| “Too many attempts” at login | Wait 15 minutes (this protects against password guessing). |

---

## Where things are in the code

```
backend/
  src/app.js                 Express app (security, routes)
  src/routes/public.js       website data + contact form
  src/routes/auth.js         admin login / logout
  src/routes/admin.js        everything the admin panel can change
  src/models/index.js        MongoDB models
  src/data/defaults.js       starting content (used on first run)
  src/data/fields.js         admin form fields — add a field here to make it editable
  src/utils/validation.js    checks all data before saving
frontend/
  src/app/(site)/            website pages
  src/app/admin/             admin panel pages
  src/app/adminlogin/        login page
  src/app/api/[...path]/     passes /api requests to the backend
  src/components/            design components
  src/lib/data.ts            loads content from the backend
```

## Security (built in)

Hashed passwords (bcrypt) · secure httpOnly login cookie · login lock-out after wrong attempts ·
changing the password signs out other devices · requests from other websites blocked ·
all data checked on the server · only real image files can be uploaded · contact-form spam
protection and rate limit · security headers (CSP, HSTS…) · admin pages hidden from Google.
