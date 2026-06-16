const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/zones
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM zones ORDER BY created_at DESC');
    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (err) {
    console.error('Failed to get zones from DB, returning empty list:', err);
    res.json({
      status: 'success',
      data: []
    });
  }
});

// POST /api/zones (Save newly drawn zone)
router.post('/', async (req, res) => {
  const {
    name,
    code,
    country,
    state,
    city,
    locality,
    type,
    priority,
    status,
    timezone,
    description,
    start_date,
    end_date,
    max_vehicles,
    notes,
    map_link,
    points
  } = req.body;

  try {
    const result = await db.query(`
      INSERT INTO zones (name, code, country, state, city, locality, type, priority, status, timezone, description, start_date, end_date, max_vehicles, notes, map_link, points)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [name, code, country, state, city, locality, type, priority, status || 'active', timezone, description, start_date, end_date, max_vehicles || 0, notes, map_link, JSON.stringify(points)]);

    res.json({
      status: 'success',
      message: 'Zone added successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Failed to insert zone into DB:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

module.exports = router;
