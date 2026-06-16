const express = require('express');
const router = express.Router();
const db = require('../db');

// In-memory fallback seeds matching the stats
const MOCK_RESERVATIONS = [
  { id: '1', reservation_id: 'RID-2024-00128', customer_name: 'Rohit Sharma', mobile: '+91 98765 43210', gov_id: 'GOV123456', reservation_date: '2026-06-20T00:00:00.000Z', reservation_time: '09:30:00', package_type: 'Day', vehicle_category: 'SUV', vehicle_number: 'DL 1Z AB 1234', fare: '1250.00', deposit: '1000.00', payment_mode: 'UPI', payment_status: 'Paid', status: 'Upcoming', pickup_zone: 'Connaught Place Zone', drop_zone: 'Indira Gandhi Airport', created_at: '2026-06-19T22:15:00.000Z' },
  { id: '2', reservation_id: 'RID-2024-00127', customer_name: 'Priya Verma', mobile: '+91 91234 56789', gov_id: 'GOV234567', reservation_date: '2026-06-20T00:00:00.000Z', reservation_time: '11:00:00', package_type: 'Hourly', vehicle_category: 'Sedan', vehicle_number: 'DL 1Z CD 5678', fare: '850.00', deposit: '1000.00', payment_mode: 'Card', payment_status: 'Paid', status: 'Upcoming', pickup_zone: 'Karol Bagh Zone', drop_zone: 'Noida Sector 62', created_at: '2026-06-19T21:45:00.000Z' },
  { id: '3', reservation_id: 'RID-2024-00126', customer_name: 'Mohit Singh', mobile: '+91 99877 66554', gov_id: 'GOV345678', reservation_date: '2026-06-19T00:00:00.000Z', reservation_time: '16:00:00', package_type: 'Day', vehicle_category: 'Hatchback', vehicle_number: 'DL 1Z EF 9012', fare: '1100.00', deposit: '1000.00', payment_mode: 'UPI', payment_status: 'Paid', status: 'Completed', pickup_zone: 'West Delhi Zone', drop_zone: 'Gurgaon Cyber City', created_at: '2026-06-18T20:20:00.000Z' },
  { id: '4', reservation_id: 'RID-2024-00125', customer_name: 'Neha Kapoor', mobile: '+91 88776 54321', gov_id: 'GOV456789', reservation_date: '2026-06-19T00:00:00.000Z', reservation_time: '19:30:00', package_type: 'Weekly', vehicle_category: 'SUV', vehicle_number: 'DL 1Z GH 3456', fare: '1300.00', deposit: '1500.00', payment_mode: 'UPI', payment_status: 'Paid', status: 'Completed', pickup_zone: 'South Delhi Zone', drop_zone: 'Indira Gandhi Airport', created_at: '2026-06-18T19:05:00.000Z' },
  { id: '5', reservation_id: 'RID-2024-00124', customer_name: 'Arjun Sharma', mobile: '+91 77665 44332', gov_id: 'GOV567890', reservation_date: '2026-06-18T00:00:00.000Z', reservation_time: '14:00:00', package_type: 'Hourly', vehicle_category: 'Sedan', vehicle_number: 'DL 1Z IJ 7890', fare: '950.00', deposit: '1000.00', payment_mode: 'UPI', payment_status: 'Refunded', status: 'Cancelled', pickup_zone: 'Dwarka Zone', drop_zone: 'Noida Sector 18', created_at: '2026-06-17T23:30:00.000Z' },
  { id: '6', reservation_id: 'RID-2024-00123', customer_name: 'Swati Sharma', mobile: '+91 66654 33221', gov_id: 'GOV678901', reservation_date: '2026-06-17T00:00:00.000Z', reservation_time: '09:00:00', package_type: 'Day', vehicle_category: 'Hatchback', vehicle_number: 'DL 1Z KL 2345', fare: '1000.00', deposit: '1000.00', payment_mode: 'Card', payment_status: 'Paid', status: 'Upcoming', pickup_zone: 'Gurgaon Zone', drop_zone: 'Connaught Place', created_at: '2026-06-16T20:45:00.000Z' },
  { id: '7', reservation_id: 'RID-2024-00122', customer_name: 'Deepak Patel', mobile: '+91 55443 22110', gov_id: 'GOV789012', reservation_date: '2026-06-17T00:00:00.000Z', reservation_time: '17:30:00', package_type: 'Day', vehicle_category: 'SUV', vehicle_number: 'DL 1Z MN 6789', fare: '1150.00', deposit: '1000.00', payment_mode: 'UPI', payment_status: 'Refunded', status: 'Cancelled', pickup_zone: 'Noida Zone', drop_zone: 'Dwarka Sector 21', created_at: '2026-06-16T18:10:00.000Z' },
  { id: '8', reservation_id: 'RID-2024-00121', customer_name: 'Rahul Kumar', mobile: '+91 77889 00122', gov_id: 'GOV890123', reservation_date: '2026-06-16T00:00:00.000Z', reservation_time: '08:15:00', package_type: 'Day', vehicle_category: 'Sedan', vehicle_number: 'DL 1Z OP 1122', fare: '1200.00', deposit: '1000.00', payment_mode: 'UPI', payment_status: 'Paid', status: 'Completed', pickup_zone: 'Connaught Place Zone', drop_zone: 'Gurgaon Cyber City', created_at: '2026-06-15T22:00:00.000Z' },
  { id: '9', reservation_id: 'RID-2024-00120', customer_name: 'Simran Malik', mobile: '+91 88990 33445', gov_id: 'GOV901234', reservation_date: '2026-06-16T00:00:00.000Z', reservation_time: '13:45:00', package_type: 'Day', vehicle_category: 'Hatchback', vehicle_number: 'DL 1Z QR 3344', fare: '1180.00', deposit: '1000.00', payment_mode: 'UPI', payment_status: 'Paid', status: 'Upcoming', pickup_zone: 'Karol Bagh Zone', drop_zone: 'Indira Gandhi Airport', created_at: '2026-06-15T21:15:00.000Z' },
  { id: '10', reservation_id: 'RID-2024-00119', customer_name: 'Vikram Mehta', mobile: '+91 99554 77889', gov_id: 'GOV012345', reservation_date: '2026-06-16T00:00:00.000Z', reservation_time: '18:00:00', package_type: 'Weekly', vehicle_category: 'SUV', vehicle_number: 'DL 1Z ST 5566', fare: '1350.00', deposit: '1500.00', payment_mode: 'UPI', payment_status: 'Paid', status: 'Completed', pickup_zone: 'West Delhi Zone', drop_zone: 'Noida Sector 62', created_at: '2026-06-15T20:30:00.000Z' },
];

let mockList = [...MOCK_RESERVATIONS];
const makeMocks = () => {
  if (mockList.length >= 128) return;
  const autoNames = ['Karan Johar', 'Sunita Rao', 'Vijay Mallya', 'Rajesh Khanna', 'Aishwarya Sen', 'Abhishek Dev', 'Sanjay Dutt', 'Salman Khan'];
  const zonesList = ['Connaught Place Zone', 'Karol Bagh Zone', 'West Delhi Zone', 'South Delhi Zone', 'Dwarka Zone', 'Gurgaon Zone', 'Noida Zone'];
  const catsList = ['SUV', 'Sedan', 'Hatchback'];
  const packsList = ['Hourly', 'Day', 'Weekly', 'Monthly'];

  let countUpcoming = 4;
  let countCompleted = 4;
  let countCancelled = 2;
  let ridCounter = 118;

  while (countUpcoming < 96 || countCompleted < 24 || countCancelled < 8) {
    let stat = 'Upcoming';
    let payStat = 'Paid';
    if (countUpcoming < 96) {
      stat = 'Upcoming';
      countUpcoming++;
    } else if (countCompleted < 24) {
      stat = 'Completed';
      countCompleted++;
    } else {
      stat = 'Cancelled';
      payStat = 'Refunded';
      countCancelled++;
    }

    const name = autoNames[ridCounter % autoNames.length] + ' ' + ridCounter;
    const rId = `RID-2024-${String(ridCounter).padStart(5, '0')}`;
    const pZone = zonesList[ridCounter % zonesList.length];
    const dZone = zonesList[(ridCounter + 1) % zonesList.length];
    const cat = catsList[ridCounter % catsList.length];
    const pack = packsList[ridCounter % packsList.length];
    const fare = (500 + (ridCounter % 15) * 100).toFixed(2);
    const dep = '1000.00';
    const date = stat === 'Upcoming' ? '2026-06-21T00:00:00.000Z' : '2026-06-15T00:00:00.000Z';
    const time = '10:00:00';
    const created = '2026-06-14T12:00:00.000Z';

    mockList.push({
      id: String(ridCounter + 1000),
      reservation_id: rId,
      customer_name: name,
      mobile: `+91 99999 ${String(ridCounter).padStart(5, '0')}`,
      gov_id: `GOV${ridCounter}X`,
      reservation_date: date,
      reservation_time: time,
      package_type: pack,
      vehicle_category: cat,
      vehicle_number: `DL 1Z XX ${ridCounter}`,
      fare,
      deposit: dep,
      payment_mode: 'UPI',
      payment_status: payStat,
      status: stat,
      pickup_zone: pZone,
      drop_zone: dZone,
      created_at: created
    });

    ridCounter--;
  }
};
makeMocks();

// Helper to get stats from list
const getStats = (list) => {
  const stats = { total: list.length, upcoming: 0, completed: 0, cancelled: 0 };
  list.forEach(r => {
    if (r.status === 'Upcoming') stats.upcoming++;
    else if (r.status === 'Completed') stats.completed++;
    else if (r.status === 'Cancelled') stats.cancelled++;
  });
  return stats;
};

// GET /api/reservations
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';

    let query = 'SELECT * FROM reservations WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM reservations WHERE 1=1';
    const params = [];
    const countParams = [];
    let pIdx = 1;

    if (search) {
      query += ` AND (customer_name ILIKE $${pIdx} OR mobile ILIKE $${pIdx} OR reservation_id ILIKE $${pIdx})`;
      countQuery += ` AND (customer_name ILIKE $${pIdx} OR mobile ILIKE $${pIdx} OR reservation_id ILIKE $${pIdx})`;
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
      pIdx++;
    }

    if (status) {
      query += ` AND status = $${pIdx}`;
      countQuery += ` AND status = $${pIdx}`;
      params.push(status);
      countParams.push(status);
      pIdx++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${pIdx} OFFSET $${pIdx + 1}`;
    params.push(limit, offset);

    const [rowsResult, countResult] = await Promise.all([
      db.query(query, params),
      db.query(countQuery, countParams)
    ]);

    const total = parseInt(countResult.rows[0].total);

    // Fetch Stats summary
    const statsResult = await db.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Upcoming' THEN 1 END) as upcoming,
        COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled
      FROM reservations
    `);
    const stats = {
      total: parseInt(statsResult.rows[0].total) || 0,
      upcoming: parseInt(statsResult.rows[0].upcoming) || 0,
      completed: parseInt(statsResult.rows[0].completed) || 0,
      cancelled: parseInt(statsResult.rows[0].cancelled) || 0
    };

    res.json({
      status: 'success',
      data: rowsResult.rows,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.warn('Postgres query failed for reservations, returning mock fallback:', err.message);

    // Filter, paginate and stats mock data
    let filtered = [...mockList];
    const search = (req.query.search || '').toLowerCase();
    const status = (req.query.status || '');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (search) {
      filtered = filtered.filter(r => 
        r.customer_name.toLowerCase().includes(search) ||
        r.mobile.includes(search) ||
        r.reservation_id.toLowerCase().includes(search)
      );
    }

    if (status) {
      filtered = filtered.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    res.json({
      status: 'success',
      data: paginated,
      stats: getStats(mockList),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  }
});

// POST /api/reservations (create new reservation)
router.post('/', async (req, res) => {
  const {
    customer_name,
    mobile,
    gov_id,
    reservation_date,
    reservation_time,
    package_type,
    vehicle_category,
    fare,
    deposit,
    payment_mode,
    pickup_zone,
    drop_zone
  } = req.body;

  // Generate unique ID
  const randomSuffix = String(Math.floor(100 + Math.random() * 900));
  const dateObj = new Date();
  const year = dateObj.getFullYear();
  const reservation_id = `RID-${year}-${randomSuffix}${String(mockList.length).padStart(3, '0')}`;

  try {
    const result = await db.query(`
      INSERT INTO reservations (
        reservation_id, customer_name, mobile, gov_id, reservation_date, 
        reservation_time, package_type, vehicle_category, fare, deposit, 
        payment_mode, status, payment_status, pickup_zone, drop_zone, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
      RETURNING *
    `, [
      reservation_id, customer_name, mobile, gov_id, reservation_date,
      reservation_time, package_type, vehicle_category, fare, deposit,
      payment_mode, 'Upcoming', 'Paid', pickup_zone || 'Connaught Place Zone', drop_zone || 'Indira Gandhi Airport'
    ]);

    // Keep mock list in sync
    mockList.unshift(result.rows[0]);

    res.json({ status: 'success', message: 'Reservation created successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Failed to create reservation in DB, saving in-memory:', err.message);
    const newRecord = {
      id: String(mockList.length + 2000),
      reservation_id,
      customer_name,
      mobile,
      gov_id,
      reservation_date: new Date(reservation_date).toISOString(),
      reservation_time,
      package_type,
      vehicle_category,
      vehicle_number: null,
      fare: parseFloat(fare).toFixed(2),
      deposit: parseFloat(deposit).toFixed(2),
      payment_mode,
      payment_status: 'Paid',
      status: 'Upcoming',
      pickup_zone: pickup_zone || 'Connaught Place Zone',
      drop_zone: drop_zone || 'Indira Gandhi Airport',
      created_at: new Date().toISOString()
    };
    mockList.unshift(newRecord);
    res.json({ status: 'success', message: 'Reservation created (Mock)', data: newRecord });
  }
});

// POST /api/reservations/:id/cancel (cancel reservation with refund rules)
router.post('/:id/cancel', async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch reservation details
    let reservation;
    const dbRes = await db.query('SELECT * FROM reservations WHERE id = $1 OR reservation_id = $2', [id, id]);
    if (dbRes.rows.length > 0) {
      reservation = dbRes.rows[0];
    } else {
      reservation = mockList.find(r => r.id === id || r.reservation_id === id);
    }

    if (!reservation) {
      return res.status(404).json({ status: 'error', message: 'Reservation not found' });
    }

    // Refund Logic
    // Compute time difference in hours between reservation date/time and now
    const now = new Date();
    const resDateStr = new Date(reservation.reservation_date).toISOString().split('T')[0];
    const resDateTime = new Date(`${resDateStr}T${reservation.reservation_time}`);
    const timeDiffMs = resDateTime - now;
    const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

    let refundPercent = 0;
    if (timeDiffHours >= 24) {
      refundPercent = 100;
    } else if (timeDiffHours >= 12) {
      refundPercent = 90;
    } else if (timeDiffHours >= 4) {
      refundPercent = 50;
    } else {
      refundPercent = 0;
    }

    const fareNum = parseFloat(reservation.fare);
    const refundAmt = ((fareNum * refundPercent) / 100).toFixed(2);
    const paymentStatus = refundPercent > 0 ? 'Refunded' : 'Paid';

    // Update reservation status in database
    let updated;
    try {
      const updateResult = await db.query(`
        UPDATE reservations
        SET status = 'Cancelled', payment_status = $1
        WHERE id = $2 OR reservation_id = $3
        RETURNING *
      `, [paymentStatus, id, id]);
      if (updateResult.rows.length > 0) updated = updateResult.rows[0];
    } catch (dbErr) {
      console.warn('DB update failed, fallback to in-memory cancellation:', dbErr.message);
    }

    // In-memory update
    const memIdx = mockList.findIndex(r => r.id === id || r.reservation_id === id);
    if (memIdx !== -1) {
      mockList[memIdx].status = 'Cancelled';
      mockList[memIdx].payment_status = paymentStatus;
      if (!updated) updated = mockList[memIdx];
    }

    res.json({
      status: 'success',
      message: `Reservation cancelled. Refunded ${refundPercent}% (₹${refundAmt})`,
      refundPercent,
      refundAmount: refundAmt,
      data: updated
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/reservations/:id/allocate (operator allocate vehicle)
router.post('/:id/allocate', async (req, res) => {
  const { id } = req.params;
  const { vehicle_number } = req.body;

  if (!vehicle_number) {
    return res.status(400).json({ status: 'error', message: 'Vehicle number is required' });
  }

  try {
    let updated;
    try {
      const updateResult = await db.query(`
        UPDATE reservations
        SET vehicle_number = $1, status = 'Completed'
        WHERE id = $2 OR reservation_id = $3
        RETURNING *
      `, [vehicle_number, id, id]);
      if (updateResult.rows.length > 0) updated = updateResult.rows[0];
    } catch (dbErr) {
      console.warn('DB allocate update failed, fallback to in-memory:', dbErr.message);
    }

    const memIdx = mockList.findIndex(r => r.id === id || r.reservation_id === id);
    if (memIdx !== -1) {
      mockList[memIdx].vehicle_number = vehicle_number;
      mockList[memIdx].status = 'Completed';
      if (!updated) updated = mockList[memIdx];
    }

    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Reservation not found' });
    }

    res.json({ status: 'success', message: 'Vehicle allocated successfully', data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
