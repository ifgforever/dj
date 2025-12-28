# DJ MARIO Website

A high-energy DJ website with an admin backend for easy content management.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

### 3. Open in Browser
- **Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin

---

## 📁 File Structure

```
dj-site/
├── index.html          # Homepage
├── mixes.html          # Mixes page
├── events.html         # Events page
├── booking.html        # Booking/contact page
├── admin.html          # Admin panel
├── server.js           # Node.js/Express backend
├── data.json           # All your content (auto-saved)
├── package.json        # Dependencies
└── assets/
    ├── style.css       # All styles
    └── app.js          # Visual effects & interactions
```

---

## ⚙️ Admin Panel Features

### Site Info
- DJ name, tagline, location
- Hero section text
- Biography

### Events
- Add/edit/delete events
- Set date, venue, city
- Add tags (e.g., "House Night", "10PM - 2AM")
- Mark as private/invite-only
- Add RSVP links

### Mixes
- Add/edit/delete mixes
- Set title, duration, tags
- Add embed URLs (SoundCloud, Mixcloud, etc.)
- Mark as featured

### Social Links
- Instagram, SoundCloud, Mixcloud
- YouTube, Spotify

### Services
- Edit what you offer
- Custom icons and descriptions

---

## 🌐 Deploying

### Option 1: Railway / Render / Heroku
1. Push to GitHub
2. Connect to Railway/Render/Heroku
3. It will auto-detect Node.js and run `npm start`

### Option 2: VPS (DigitalOcean, etc.)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone your repo
git clone <your-repo>
cd dj-site

# Install & run
npm install
npm start

# For production, use PM2:
npm install -g pm2
pm2 start server.js --name "dj-mario"
```

### Option 3: Static Export (No Backend)
If you just want static files without the admin:
1. Edit `data.json` manually
2. Host on Netlify/Vercel/GitHub Pages
3. The frontend will work, but admin panel won't save

---

## 🔐 Adding Password Protection

To protect the admin panel, add this to `server.js`:

```javascript
// Simple password protection
const ADMIN_PASSWORD = 'your-secret-password';

app.use('/admin', (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${ADMIN_PASSWORD}`) {
    // You'd implement proper auth here
  }
  next();
});
```

For production, consider using:
- **express-basic-auth** for simple password
- **Passport.js** for full authentication
- **Auth0** or **Firebase Auth** for OAuth

---

## 🎨 Customization

### Colors
Edit CSS variables in `assets/style.css`:
```css
:root {
  --accent: #ff6b35;      /* Main accent (orange) */
  --electric: #00f0ff;    /* Secondary (cyan) */
  --purple: #a855f7;      /* Tertiary (purple) */
}
```

### Fonts
The site uses:
- **Bebas Neue** — Headlines
- **Syne** — Body text
- **Space Mono** — Labels & UI

Change in the `@import` at the top of `style.css`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/data` | Get all data |
| GET | `/api/site` | Get site info |
| PUT | `/api/site` | Update site info |
| GET | `/api/events` | Get all events |
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |
| GET | `/api/mixes` | Get all mixes |
| POST | `/api/mixes` | Create mix |
| PUT | `/api/mixes/:id` | Update mix |
| DELETE | `/api/mixes/:id` | Delete mix |
| GET | `/api/socials` | Get social links |
| PUT | `/api/socials` | Update social links |

---

## 💡 Tips

1. **Backup `data.json`** regularly — it's your database
2. **Test locally** before deploying
3. **Add your real SoundCloud/Mixcloud embeds** in the admin
4. **Update the events** to show your actual gigs

---

Made with 🔥 for DJ Mario
