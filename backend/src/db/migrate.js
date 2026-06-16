require('dotenv').config();
const db = require('../db');

const migrate = async () => {
  console.log('Running migrations...');

  await db.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      role VARCHAR(50) DEFAULT 'Employee',
      avatar_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS riders (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      mobile VARCHAR(20) NOT NULL,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS requests (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      request_id VARCHAR(30) UNIQUE NOT NULL,
      type VARCHAR(50) NOT NULL,
      rider_id UUID REFERENCES riders(id),
      employee_id UUID REFERENCES users(id),
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS batteries (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      battery_id VARCHAR(50) UNIQUE NOT NULL,
      status VARCHAR(30) DEFAULT 'idle',
      soc INT DEFAULT 100,
      voltage NUMERIC(5, 2),
      current NUMERIC(5, 2),
      temp NUMERIC(4, 1),
      cycles INT DEFAULT 0,
      health INT DEFAULT 100,
      lat NUMERIC(9, 6),
      lng NUMERIC(9, 6),
      serial_number VARCHAR(100),
      battery_type VARCHAR(50) DEFAULT 'Li-ion',
      capacity VARCHAR(30),
      make VARCHAR(100),
      model VARCHAR(100),
      location VARCHAR(150),
      zone VARCHAR(150),
      assigned_to VARCHAR(100),
      vehicle_number VARCHAR(50),
      rider_name VARCHAR(100),
      purchase_date DATE,
      warranty_valid_till DATE,
      supplier VARCHAR(150),
      cost NUMERIC(10, 2),
      invoice_number VARCHAR(100),
      notes TEXT,
      cells JSONB DEFAULT '[]'::jsonb,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS battery_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      battery_id VARCHAR(50) REFERENCES batteries(battery_id) ON DELETE CASCADE,
      soc INT,
      voltage NUMERIC(5, 2),
      current NUMERIC(5, 2),
      temp NUMERIC(4, 1),
      lat NUMERIC(9, 6),
      lng NUMERIC(9, 6),
      status VARCHAR(30),
      cells JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    DROP TABLE IF EXISTS renters CASCADE;
    DROP TABLE IF EXISTS zones CASCADE;

    CREATE TABLE IF NOT EXISTS settings (
      category VARCHAR(50) PRIMARY KEY,
      values JSONB NOT NULL
    );

    CREATE TABLE IF NOT EXISTS renters (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      rider_name VARCHAR(100) NOT NULL,
      mobile VARCHAR(20) NOT NULL,
      vehicle_id VARCHAR(50) NOT NULL,
      battery_id VARCHAR(50) NOT NULL,
      package_name VARCHAR(100) NOT NULL,
      rental_start_date DATE NOT NULL,
      return_date DATE,
      status VARCHAR(30) DEFAULT 'Active Ride',
      rent NUMERIC(10, 2) NOT NULL,
      deposit NUMERIC(10, 2) NOT NULL,
      total NUMERIC(10, 2) NOT NULL,
      avatar_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      reservation_id VARCHAR(50) UNIQUE NOT NULL,
      customer_name VARCHAR(100) NOT NULL,
      mobile VARCHAR(20) NOT NULL,
      gov_id VARCHAR(50) NOT NULL,
      reservation_date DATE NOT NULL,
      reservation_time TIME NOT NULL,
      package_type VARCHAR(50) NOT NULL,
      vehicle_category VARCHAR(50) NOT NULL,
      vehicle_number VARCHAR(50),
      battery_id VARCHAR(50),
      id_card_url TEXT,
      inspection_media_url TEXT,
      fare NUMERIC(10, 2) NOT NULL,
      deposit NUMERIC(10, 2) NOT NULL,
      payment_mode VARCHAR(50) NOT NULL,
      payment_status VARCHAR(30) DEFAULT 'Paid',
      status VARCHAR(30) DEFAULT 'Upcoming',
      pickup_zone VARCHAR(100),
      drop_zone VARCHAR(100),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE reservations ADD COLUMN IF NOT EXISTS battery_id VARCHAR(50);
    ALTER TABLE reservations ADD COLUMN IF NOT EXISTS id_card_url TEXT;
    ALTER TABLE reservations ADD COLUMN IF NOT EXISTS inspection_media_url TEXT;

    CREATE TABLE IF NOT EXISTS zones (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      code VARCHAR(50) NOT NULL UNIQUE,
      country VARCHAR(100),
      state VARCHAR(100),
      city VARCHAR(100),
      locality VARCHAR(100),
      type VARCHAR(50),
      priority VARCHAR(50),
      status VARCHAR(30) DEFAULT 'active',
      timezone VARCHAR(50),
      description TEXT,
      start_date DATE,
      end_date DATE,
      max_vehicles INT,
      notes TEXT,
      map_link TEXT,
      points JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log('Migrations complete!');
  process.exit(0);
};

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
