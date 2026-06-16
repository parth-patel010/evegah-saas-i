'use client';
import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

/* ──────────────────────────────────────────────────────────────
   VEHICLE LIST PAGE  ·  Fleet Catalog & Management
   ────────────────────────────────────────────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.vl-shell{display:flex;min-height:100vh;background:#F3F4F9;font-family:Inter,sans-serif;}
.vl-main{margin-left:240px;display:flex;flex-direction:column;min-height:100vh;width:calc(100% - 240px);}
.vl-page{flex:1;padding:0 28px 60px;}

/* breadcrumb */
.vl-bc{display:flex;align-items:center;gap:6px;padding:14px 0 0;font-size:12px;color:#9CA3AF;}
.vl-bc a{color:#9CA3AF;text-decoration:none;}
.vl-bc a:hover{color:#4F46E5;}
.vl-bc-sep{color:#D1D5DB;}
.vl-bc-cur{color:#4F46E5;font-weight:600;}

/* Header Title row */
.vl-title-row{display:flex;align-items:flex-start;justify-content:space-between;margin:12px 0 18px;gap:16px;}
.vl-h1{font-size:22px;font-weight:800;color:#111827;margin:0 0 4px;}
.vl-sub{font-size:13px;color:#6B7280;margin:0;}
.vl-hdr-actions{display:flex;align-items:center;gap:10px;}
.vl-hdr-btn{display:flex;align-items:center;gap:7px;padding:9px 16px;background:#fff;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;font-weight:600;color:#374151;cursor:pointer;font-family:inherit;box-shadow:0 1px 3px rgba(0,0,0,.06);transition:all .15s;}
.vl-hdr-btn:hover{border-color:#4F46E5;color:#4F46E5;}
.vl-hdr-btn.primary{background:#4F46E5;color:#fff;border-color:#4F46E5;box-shadow:0 2px 6px rgba(79,70,229,.35);}
.vl-hdr-btn.primary:hover{background:#4338CA;color:#fff;border-color:#4338CA;}

/* Stats cards (5 in a row) */
.vl-stats-row{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px;}
.vl-stat-card{background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:12px 14px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,.05);}
.vl-stat-ic{width:36px;height:36px;border-radius:8px;background:#F5F3FF;color:#4F46E5;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.vl-stat-info{min-width:0;flex:1;}
.vl-stat-lbl{font-size:10.5px;color:#9CA3AF;font-weight:600;margin-bottom:2px;}
.vl-stat-val{font-size:18px;font-weight:800;color:#111827;line-height:1;}
.vl-dot{width:7px;height:7px;border-radius:50%;display:inline-block;}
.vl-dot.online{background:#10B981;}
.vl-dot.in_ride{background:#4F46E5;}
.vl-dot.offline{background:#9CA3AF;}
.vl-dot.low_bat{background:#F59E0B;}

/* Search & filter panel */
.vl-filter-card{background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:16px 20px;margin-bottom:20px;box-shadow:0 1px 3px rgba(0,0,0,.04);display:flex;align-items:center;justify-content:between;gap:14px;flex-wrap:wrap;}
.vl-search-input-wrap{flex:1;min-width:260px;position:relative;display:flex;align-items:center;}
.vl-search-ic{position:absolute;left:12px;color:#9CA3AF;display:flex;}
.vl-search-input{width:100%;padding:9px 12px 9px 36px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13.5px;color:#111827;outline:none;background:#F9FAFB;transition:all .15s;font-family:inherit;}
.vl-search-input:focus{border-color:#4F46E5;background:#fff;box-shadow:0 0 0 3px rgba(79,70,229,0.08);}
.vl-filter-grp{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.vl-select{padding:9px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;color:#374151;background:#fff;font-weight:600;cursor:pointer;outline:none;transition:border-color .15s;font-family:inherit;}
.vl-select:focus{border-color:#4F46E5;}

/* List View table */
.vl-table-card{background:#fff;border:1px solid #E5E7EB;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,.06);overflow:hidden;}
.vl-table-wrap{width:100%;overflow-x:auto;}
.vl-table{width:100%;border-collapse:collapse;text-align:left;}
.vl-table th{background:#F9FAFB;padding:14px 18px;font-size:11px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #E5E7EB;}
.vl-table td{padding:14px 18px;font-size:13px;color:#374151;border-bottom:1px solid #F3F4F6;vertical-align:middle;}
.vl-table tr:last-child td{border-bottom:none;}
.vl-table tr:hover td{background:#FAFAFF;}

.vl-veh-cell{display:flex;align-items:center;gap:12px;}
.vl-veh-img-box{width:42px;height:42px;border-radius:8px;background:#F9FAFB;border:1px solid #E5E7EB;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;}
.vl-veh-img{width:100%;height:100%;object-fit:contain;}
.vl-code{font-size:13.5px;font-weight:800;color:#111827;}
.vl-type{font-size:11px;color:#6B7280;margin-top:2px;font-weight:500;}

.vl-badge{font-size:11px;font-weight:700;padding:3px 9px;border-radius:6px;display:inline-block;}
.vl-badge.online{background:#DCFCE7;color:#16A34A;}
.vl-badge.in_ride{background:#E0E7FF;color:#4F46E5;}
.vl-badge.low_bat{background:#FEF3C7;color:#D97706;}
.vl-badge.offline{background:#F3F4F6;color:#6B7280;}

.vl-bat-bar-wrap{display:flex;align-items:center;gap:8px;}
.vl-bat-pct{font-size:12.5px;font-weight:700;color:#111827;width:34px;}
.vl-bat-bar{width:60px;height:6px;background:#E5E7EB;border-radius:3px;overflow:hidden;}
.vl-bat-bar-fill{height:100%;border-radius:3px;}

.vl-actions{display:flex;align-items:center;gap:8px;}
.vl-act-btn{width:30px;height:30px;border-radius:6px;border:1.5px solid #E5E7EB;background:#fff;color:#4B5563;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
.vl-act-btn:hover{color:#4F46E5;border-color:#C7D2FE;background:#F5F3FF;}
.vl-act-link{font-size:12px;font-weight:700;color:#4F46E5;text-decoration:none;}
.vl-act-link:hover{text-decoration:underline;}

/* Pagination */
.vl-pag-row{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-top:1px solid #E5E7EB;}
.vl-pag-lbl{font-size:12px;color:#6B7280;}
.vl-pag-ctrls{display:flex;align-items:center;gap:6px;}
.vl-pag-btn{padding:6px 12px;border:1.5px solid #E5E7EB;border-radius:8px;background:#fff;font-size:12.5px;font-weight:600;color:#374151;cursor:pointer;}
.vl-pag-btn:hover:not(:disabled){border-color:#4F46E5;color:#4F46E5;}
.vl-pag-btn:disabled{opacity:0.5;cursor:not-allowed;}
.vl-pag-num{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12.5px;font-weight:700;cursor:pointer;}
.vl-pag-num.active{background:#4F46E5;color:#fff;}
.vl-pag-num:hover:not(.active){background:#F3F4F6;}
`;

const SI = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const Sv = (p: React.SVGProps<SVGSVGElement> & { s?: number }) => (
  <svg width={p.s || 14} height={p.s || 14} viewBox="0 0 24 24" {...SI} {...p} />
);

const ILocate  = () => <Sv><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></Sv>;
const ISearch  = () => <Sv><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Sv>;
const IScooter = ({ s = 14 }) => <Sv s={s}><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></Sv>;
const ILock    = () => <Sv><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Sv>;
const IUnlock  = () => <Sv><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></Sv>;
const IPlus    = () => <Sv><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Sv>;
const IFilter  = () => <Sv><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></Sv>;

interface EVListItem {
  code: string;
  type: string;
  battery: number;
  speed: number;
  status: 'Online' | 'Offline' | 'Low Battery' | 'In Ride';
  badgeCls: string;
  renter: string;
  hub: string;
  lastSeen: string;
  imgSrc: string;
}

const VEHICLES_MOCK: EVListItem[] = [
  { code: 'EV-12KA-1234', type: 'Electric Scooter', battery: 78, speed: 25, status: 'In Ride', badgeCls: 'in_ride', renter: 'Rahul Sharma', hub: 'Palika Bazaar Hub', lastSeen: 'Just now', imgSrc: '/assets/v1.webp' },
  { code: 'EV-12KA-5678', type: 'Electric Scooter', battery: 92, speed: 0, status: 'Online', badgeCls: 'online', renter: 'None (Available)', hub: 'Karol Bagh Hub', lastSeen: '2 mins ago', imgSrc: '/assets/v2.webp' },
  { code: 'EV-12KA-6789', type: 'Electric Scooter', battery: 12, speed: 12, status: 'Low Battery', badgeCls: 'low_bat', renter: 'Pooja Kapoor', hub: 'Rajendra Place Hub', lastSeen: '1 min ago', imgSrc: '/assets/v1.webp' },
  { code: 'EV-12KA-9012', type: 'Electric Scooter', battery: 45, speed: 0, status: 'Offline', badgeCls: 'offline', renter: 'None (Available)', hub: 'Nehru Place Hub', lastSeen: '15 mins ago', imgSrc: '/assets/v2.webp' },
  { code: 'EV-12KA-3456', type: 'Electric Scooter', battery: 64, speed: 32, status: 'In Ride', badgeCls: 'in_ride', renter: 'Neha Singh', hub: 'Janpath Hub', lastSeen: 'Just now', imgSrc: '/assets/v1.webp' },
  { code: 'EV-ER-0098', type: 'E-Rickshaw', battery: 88, speed: 0, status: 'Online', badgeCls: 'online', renter: 'None (Available)', hub: 'Connaught Place Hub', lastSeen: '5 mins ago', imgSrc: '/assets/v2.webp' },
  { code: 'EV-ER-0077', type: 'E-Rickshaw', battery: 18, speed: 10, status: 'Low Battery', badgeCls: 'low_bat', renter: 'Manoj Yadav', hub: 'Karol Bagh Hub', lastSeen: 'Just now', imgSrc: '/assets/v1.webp' },
  { code: 'EV-12KA-8877', type: 'Electric Scooter', battery: 98, speed: 0, status: 'Online', badgeCls: 'online', renter: 'None (Available)', hub: 'Dwarka Sector 10 Hub', lastSeen: '12 mins ago', imgSrc: '/assets/v2.webp' }
];

export default function VehicleListPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = VEHICLES_MOCK.filter(v => {
    const matchesSearch = v.code.toLowerCase().includes(search.toLowerCase()) || v.renter.toLowerCase().includes(search.toLowerCase()) || v.hub.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    const matchesType = typeFilter === 'All' || v.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="vl-shell">
        <Sidebar activePath="/vehicles/all" />
        <div className="vl-main">
          <TopBar />
          <div className="vl-page">

            {/* Breadcrumb */}
            <div className="vl-bc">
              <Link href="/">Home</Link>
              <span className="vl-bc-sep">›</span>
              <a href="#">Vehicles</a>
              <span className="vl-bc-sep">›</span>
              <span className="vl-bc-cur">Vehicle List</span>
            </div>

            {/* Title Row */}
            <div className="vl-title-row">
              <div>
                <h1 className="vl-h1">Vehicle List</h1>
                <p className="vl-sub">Monitor stats, manage locks, and view details for all fleet assets.</p>
              </div>
              <div className="vl-hdr-actions">
                <button className="vl-hdr-btn primary"><IPlus/> Add Vehicle</button>
              </div>
            </div>

            {/* Metric KPI cards */}
            <div className="vl-stats-row">
              {[
                { lbl: 'Total Vehicles', val: 120, ic: <IScooter s={16}/> },
                { lbl: 'Online', val: 72, dot: 'online' },
                { lbl: 'In Ride', val: 18, dot: 'in_ride' },
                { lbl: 'Offline', val: 28, dot: 'offline' },
                { lbl: 'Low Battery', val: 8, dot: 'low_bat' }
              ].map(s => (
                <div className="vl-stat-card" key={s.lbl}>
                  <div className="vl-stat-ic">
                    {s.ic ? s.ic : <div className={`vl-dot ${s.dot}`}/>}
                  </div>
                  <div className="vl-stat-info">
                    <div className="vl-stat-lbl">{s.lbl}</div>
                    <div className="vl-stat-val">{s.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search and filter panel */}
            <div className="vl-filter-card">
              <div className="vl-search-input-wrap">
                <span className="vl-search-ic"><ISearch/></span>
                <input 
                  type="text" 
                  className="vl-search-input" 
                  placeholder="Search by Code, Renter name, or Hub..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="vl-filter-grp">
                <select 
                  className="vl-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Online">Online</option>
                  <option value="In Ride">In Ride</option>
                  <option value="Low Battery">Low Battery</option>
                  <option value="Offline">Offline</option>
                </select>

                <select 
                  className="vl-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="All">All Types</option>
                  <option value="Electric Scooter">Electric Scooters</option>
                  <option value="E-Rickshaw">E-Rickshaws</option>
                </select>

                <button className="vl-hdr-btn"><IFilter/> Advanced</button>
              </div>
            </div>

            {/* List View Table */}
            <div className="vl-table-card">
              <div className="vl-table-wrap">
                <table className="vl-table">
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Status</th>
                      <th>Battery</th>
                      <th>Speed</th>
                      <th>Hub Location / Renter</th>
                      <th>Last Seen</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(v => {
                      const barColor = v.battery < 20 ? '#EF4444' : v.battery < 50 ? '#F59E0B' : '#10B981';
                      return (
                        <tr key={v.code}>
                          <td>
                            <div className="vl-veh-cell">
                              <div className="vl-veh-img-box">
                                <img src={v.imgSrc} alt={v.code} className="vl-veh-img" />
                              </div>
                              <div>
                                <div className="vl-code">{v.code}</div>
                                <div className="vl-type">{v.type}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`vl-badge ${v.badgeCls}`}>{v.status}</span>
                          </td>
                          <td>
                            <div className="vl-bat-bar-wrap">
                              <span className="vl-bat-pct">{v.battery}%</span>
                              <div className="vl-bat-bar">
                                <div className="vl-bat-bar-fill" style={{ width: `${v.battery}%`, background: barColor }} />
                              </div>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600 }}>{v.speed} km/h</span>
                          </td>
                          <td>
                            <div>
                              <div style={{ fontWeight: 600, color: '#111827' }}>{v.hub}</div>
                              {v.renter !== 'None (Available)' && (
                                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Renter: {v.renter}</div>
                              )}
                            </div>
                          </td>
                          <td style={{ color: '#6B7280', fontWeight: 500 }}>
                            {v.lastSeen}
                          </td>
                          <td>
                            <div className="vl-actions" style={{ justifyContent: 'flex-end' }}>
                              <button className="vl-act-btn" title="Lock"><ILock/></button>
                              <button className="vl-act-btn" title="Unlock"><IUnlock/></button>
                              <Link href="/vehicles/map" className="vl-act-btn" title="Locate on Map">
                                <ILocate/>
                              </Link>
                              <Link href="/vehicles/map" className="vl-act-link" style={{ marginLeft: 6 }}>
                                Details
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '36px 0', color: '#9CA3AF', fontWeight: 600 }}>
                          No vehicles found matching the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="vl-pag-row">
                <span className="vl-pag-lbl">Showing 1 to {filtered.length} of {filtered.length} entries</span>
                <div className="vl-pag-ctrls">
                  <button className="vl-pag-btn" disabled>Previous</button>
                  <div className="vl-pag-num active">1</div>
                  <button className="vl-pag-btn" disabled>Next</button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
