require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/stats', require('./routes/stats'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/today-summary', require('./routes/todaySummary'));
app.use('/api/knowledge', require('./routes/knowledge'));
app.use('/api/batteries', require('./routes/batteries'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/renters', require('./routes/renters'));
app.use('/api/zones', require('./routes/zones'));
app.use('/api/reservations', require('./routes/reservations'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Evegah Backend running on http://localhost:${PORT}`);
});
