const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// Helper: Read data
function getData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading data:', err);
    return null;
  }
}

// Helper: Write data
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Error saving data:', err);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
//  API ROUTES
// ═══════════════════════════════════════════════════════════

// Get all data
app.get('/api/data', (req, res) => {
  const data = getData();
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to load data' });
  }
});

// ─────────────────────────────────────────────────────────────
// SITE INFO
// ─────────────────────────────────────────────────────────────

app.get('/api/site', (req, res) => {
  const data = getData();
  res.json(data.site);
});

app.put('/api/site', (req, res) => {
  const data = getData();
  data.site = { ...data.site, ...req.body };
  if (saveData(data)) {
    res.json({ success: true, site: data.site });
  } else {
    res.status(500).json({ error: 'Failed to save' });
  }
});

// ─────────────────────────────────────────────────────────────
// SOCIALS
// ─────────────────────────────────────────────────────────────

app.get('/api/socials', (req, res) => {
  const data = getData();
  res.json(data.socials);
});

app.put('/api/socials', (req, res) => {
  const data = getData();
  data.socials = { ...data.socials, ...req.body };
  if (saveData(data)) {
    res.json({ success: true, socials: data.socials });
  } else {
    res.status(500).json({ error: 'Failed to save' });
  }
});

// ─────────────────────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────────────────────

app.get('/api/events', (req, res) => {
  const data = getData();
  res.json(data.events);
});

app.post('/api/events', (req, res) => {
  const data = getData();
  const newEvent = {
    id: Date.now(),
    date: req.body.date || '',
    venue: req.body.venue || '',
    city: req.body.city || '',
    tags: req.body.tags || [],
    rsvpLink: req.body.rsvpLink || '',
    isPrivate: req.body.isPrivate || false
  };
  data.events.push(newEvent);
  if (saveData(data)) {
    res.json({ success: true, event: newEvent });
  } else {
    res.status(500).json({ error: 'Failed to save' });
  }
});

app.put('/api/events/:id', (req, res) => {
  const data = getData();
  const id = parseInt(req.params.id);
  const index = data.events.findIndex(e => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }
  data.events[index] = { ...data.events[index], ...req.body };
  if (saveData(data)) {
    res.json({ success: true, event: data.events[index] });
  } else {
    res.status(500).json({ error: 'Failed to save' });
  }
});

app.delete('/api/events/:id', (req, res) => {
  const data = getData();
  const id = parseInt(req.params.id);
  data.events = data.events.filter(e => e.id !== id);
  if (saveData(data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to save' });
  }
});

// ─────────────────────────────────────────────────────────────
// MIXES
// ─────────────────────────────────────────────────────────────

app.get('/api/mixes', (req, res) => {
  const data = getData();
  res.json(data.mixes);
});

app.post('/api/mixes', (req, res) => {
  const data = getData();
  const newMix = {
    id: Date.now(),
    title: req.body.title || '',
    tags: req.body.tags || [],
    duration: req.body.duration || '',
    embedUrl: req.body.embedUrl || '',
    isFeatured: req.body.isFeatured || false
  };
  data.mixes.push(newMix);
  if (saveData(data)) {
    res.json({ success: true, mix: newMix });
  } else {
    res.status(500).json({ error: 'Failed to save' });
  }
});

app.put('/api/mixes/:id', (req, res) => {
  const data = getData();
  const id = parseInt(req.params.id);
  const index = data.mixes.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Mix not found' });
  }
  data.mixes[index] = { ...data.mixes[index], ...req.body };
  if (saveData(data)) {
    res.json({ success: true, mix: data.mixes[index] });
  } else {
    res.status(500).json({ error: 'Failed to save' });
  }
});

app.delete('/api/mixes/:id', (req, res) => {
  const data = getData();
  const id = parseInt(req.params.id);
  data.mixes = data.mixes.filter(m => m.id !== id);
  if (saveData(data)) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to save' });
  }
});

// ─────────────────────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────────────────────

app.get('/api/services', (req, res) => {
  const data = getData();
  res.json(data.services);
});

app.put('/api/services/:id', (req, res) => {
  const data = getData();
  const id = parseInt(req.params.id);
  const index = data.services.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Service not found' });
  }
  data.services[index] = { ...data.services[index], ...req.body };
  if (saveData(data)) {
    res.json({ success: true, service: data.services[index] });
  } else {
    res.status(500).json({ error: 'Failed to save' });
  }
});

// ═══════════════════════════════════════════════════════════
//  ADMIN PANEL ROUTE
// ═══════════════════════════════════════════════════════════

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// ═══════════════════════════════════════════════════════════
//  START SERVER
// ═══════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                     DJ MARIO WEBSITE                       ║
╠═══════════════════════════════════════════════════════════╣
║  🌐 Website:  http://localhost:${PORT}                       ║
║  ⚙️  Admin:    http://localhost:${PORT}/admin                 ║
║  📡 API:      http://localhost:${PORT}/api/data               ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
