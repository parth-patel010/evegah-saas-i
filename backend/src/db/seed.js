require('dotenv').config();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const seed = async () => {
  console.log('Seeding database...');

  // Seed roles
  console.log('Seeding default roles...');
  const defaultRoles = [
    {
      name: 'Super Admin',
      code: 'SUPER_ADMIN',
      description: 'Full access to all system modules and settings.',
      reporting_to: 'Board',
      status: 'Active',
      permissions: {
        Dashboard: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Riders: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Vehicles: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Battery: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        "IoT Devices": { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Payments: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Reports: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Alerts: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        "Zone Management": { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Franchise: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Settings: { access: true, create: true, view: true, edit: true, delete: true, export: true }
      },
      custom_permissions: ['all_permissions']
    },
    {
      name: 'Platform Admin',
      code: 'PLATFORM_ADMIN',
      description: 'Administrative access to system operations.',
      reporting_to: 'Super Admin',
      status: 'Active',
      permissions: {
        Dashboard: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Riders: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Vehicles: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Battery: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        "IoT Devices": { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Payments: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Reports: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Alerts: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        "Zone Management": { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Franchise: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Settings: { access: true, create: true, view: true, edit: true, delete: true, export: true }
      },
      custom_permissions: []
    },
    {
      name: 'Zone Admin',
      code: 'ZONE_ADMIN',
      description: 'Management access for zone specific operations.',
      reporting_to: 'Platform Admin',
      status: 'Active',
      permissions: { Dashboard: { access: true, create: false, view: true, edit: true, delete: false, export: true } },
      custom_permissions: []
    },
    {
      name: 'Franchise Manager',
      code: 'FRANCHISE_MANAGER',
      description: 'Onboarding and operations access for franchise partners.',
      reporting_to: 'Platform Admin',
      status: 'Active',
      permissions: { Dashboard: { access: true, create: false, view: true, edit: false, delete: false, export: false } },
      custom_permissions: []
    },
    {
      name: 'Employee',
      code: 'EMPLOYEE',
      description: 'Standard employee access for zone operations.',
      reporting_to: 'Zone Admin',
      status: 'Active',
      permissions: { Dashboard: { access: true, create: false, view: true, edit: false, delete: false, export: false } },
      custom_permissions: []
    }
  ];

  for (const role of defaultRoles) {
    await db.query(`
      INSERT INTO roles (name, code, description, reporting_to, status, permissions, custom_permissions)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (name) DO UPDATE SET
        code = EXCLUDED.code,
        description = EXCLUDED.description,
        reporting_to = EXCLUDED.reporting_to,
        status = EXCLUDED.status,
        permissions = EXCLUDED.permissions,
        custom_permissions = EXCLUDED.custom_permissions
    `, [role.name, role.code, role.description, role.reporting_to, role.status, JSON.stringify(role.permissions), JSON.stringify(role.custom_permissions)]);
  }

  // Seed user
  const userId = uuidv4();
  await db.query(`
    INSERT INTO users (id, name, email, role) 
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (email) DO NOTHING
  `, [userId, 'Priya Sharma', 'priya@evegah.com', 'Employee']);

  const adminUserId = uuidv4();
  await db.query(`
    INSERT INTO users (id, name, email, role, mobile, zone, status, password) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (email) DO UPDATE SET
      role = EXCLUDED.role,
      name = EXCLUDED.name
  `, [adminUserId, 'Himanshu', 'himanshu@evegah.com', 'Super Admin', '+91 99999 88888', 'Multiple Zones', 'Active', 'admin123']);

  // Seed riders
  const riders = [
    { id: uuidv4(), name: 'Amit Kumar', mobile: '+91 98765 43210' },
    { id: uuidv4(), name: 'Neha Gupta', mobile: '+91 91254 56789' },
    { id: uuidv4(), name: 'Rohit Singh', mobile: '+91 99876 54321' },
    { id: uuidv4(), name: 'Sneha Reddy', mobile: '+91 87654 32109' },
    { id: uuidv4(), name: 'Vikram Patel', mobile: '+91 78945 61230' },
  ];

  for (const rider of riders) {
    await db.query(`
      INSERT INTO riders (id, name, mobile) VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
    `, [rider.id, rider.name, rider.mobile]);
  }

  // Seed requests
  const requests = [
    { request_id: 'REQ-2024-0518-0012', type: 'new_rider', riderId: riders[0].id, status: 'completed', created_at: '2024-05-18 10:30:00' },
    { request_id: 'REQ-2024-0518-0011', type: 'retain_rider', riderId: riders[1].id, status: 'pending', created_at: '2024-05-18 09:45:00' },
    { request_id: 'REQ-2024-0518-0010', type: 'return_ride', riderId: riders[2].id, status: 'in_progress', created_at: '2024-05-18 09:15:00' },
    { request_id: 'REQ-2024-0518-0009', type: 'extend_ride', riderId: riders[3].id, status: 'completed', created_at: '2024-05-18 08:30:00' },
    { request_id: 'REQ-2024-0518-0008', type: 'battery_swap', riderId: riders[4].id, status: 'pending', created_at: '2024-05-18 08:05:00' },
  ];

  const userResult = await db.query('SELECT id FROM users WHERE email = $1', ['priya@evegah.com']);
  const empId = userResult.rows[0]?.id;

  for (const req of requests) {
    await db.query(`
      INSERT INTO requests (id, request_id, type, rider_id, employee_id, status, created_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (request_id) DO NOTHING
    `, [uuidv4(), req.request_id, req.type, req.riderId, empId, req.status, req.created_at]);
  }

  // Seed more requests for stats
  const statuses = ['completed', 'completed', 'pending', 'in_progress', 'cancelled', 'rejected'];
  const types = ['new_rider', 'retain_rider', 'return_ride', 'extend_ride', 'battery_swap'];
  
  for (let i = 0; i < 120; i++) {
    const reqId = `REQ-2024-AUTO-${String(i).padStart(4, '0')}`;
    await db.query(`
      INSERT INTO requests (id, request_id, type, rider_id, employee_id, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW() - INTERVAL '${Math.floor(Math.random() * 30)} days')
      ON CONFLICT (request_id) DO NOTHING
    `, [
      uuidv4(), reqId,
      types[i % types.length],
      riders[i % riders.length].id,
      empId,
      statuses[i % statuses.length]
    ]);
  }

  // Dummy batteries seeding removed since BMS data now comes from real live database


  // Seed default settings
  const defaultSettings = [
    {
      category: 'general',
      values: {
        zone_name: 'Connaught Place Zone',
        time_zone: '(UTC +05:30) Asia/Kolkata',
        date_format: 'DD MMM YYYY (31 May 2024)',
        time_format: '12 Hours (AM/PM)',
        currency: 'INR (₹) - Indian Rupee',
        auto_approve_registrations: true,
        email_notifications: true,
        sms_notifications: true,
        maintenance_mode: false,
        allow_bulk_operations: true,
        items_per_page: 25,
        default_language: 'English',
        map_provider: 'Google Maps',
        session_timeout: '30 Minutes',
        min_rental_duration: 1,
        max_rental_duration: 30,
        late_return_grace_period: 15,
        security_deposit: 500.00
      }
    },
    {
      category: 'ride_rental',
      values: {
        allow_ride_booking: true,
        min_ride_distance: 1.0,
        max_ride_distance: 100,
        ride_cancellation_limit: '15 Minutes',
        auto_complete_ride: true,
        ride_grace_time: 10,
        allow_rentals: true,
        min_rental_duration_hours: 1,
        max_rental_duration_days: 30,
        security_deposit_refundable: 500.00,
        advance_payment: 'No Advance',
        auto_extend_rental: true,
        base_fare: 20.00,
        per_km_charge: 8.00,
        plan_rate_type: 'Per Day',
        late_return_fee: 50.00,
        tax_percentage: 18,
        renter_wallet_deduction: true,
        operating_hours_ride_from: '06:00 AM',
        operating_hours_ride_to: '11:00 PM',
        operating_hours_rental_from: '06:00 AM',
        operating_hours_rental_to: '10:00 PM',
        weekly_off: ['Sun'],
        pickup_outside_zone: false,
        drop_outside_zone: false,
        extended_coverage_fee: 30.00,
        allow_multiple_vehicles: true,
        enable_rating_reviews: true,
        cleaner_fee: 100.00,
        toll_charges: 'Reimburse',
        smoking_penalty: 200.00
      }
    },
    {
      category: 'payments',
      values: {
        razorpay_active: true,
        razorpay_key_id: 'rzp_live_xxxxxxxxxxxxx',
        phonepe_active: true,
        phonepe_merchant_id: 'PGTESTxxxxxxxx',
        paytm_active: false,
        paytm_merchant_id: 'Mid_xxxxxxxxxxxxx',
        default_payment_method: 'UPI',
        payment_capture: true,
        partial_payment: true,
        payment_retry: '3 Attempts',
        payment_timeout: '10 Minutes',
        auto_refund: true,
        refund_approval: true,
        refund_limit: 500.00,
        refund_processing_time: '3 - 5 Business Days',
        gst_applicable: true,
        gst_percentage: 18,
        service_fee: 10.00,
        convenience_fee: 5.00,
        methods_upi: true,
        methods_card: true,
        methods_netbanking: true,
        methods_wallets: true,
        methods_cash: false
      }
    },
    {
      category: 'notifications',
      values: {
        channels_email: true,
        channels_sms: true,
        channels_inapp: true,
        quiet_hours_enabled: true,
        quiet_hours_from: '10:00 PM',
        quiet_hours_to: '07:00 AM',
        quiet_hours_timezone: '(UTC +05:30) Asia/Kolkata',
        prefs_ride_bookings: { email: true, sms: true, inapp: true },
        prefs_rental_bookings: { email: true, sms: true, inapp: true },
        prefs_payments: { email: true, sms: false, inapp: true },
        prefs_payouts: { email: true, sms: false, inapp: true },
        prefs_battery_alerts: { email: false, sms: true, inapp: true },
        prefs_vehicle_alerts: { email: true, sms: true, inapp: true },
        prefs_system_alerts: { email: true, sms: false, inapp: true },
        prefs_promotions: { email: false, sms: false, inapp: true }
      }
    },
    {
      category: 'system',
      values: {
        system_time_zone: '(UTC +05:30) Asia/Kolkata',
        system_date_format: 'DD-MM-YYYY',
        system_time_format: '12 Hour (AM/PM)',
        system_language: 'English',
        system_automatic_updates: true,
        system_update_channel: 'Stable',
        system_last_checked: 'Today, 08:30 AM',
        system_version: 'v2.4.0',
        system_info: {
          server_name: 'evg-server-01',
          web_server: 'Nginx 1.24.0',
          environment: 'Production',
          php_version: '8.2.12',
          total_storage: 256,
          used_storage: 128,
          database_version: 'MySQL 8.0.34',
          active_users: 24,
          active_sessions: 37,
          uptime: '15 Days, 6 Hours'
        },
        auto_backup: true,
        backup_frequency: 'Daily',
        last_backup: 'Today, 02:00 AM',
        last_backup_status: 'Success',
        backup_size: '2.4 GB'
      }
    },
    {
      category: 'battery_swapping',
      values: {
        soc_swap_threshold: 20,
        soc_alert_threshold: 15,
        max_cycles_limit: 500,
        temp_alert_threshold: 45,
        auto_station_allocation: true,
        require_swap_auth: true
      }
    },
    {
      category: 'documents',
      values: {
        require_aadhar: true,
        require_dl: true,
        require_pan: false,
        auto_verify_documents: true,
        max_file_size: 5,
        allowed_formats: 'PDF, PNG, JPG'
      }
    },
    {
      category: 'security',
      values: {
        two_factor_auth: false,
        strong_password_policy: true,
        max_login_attempts: 5,
        session_timeout_seconds: 1800,
        allow_concurrent_logins: false
      }
    }
  ];

  for (const set of defaultSettings) {
    await db.query(`
      INSERT INTO settings (category, values)
      VALUES ($1, $2)
      ON CONFLICT (category) DO UPDATE SET values = EXCLUDED.values
    `, [set.category, JSON.stringify(set.values)]);
  }

  // Seed default renters
  console.log('Seeding renters...');
  await db.query('DELETE FROM renters');
  
  const defaultRenters = [
    {
      rider_name: 'Rahul Sharma',
      mobile: '+91 98765 43210',
      vehicle_id: 'VHC-2024-000123',
      battery_id: 'BAT-2024-000456',
      package_name: 'Standard - Monthly',
      rental_start_date: '2025-05-24 09:15:00',
      return_date: '2025-06-24 09:15:00',
      status: 'Active Ride',
      rent: 2000.00,
      deposit: 1000.00,
      total: 3000.00,
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
    },
    {
      rider_name: 'Priya Mehta',
      mobile: '+91 91234 56789',
      vehicle_id: 'VHC-2024-000124',
      battery_id: 'BAT-2024-000457',
      package_name: 'Standard - Monthly',
      rental_start_date: '2025-05-23 18:40:00',
      return_date: '2025-06-23 18:40:00',
      status: 'Active Ride',
      rent: 2000.00,
      deposit: 1000.00,
      total: 3000.00,
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
    },
    {
      rider_name: 'Aman Verma',
      mobile: '+91 99887 66554',
      vehicle_id: 'VHC-2024-000125',
      battery_id: 'BAT-2024-000458',
      package_name: 'Basic - Weekly',
      rental_start_date: '2025-05-22 11:20:00',
      return_date: '2025-05-29 11:20:00',
      status: 'Retain Ride',
      rent: 800.00,
      deposit: 500.00,
      total: 1300.00,
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
    },
    {
      rider_name: 'Sneha Patil',
      mobile: '+91 87654 32109',
      vehicle_id: 'VHC-2024-000126',
      battery_id: 'BAT-2024-000459',
      package_name: 'Standard - Monthly',
      rental_start_date: '2025-05-21 15:10:00',
      return_date: '2025-06-21 15:10:00',
      status: 'Active Ride',
      rent: 2000.00,
      deposit: 1000.00,
      total: 3000.00,
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'
    },
    {
      rider_name: 'Vikram Singh',
      mobile: '+91 98989 76432',
      vehicle_id: 'VHC-2024-000127',
      battery_id: 'BAT-2024-000460',
      package_name: 'Basic - Weekly',
      rental_start_date: '2025-05-20 10:05:00',
      return_date: '2025-05-27 10:05:00',
      status: 'Return',
      rent: 800.00,
      deposit: 500.00,
      total: 1300.00,
      avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80'
    },
    {
      rider_name: 'Neha Kapoor',
      mobile: '+91 93456 78901',
      vehicle_id: 'VHC-2024-000128',
      battery_id: 'BAT-2024-000461',
      package_name: 'Standard - Monthly',
      rental_start_date: '2025-05-19 13:30:00',
      return_date: '2025-06-19 13:30:00',
      status: 'Extend',
      rent: 2000.00,
      deposit: 1000.00,
      total: 3000.00,
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80'
    },
    {
      rider_name: 'Rohit Das',
      mobile: '+91 90000 11223',
      vehicle_id: 'VHC-2024-000129',
      battery_id: 'BAT-2024-000462',
      package_name: 'Basic - Weekly',
      rental_start_date: '2025-05-18 08:45:00',
      return_date: '2025-05-18 08:45:00',
      status: 'Return',
      rent: 800.00,
      deposit: 500.00,
      total: 1300.00,
      avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80'
    },
    {
      rider_name: 'Kavya Reddy',
      mobile: '+91 98866 55443',
      vehicle_id: 'VHC-2024-000130',
      battery_id: 'BAT-2024-000463',
      package_name: 'Standard - Monthly',
      rental_start_date: '2025-05-17 17:25:00',
      return_date: '2025-06-17 17:25:00',
      status: 'Retain Ride',
      rent: 2000.00,
      deposit: 1000.00,
      total: 3000.00,
      avatar_url: 'https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&w=100&q=80'
    },
    {
      rider_name: 'Arjun Nair',
      mobile: '+91 87777 88999',
      vehicle_id: 'VHC-2024-000131',
      battery_id: 'BAT-2024-000464',
      package_name: 'Premium - Monthly',
      rental_start_date: '2025-05-16 14:10:00',
      return_date: '2025-06-16 14:10:00',
      status: 'Active Ride',
      rent: 2500.00,
      deposit: 1500.00,
      total: 4000.00,
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
    },
    {
      rider_name: 'Pooja Patel',
      mobile: '+91 99123 45678',
      vehicle_id: 'VHC-2024-000132',
      battery_id: 'BAT-2024-000465',
      package_name: 'Basic - Weekly',
      rental_start_date: '2025-05-15 09:30:00',
      return_date: '2025-05-15 09:30:00',
      status: 'Return',
      rent: 800.00,
      deposit: 500.00,
      total: 1300.00,
      avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80'
    }
  ];

  for (const r of defaultRenters) {
    await db.query(`
      INSERT INTO renters (rider_name, mobile, vehicle_id, battery_id, package_name, rental_start_date, return_date, status, rent, deposit, total, avatar_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [r.rider_name, r.mobile, r.vehicle_id, r.battery_id, r.package_name, r.rental_start_date, r.return_date, r.status, r.rent, r.deposit, r.total, r.avatar_url]);
  }

  // Seed default zones
  console.log('Seeding zones...');
  await db.query('DELETE FROM zones');

  const defaultZones = [
    {
      name: 'Connaught Place Zone',
      code: 'CPZ-001',
      country: 'India',
      state: 'Delhi',
      city: 'New Delhi',
      locality: 'Connaught Place',
      type: 'Operational Zone',
      priority: 'High',
      status: 'active',
      timezone: '(GMT+05:30) Asia/Kolkata',
      description: 'Operational zone for Connaught Place area including inner circle.',
      start_date: '2024-05-15',
      end_date: null,
      max_vehicles: 250,
      notes: '',
      map_link: 'https://maps.google.com/?q=28.6315,77.2197',
      points: [
        { lat: 28.6315, lng: 77.2197 },
        { lat: 28.6328, lng: 77.2289 },
        { lat: 28.6261, lng: 77.2314 },
        { lat: 28.6198, lng: 77.2190 },
        { lat: 28.6181, lng: 77.2093 },
        { lat: 28.6232, lng: 77.2051 },
        { lat: 28.6289, lng: 77.2078 },
        { lat: 28.6315, lng: 77.2197 }
      ]
    }
  ];

  for (const z of defaultZones) {
    await db.query(`
      INSERT INTO zones (name, code, country, state, city, locality, type, priority, status, timezone, description, start_date, end_date, max_vehicles, notes, map_link, points)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    `, [z.name, z.code, z.country, z.state, z.city, z.locality, z.type, z.priority, z.status, z.timezone, z.description, z.start_date, z.end_date, z.max_vehicles, z.notes, z.map_link, JSON.stringify(z.points)]);
  }

  // Seed Reservations
  console.log('Seeding reservations...');
  await db.query('DELETE FROM reservations');

  const mainReservations = [
    { reservation_id: 'RID-2024-00128', customer_name: 'Rohit Sharma', mobile: '+91 98765 43210', gov_id: 'GOV123456', reservation_date: '2026-06-20', reservation_time: '09:30:00', package_type: 'Day', vehicle_category: 'SUV', vehicle_number: 'DL 1Z AB 1234', fare: 1250, deposit: 1000, payment_mode: 'UPI', payment_status: 'Paid', status: 'Upcoming', pickup_zone: 'Connaught Place Zone', drop_zone: 'Indira Gandhi Airport', created_at: '2026-06-19 22:15:00' },
    { reservation_id: 'RID-2024-00127', customer_name: 'Priya Verma', mobile: '+91 91234 56789', gov_id: 'GOV234567', reservation_date: '2026-06-20', reservation_time: '11:00:00', package_type: 'Hourly', vehicle_category: 'Sedan', vehicle_number: 'DL 1Z CD 5678', fare: 850, deposit: 1000, payment_mode: 'Card', payment_status: 'Paid', status: 'Upcoming', pickup_zone: 'Karol Bagh Zone', drop_zone: 'Noida Sector 62', created_at: '2026-06-19 21:45:00' },
    { reservation_id: 'RID-2024-00126', customer_name: 'Mohit Singh', mobile: '+91 99877 66554', gov_id: 'GOV345678', reservation_date: '2026-06-19', reservation_time: '16:00:00', package_type: 'Day', vehicle_category: 'Hatchback', vehicle_number: 'DL 1Z EF 9012', fare: 1100, deposit: 1000, payment_mode: 'UPI', payment_status: 'Paid', status: 'Completed', pickup_zone: 'West Delhi Zone', drop_zone: 'Gurgaon Cyber City', created_at: '2026-06-18 20:20:00' },
    { reservation_id: 'RID-2024-00125', customer_name: 'Neha Kapoor', mobile: '+91 88776 54321', gov_id: 'GOV456789', reservation_date: '2026-06-19', reservation_time: '19:30:00', package_type: 'Weekly', vehicle_category: 'SUV', vehicle_number: 'DL 1Z GH 3456', fare: 1300, deposit: 1500, payment_mode: 'UPI', payment_status: 'Paid', status: 'Completed', pickup_zone: 'South Delhi Zone', drop_zone: 'Indira Gandhi Airport', created_at: '2026-06-18 19:05:00' },
    { reservation_id: 'RID-2024-00124', customer_name: 'Arjun Sharma', mobile: '+91 77665 44332', gov_id: 'GOV567890', reservation_date: '2026-06-18', reservation_time: '14:00:00', package_type: 'Hourly', vehicle_category: 'Sedan', vehicle_number: 'DL 1Z IJ 7890', fare: 950, deposit: 1000, payment_mode: 'UPI', payment_status: 'Refunded', status: 'Cancelled', pickup_zone: 'Dwarka Zone', drop_zone: 'Noida Sector 18', created_at: '2026-06-17 23:30:00' },
    { reservation_id: 'RID-2024-00123', customer_name: 'Swati Sharma', mobile: '+91 66654 33221', gov_id: 'GOV678901', reservation_date: '2026-06-17', reservation_time: '09:00:00', package_type: 'Day', vehicle_category: 'Hatchback', vehicle_number: 'DL 1Z KL 2345', fare: 1000, deposit: 1000, payment_mode: 'Card', payment_status: 'Paid', status: 'Upcoming', pickup_zone: 'Gurgaon Zone', drop_zone: 'Connaught Place', created_at: '2026-06-16 20:45:00' },
    { reservation_id: 'RID-2024-00122', customer_name: 'Deepak Patel', mobile: '+91 55443 22110', gov_id: 'GOV789012', reservation_date: '2026-06-17', reservation_time: '17:30:00', package_type: 'Day', vehicle_category: 'SUV', vehicle_number: 'DL 1Z MN 6789', fare: 1150, deposit: 1000, payment_mode: 'UPI', payment_status: 'Refunded', status: 'Cancelled', pickup_zone: 'Noida Zone', drop_zone: 'Dwarka Sector 21', created_at: '2026-06-16 18:10:00' },
    { reservation_id: 'RID-2024-00121', customer_name: 'Rahul Kumar', mobile: '+91 77889 00122', gov_id: 'GOV890123', reservation_date: '2026-06-16', reservation_time: '08:15:00', package_type: 'Day', vehicle_category: 'Sedan', vehicle_number: 'DL 1Z OP 1122', fare: 1200, deposit: 1000, payment_mode: 'UPI', payment_status: 'Paid', status: 'Completed', pickup_zone: 'Connaught Place Zone', drop_zone: 'Gurgaon Cyber City', created_at: '2026-06-15 22:00:00' },
    { reservation_id: 'RID-2024-00120', customer_name: 'Simran Malik', mobile: '+91 88990 33445', gov_id: 'GOV901234', reservation_date: '2026-06-16', reservation_time: '13:45:00', package_type: 'Day', vehicle_category: 'Hatchback', vehicle_number: 'DL 1Z QR 3344', fare: 1180, deposit: 1000, payment_mode: 'UPI', payment_status: 'Paid', status: 'Upcoming', pickup_zone: 'Karol Bagh Zone', drop_zone: 'Indira Gandhi Airport', created_at: '2026-06-15 21:15:00' },
    { reservation_id: 'RID-2024-00119', customer_name: 'Vikram Mehta', mobile: '+91 99554 77889', gov_id: 'GOV012345', reservation_date: '2026-06-16', reservation_time: '18:00:00', package_type: 'Weekly', vehicle_category: 'SUV', vehicle_number: 'DL 1Z ST 5566', fare: 1350, deposit: 1500, payment_mode: 'UPI', payment_status: 'Paid', status: 'Completed', pickup_zone: 'West Delhi Zone', drop_zone: 'Noida Sector 62', created_at: '2026-06-15 20:30:00' },
  ];

  for (const r of mainReservations) {
    await db.query(`
      INSERT INTO reservations (reservation_id, customer_name, mobile, gov_id, reservation_date, reservation_time, package_type, vehicle_category, vehicle_number, fare, deposit, payment_mode, payment_status, status, pickup_zone, drop_zone, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    `, [r.reservation_id, r.customer_name, r.mobile, r.gov_id, r.reservation_date, r.reservation_time, r.package_type, r.vehicle_category, r.vehicle_number, r.fare, r.deposit, r.payment_mode, r.payment_status, r.status, r.pickup_zone, r.drop_zone, r.created_at]);
  }

  // To match stats: Total = 128. Upcoming = 96 (we have 4, need 92). Completed = 24 (we have 4, need 20). Cancelled = 8 (we have 2, need 6).
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
    const fare = 500 + (ridCounter % 15) * 100;
    const dep = 1000;
    const date = stat === 'Upcoming' ? '2026-06-21' : '2026-06-15';
    const time = '10:00:00';
    const created = '2026-06-14 12:00:00';

    await db.query(`
      INSERT INTO reservations (reservation_id, customer_name, mobile, gov_id, reservation_date, reservation_time, package_type, vehicle_category, vehicle_number, fare, deposit, payment_mode, payment_status, status, pickup_zone, drop_zone, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    `, [rId, name, `+91 99999 ${String(ridCounter).padStart(5, '0')}`, `GOV${ridCounter}X`, date, time, pack, cat, `DL 1Z XX ${ridCounter}`, fare, dep, 'UPI', payStat, stat, pZone, dZone, created]);

    ridCounter--;
  }

  console.log('Seed complete!');
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
