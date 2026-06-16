'use client';
import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

/* ──────────────────────────────────────────────────────────────
   ACTIVE RIDES PAGE  ·  Real-Time Ride Operations
   ────────────────────────────────────────────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.ar-shell{display:flex;min-height:100vh;background:#F3F4F9;font-family:Inter,sans-serif;}
.ar-main{margin-left:240px;display:flex;flex-direction:column;min-height:100vh;width:calc(100% - 240px);}
.ar-page{flex:1;padding:0 28px 60px;}

/* breadcrumb */
.ar-bc{display:flex;align-items:center;gap:6px;padding:14px 0 0;font-size:12px;color:#9CA3AF;}
.ar-bc a{color:#9CA3AF;text-decoration:none;}
.ar-bc a:hover{color:#4F46E5;}
.ar-bc-sep{color:#D1D5DB;}
.ar-bc-cur{color:#4F46E5;font-weight:600;}

/* Header Title row */
.ar-title-row{display:flex;align-items:flex-start;justify-content:space-between;margin:12px 0 18px;gap:16px;}
.ar-h1{font-size:22px;font-weight:800;color:#111827;margin:0 0 4px;}
.ar-sub{font-size:13px;color:#6B7280;margin:0;}
.ar-hdr-actions{display:flex;align-items:center;gap:10px;}
.ar-hdr-btn{display:flex;align-items:center;gap:7px;padding:9px 16px;background:#fff;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;font-weight:600;color:#374151;cursor:pointer;font-family:inherit;box-shadow:0 1px 3px rgba(0,0,0,.06);transition:all .15s;}
.ar-hdr-btn:hover{border-color:#4F46E5;color:#4F46E5;}

/* Stats cards (5 in a row) */
.ar-stats-row{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px;}
.ar-stat-card{background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:12px 14px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,.05);}
.ar-stat-ic{width:36px;height:36px;border-radius:8px;background:#F5F3FF;color:#4F46E5;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.ar-stat-info{min-width:0;flex:1;}
.ar-stat-lbl{font-size:10.5px;color:#9CA3AF;font-weight:600;margin-bottom:2px;}
.ar-stat-val{font-size:18px;font-weight:800;color:#111827;line-height:1;}
.ar-dot{width:7px;height:7px;border-radius:50%;display:inline-block;}
.ar-dot.online{background:#10B981;}
.ar-dot.in_ride{background:#4F46E5;}
.ar-dot.warning{background:#F59E0B;}
.ar-dot.danger{background:#EF4444;}

/* Search & filters */
.ar-filter-card{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:16px 20px;margin-bottom:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);display:flex;align-items:center;justify-content:between;gap:14px;flex-wrap:wrap;}
.ar-search-input-wrap{flex:1;min-width:260px;position:relative;display:flex;align-items:center;}
.ar-search-ic{position:absolute;left:12px;color:#9CA3AF;display:flex;}
.ar-search-input{width:100%;padding:9px 12px 9px 36px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13.5px;color:#111827;outline:none;background:#F9FAFB;transition:all .15s;font-family:inherit;}
.ar-search-input:focus{border-color:#4F46E5;background:#fff;box-shadow:0 0 0 3px rgba(79,70,229,0.08);}
.ar-filter-grp{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.ar-select{padding:9px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;color:#374151;background:#fff;font-weight:600;cursor:pointer;outline:none;transition:border-color .15s;font-family:inherit;}
.ar-select:focus{border-color:#4F46E5;}

/* Rides Grid */
.ar-rides-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:20px;}
.ar-ride-card{background:#fff;border:1px solid #E5E7EB;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,.05);display:flex;flex-direction:column;overflow:hidden;transition:transform .15s, box-shadow .15s;}
.ar-ride-card:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.08);border-color:#C7D2FE;}
.ar-card-hdr{padding:16px 20px;border-bottom:1px solid #F3F4F6;display:flex;align-items:center;justify-content:space-between;}
.ar-card-body{padding:18px 20px;flex:1;display:flex;flex-direction:column;gap:14px;}
.ar-card-ftr{padding:12px 20px;border-top:1px solid #F3F4F6;background:#F9FAFB;display:flex;align-items:center;justify-content:space-between;gap:8px;}

/* Renter details */
.ar-renter-row{display:flex;align-items:center;gap:12px;}
.ar-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;}
.ar-renter-name{font-size:13.5px;font-weight:700;color:#111827;}
.ar-ride-id{font-size:11px;color:#6B7280;margin-top:1px;}

.ar-badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:5px;}
.ar-badge.in_ride{background:#DCFCE7;color:#16A34A;}
.ar-badge.warning{background:#FEF3C7;color:#D97706;}
.ar-badge.danger{background:#FEE2E2;color:#EF4444;}

/* Vehicle brief */
.ar-veh-brief{display:flex;align-items:center;gap:10px;background:#F9FAFB;border-radius:8px;padding:8px 12px;border:1px solid #E5E7EB;}
.ar-veh-img-box{width:34px;height:34px;border-radius:6px;background:#fff;border:1px solid #E5E7EB;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;}
.ar-veh-img{width:100%;height:100%;object-fit:contain;}
.ar-veh-code{font-size:12.5px;font-weight:800;color:#111827;}
.ar-veh-type{font-size:10.5px;color:#6B7280;}

/* Route timeline */
.ar-route{display:flex;flex-direction:column;gap:8px;position:relative;padding-left:14px;}
.ar-route::before{content:'';position:absolute;left:3px;top:6px;bottom:6px;width:1.5px;background:#E5E7EB;border-style:dashed;}
.ar-route-node{display:flex;justify-content:space-between;align-items:center;font-size:12px;position:relative;}
.ar-route-node::before{content:'';position:absolute;left:-14px;top:5px;width:7px;height:7px;border-radius:50%;border:1.5px solid #fff;box-shadow:0 1px 2px rgba(0,0,0,.15);z-index:2;}
.ar-route-node.start::before{background:#10B981;}
.ar-route-node.end::before{background:#4F46E5;}
.ar-route-lbl{color:#6B7280;}
.ar-route-val{font-weight:600;color:#111827;}

/* Metrics grid */
.ar-metrics-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;border-top:1px solid #F3F4F6;padding-top:12px;}
.ar-metric-box{display:flex;flex-direction:column;gap:2px;}
.ar-metric-lbl{font-size:10px;color:#9CA3AF;font-weight:600;}
.ar-metric-val{font-size:12px;font-weight:700;color:#111827;}

/* Actions */
.ar-btn{padding:7px 12px;border:1.5px solid #E5E7EB;border-radius:8px;background:#fff;font-size:11.5px;font-weight:700;color:#4B5563;cursor:pointer;display:flex;align-items:center;gap:5px;transition:all .15s;font-family:inherit;}
.ar-btn:hover{color:#4F46E5;border-color:#C7D2FE;background:#F5F3FF;}
.ar-btn.danger-action:hover{color:#EF4444;border-color:#FCA5A5;background:#FEF2F2;}
.ar-link{font-size:12px;font-weight:700;color:#4F46E5;text-decoration:none;display:flex;align-items:center;gap:4px;}
.ar-link:hover{text-decoration:underline;}
`;

const SI = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const Sv = (p: React.SVGProps<SVGSVGElement> & { s?: number }) => (
  <svg width={p.s || 14} height={p.s || 14} viewBox="0 0 24 24" {...SI} {...p} />
);

const ILocate   = () => <Sv><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></Sv>;
const ISearch   = () => <Sv><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Sv>;
const ICalendar = () => <Sv><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Sv>;
const IScooter  = ({ s = 14 }) => <Sv s={s}><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></Sv>;
const IMsg      = () => <Sv><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Sv>;
const IRefresh  = () => <Sv><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></Sv>;
const ITrend    = ({ s = 14 }) => <Sv s={s}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></Sv>;
const IClock    = ({ s = 14 }) => <Sv s={s}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Sv>;
const IAlert    = () => <Sv><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></Sv>;

interface ActiveRideItem {
  rideId: string;
  renter: string;
  code: string;
  type: string;
  pickup: string;
  destination: string;
  distance: string;
  duration: string;
  speed: number;
  battery: number;
  fare: string;
  status: 'Normal' | 'Warning' | 'Critical';
  badgeCls: string;
  alertMsg?: string;
  imgSrc: string;
}

const ACTIVE_RIDES_MOCK: ActiveRideItem[] = [
  { rideId: 'RID-2024-5678', renter: 'Rahul Sharma', code: 'EV-12KA-1234', type: 'Electric Scooter', pickup: 'Palika Bazaar, CP', destination: 'Pragati Maidan Gate 1', distance: '5.2 km', duration: '18 mins', speed: 25, battery: 78, fare: '₹124.00', status: 'Normal', badgeCls: 'in_ride', imgSrc: '/assets/v1.webp' },
  { rideId: 'RID-2024-3412', renter: 'Pooja Kapoor', code: 'EV-12KA-6789', type: 'Electric Scooter', pickup: 'Rajendra Place', destination: 'Lajpat Nagar', distance: '9.4 km', duration: '35 mins', speed: 12, battery: 12, fare: '₹210.00', status: 'Warning', badgeCls: 'warning', alertMsg: 'Low battery warning (12%)', imgSrc: '/assets/v1.webp' },
  { rideId: 'RID-2024-1122', renter: 'Neha Singh', code: 'EV-12KA-3456', type: 'Electric Scooter', pickup: 'Janpath', destination: 'Supreme Court', distance: '3.2 km', duration: '11 mins', speed: 35, battery: 64, fare: '₹78.00', status: 'Critical', badgeCls: 'danger', alertMsg: 'Speed Limit Exceeded (35 km/h)', imgSrc: '/assets/v1.webp' },
  { rideId: 'RID-2024-9087', renter: 'Abhishek Yadav', code: 'EV-ER-0077', type: 'E-Rickshaw', pickup: 'Karol Bagh Metro', destination: 'Paharganj Gate 2', distance: '4.8 km', duration: '22 mins', speed: 10, battery: 18, fare: '₹95.00', status: 'Warning', badgeCls: 'warning', alertMsg: 'Low battery warning (18%)', imgSrc: '/assets/v1.webp' },
  { rideId: 'RID-2024-4456', renter: 'Vikram Malhotra', code: 'EV-12KA-8877', type: 'Electric Scooter', pickup: 'Dwarka Sector 10', destination: 'Sector 21 Metro', distance: '6.1 km', duration: '24 mins', speed: 22, battery: 98, fare: '₹145.00', status: 'Normal', badgeCls: 'in_ride', imgSrc: '/assets/v2.webp' }
];

export default function ActiveRidesPage() {
  const [search, setSearch] = useState('');
  const [alertFilter, setAlertFilter] = useState('All');

  const filtered = ACTIVE_RIDES_MOCK.filter(r => {
    const matchesSearch = r.renter.toLowerCase().includes(search.toLowerCase()) || r.rideId.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase());
    const matchesAlert = alertFilter === 'All' || (alertFilter === 'Warning' && r.status !== 'Normal') || (alertFilter === 'Normal' && r.status === 'Normal');
    return matchesSearch && matchesAlert;
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ar-shell">
        <Sidebar activePath="/vehicles/active" />
        <div className="ar-main">
          <TopBar />
          <div className="ar-page">

            {/* Breadcrumb */}
            <div className="ar-bc">
              <Link href="/">Home</Link>
              <span className="ar-bc-sep">›</span>
              <a href="#">Vehicles</a>
              <span className="ar-bc-sep">›</span>
              <span className="ar-bc-cur">Active Rides</span>
            </div>

            {/* Title Row */}
            <div className="ar-title-row">
              <div>
                <h1 className="ar-h1">Active Rides</h1>
                <p className="ar-sub">Live monitoring of all rides currently in progress across the city.</p>
              </div>
              <div className="ar-hdr-actions">
                <button className="ar-hdr-btn"><IRefresh/> Refresh Live</button>
              </div>
            </div>

            {/* Metric KPI cards */}
            <div className="ar-stats-row">
              {[
                { lbl: 'Active Rides', val: 18, dot: 'in_ride' },
                { lbl: 'Avg Speed', val: '22 km/h', ic: <ITrend s={16}/> },
                { lbl: 'Avg Duration', val: '18 mins', ic: <IClock s={16}/> },
                { lbl: 'Active Alerts', val: 3, dot: 'danger' },
                { lbl: 'Total Live Fare', val: '₹652.00', dot: 'online' }
              ].map(s => (
                <div className="ar-stat-card" key={s.lbl}>
                  <div className="ar-stat-ic">
                    {s.ic ? s.ic : <div className={`ar-dot ${s.dot}`}/>}
                  </div>
                  <div className="ar-stat-info">
                    <div className="ar-stat-lbl">{s.lbl}</div>
                    <div className="ar-stat-val">{s.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search and filters */}
            <div className="ar-filter-card">
              <div className="ar-search-input-wrap">
                <span className="ar-search-ic"><ISearch/></span>
                <input 
                  type="text" 
                  className="ar-search-input" 
                  placeholder="Search by Ride ID, Renter name, or Scooter Code..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="ar-filter-grp">
                <select 
                  className="ar-select"
                  value={alertFilter}
                  onChange={(e) => setAlertFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Normal">Normal Status</option>
                  <option value="Warning">With Active Alerts</option>
                </select>
              </div>
            </div>

            {/* Active rides grid */}
            <div className="ar-rides-grid">
              {filtered.map(r => {
                const initials = r.renter.split(' ').map(n=>n[0]).join('');
                return (
                  <div className="ar-ride-card" key={r.rideId}>
                    {/* Header */}
                    <div className="ar-card-hdr">
                      <div className="ar-renter-row">
                        <div className="ar-avatar">{initials}</div>
                        <div>
                          <div className="ar-renter-name">{r.renter}</div>
                          <div className="ar-ride-id">{r.rideId}</div>
                        </div>
                      </div>
                      <span className={`ar-badge ${r.badgeCls}`}>
                        {r.status === 'Normal' ? 'In Ride' : r.status === 'Warning' ? 'Warning' : 'Critical'}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="ar-card-body">
                      {/* Alert banner if exists */}
                      {r.alertMsg && (
                        <div style={{ 
                          background: r.status === 'Critical' ? '#FEF2F2' : '#FFFBEB', 
                          border: `1px solid ${r.status === 'Critical' ? '#FCA5A5' : '#FDE68A'}`,
                          borderRadius: 8,
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: r.status === 'Critical' ? '#EF4444' : '#D97706'
                        }}>
                          <IAlert/> {r.alertMsg}
                        </div>
                      )}

                      {/* Vehicle summary */}
                      <div className="ar-veh-brief">
                        <div className="ar-veh-img-box">
                          <img src={r.imgSrc} alt={r.code} className="ar-veh-img" />
                        </div>
                        <div>
                          <div className="ar-veh-code">{r.code}</div>
                          <div className="ar-veh-type">{r.type}</div>
                        </div>
                      </div>

                      {/* Route timeline */}
                      <div className="ar-route">
                        <div className="ar-route-node start">
                          <span className="ar-route-lbl">Pickup</span>
                          <span className="ar-route-val">{r.pickup}</span>
                        </div>
                        <div className="ar-route-node end">
                          <span className="ar-route-lbl">Current Loc.</span>
                          <span className="ar-route-val">{r.destination}</span>
                        </div>
                      </div>

                      {/* Metrics block */}
                      <div className="ar-metrics-grid">
                        <div className="ar-metric-box">
                          <span className="ar-metric-lbl">Speed</span>
                          <span className="ar-metric-val" style={{ color: r.speed > 30 ? '#EF4444' : '#111827' }}>{r.speed} km/h</span>
                        </div>
                        <div className="ar-metric-box">
                          <span className="ar-metric-lbl">Battery</span>
                          <span className="ar-metric-val" style={{ color: r.battery < 20 ? '#EF4444' : '#111827' }}>{r.battery}%</span>
                        </div>
                        <div className="ar-metric-box">
                          <span className="ar-metric-lbl">Est. Fare</span>
                          <span className="ar-metric-val" style={{ color: '#4F46E5' }}>{r.fare}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="ar-card-ftr">
                      <Link href="/vehicles/map" className="ar-link">
                        <ILocate/> View Map
                      </Link>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="ar-btn" title="Send Message to Rider"><IMsg/></button>
                        <button className="ar-btn danger-action" style={{ color: '#EF4444' }}>End Ride</button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '48px 0', color: '#9CA3AF', fontWeight: 600 }}>
                  No active rides found.
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
