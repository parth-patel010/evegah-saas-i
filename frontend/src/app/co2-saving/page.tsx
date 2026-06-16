"use client";
import { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
.co-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', sans-serif; }
.co-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.co-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

/* Breadcrumb */
.co-bc { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #64748B; font-weight: 500; }
.co-bc a { color: #64748B; text-decoration: none; }
.co-bc a:hover { color: #10B981; }
.co-bc-sep { color: #94A3B8; }
.co-bc-cur { color: #10B981; font-weight: 600; }

/* Header title */
.co-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.co-h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 4px; letter-spacing: -0.02em; }
.co-sub { font-size: 13px; color: #64748B; margin: 0; }

.co-actions { display: flex; align-items: center; gap: 10px; }
.co-btn { display: flex; align-items: center; gap: 7px; padding: 9px 16px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all .15s; }
.co-btn:hover { border-color: #10B981; color: #10B981; }
.co-btn-primary { background: #10B981; color: #fff; border-color: #10B981; }
.co-btn-primary:hover { background: #059669; border-color: #059669; color: #fff; }

/* KPI Grid */
.co-stats-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.co-stat-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.co-stat-ic { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; }
.ic-green { background: #ECFDF5; color: #10B981; }
.ic-emerald { background: #D1FAE5; color: #065F46; }
.ic-blue { background: #EFF6FF; color: #2563EB; }
.ic-orange { background: #FFF7ED; color: #EA580C; }
.ic-purple { background: #FAF5FF; color: #7C3AED; }

.co-stat-info { min-width: 0; flex: 1; }
.co-stat-lbl { font-size: 11px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 2px; }
.co-stat-val { font-size: 22px; font-weight: 800; color: #0F172A; line-height: 1; }
.co-stat-sub { font-size: 11px; color: #64748B; font-weight: 500; margin-top: 4px; }

/* Layout Grid */
.co-dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
.co-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.02); display: flex; flex-direction: column; gap: 14px; }
.co-card-hdr { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px; }
.co-card-tit { font-size: 14px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.03em; display: flex; align-items: center; gap: 6px; }

/* Charts container */
.co-charts-split { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; }
.co-chart-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 200px; position: relative; }

/* Progress bar list */
.co-progress-list { display: flex; flex-direction: column; gap: 12px; }
.co-prog-item { display: flex; flex-direction: column; gap: 4px; }
.co-prog-labels { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; color: #374151; }
.co-prog-bar-bg { width: 100%; height: 8px; background: #F1F5F9; border-radius: 4px; overflow: hidden; }
.co-prog-bar-val { height: 100%; background: linear-gradient(90deg, #10B981, #34D399); border-radius: 4px; transition: width 0.3s; }

/* Checklist */
.co-chk-list { display: flex; flex-direction: column; gap: 10px; }
.co-chk-item { display: flex; gap: 10px; align-items: flex-start; font-size: 12.5px; color: #475569; line-height: 1.4; }
.co-chk-ic { color: #10B981; font-weight: 800; display: flex; align-items: center; justify-content: center; margin-top: 2px; }

/* Table and Filters */
.co-filter-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #FAFBFD; border-bottom: 1px solid #E2E8F0; border-radius: 10px 10px 0 0; gap: 12px; }
.co-search-wrap { position: relative; width: 240px; }
.co-search-inp { width: 100%; padding: 6px 10px 6px 30px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12.5px; outline: none; }
.co-search-inp:focus { border-color: #10B981; }
.co-search-ic { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #94A3B8; }
.co-select { padding: 6px 10px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12.5px; outline: none; background: #fff; cursor: pointer; }
.co-select:focus { border-color: #10B981; }

.co-tcard { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); overflow: hidden; }
.co-table { width: 100%; border-collapse: collapse; }
.co-table th { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .06em; text-align: left; padding: 12px 16px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; }
.co-table td { padding: 12px 16px; font-size: 13px; color: #334155; border-bottom: 1px solid #F1F5F9; }
.co-table tr:hover td { background: #F8FAFC; }

.pill-verified { background: #DCFCE7; color: #16A34A; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; border: 1px solid #BBF7D0; }
.pill-pending { background: #FEF3C7; color: #D97706; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; border: 1px solid #FDE68A; }

.co-footer-bar { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-top: 1px solid #E2E8F0; background: #FAFBFD; border-radius: 0 0 14px 14px; font-size: 12px; }
.co-pagination { display: flex; align-items: center; gap: 4px; }
.co-pg-btn { width: 26px; height: 26px; border: 1.2px solid #E2E8F0; border-radius: 6px; background: #fff; font-size: 11.5px; font-weight: 600; color: #475569; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .12s; }
.co-pg-btn:hover:not(:disabled) { border-color: #10B981; color: #10B981; }
.co-pg-btn.active { background: #10B981; color: #fff; border-color: #10B981; }
.co-pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* Custom feedback toast alert */
.co-toast { position: fixed; bottom: 24px; right: 24px; background: #0F172A; color: #fff; padding: 12px 20px; border-radius: 10px; display: flex; align-items: center; gap: 10px; font-size: 12.5px; font-weight: 600; z-index: 300; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); animation: co-slideup 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
.co-toast-green { border-left: 4px solid #10B981; }

@keyframes co-slideup { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;

interface CarbonLog {
  date: string;
  vehicleCount: number;
  swaps: number;
  distance: string;
  fuelSaved: number;
  co2Saved: number;
  status: 'Verified' | 'Pending';
}

const INITIAL_LOGS: CarbonLog[] = [
  { date: '20 May 2024', vehicleCount: 84, swaps: 342, distance: '5,840 km', fuelSaved: 264, co2Saved: 618, status: 'Verified' },
  { date: '19 May 2024', vehicleCount: 82, swaps: 330, distance: '5,680 km', fuelSaved: 258, co2Saved: 604, status: 'Verified' },
  { date: '18 May 2024', vehicleCount: 79, swaps: 312, distance: '5,290 km', fuelSaved: 241, co2Saved: 563, status: 'Verified' },
  { date: '17 May 2024', vehicleCount: 85, swaps: 350, distance: '6,120 km', fuelSaved: 278, co2Saved: 651, status: 'Verified' },
  { date: '16 May 2024', vehicleCount: 75, swaps: 298, distance: '5,010 km', fuelSaved: 227, co2Saved: 532, status: 'Verified' },
  { date: '15 May 2024', vehicleCount: 78, swaps: 306, distance: '5,180 km', fuelSaved: 235, co2Saved: 550, status: 'Verified' },
  { date: '14 May 2024', vehicleCount: 70, swaps: 280, distance: '4,850 km', fuelSaved: 220, co2Saved: 515, status: 'Verified' },
];

export default function Co2SavingPage() {
  const [logs, setLogs] = useState<CarbonLog[]>(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  const triggerToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchSearch = searchQuery === '' || log.date.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === '' || log.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [logs, searchQuery, statusFilter]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * 5;
    return filteredLogs.slice(start, start + 5);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / 5) || 1;

  // Stats calculation
  const totalCo2Saved = useMemo(() => logs.reduce((acc, l) => acc + l.co2Saved, 154820), [logs]);
  const totalTreesPlanted = Math.round(totalCo2Saved / 25);
  const totalCarsOffRoad = Math.round(totalCo2Saved / 4100);
  const totalFuelSaved = useMemo(() => logs.reduce((acc, l) => acc + l.fuelSaved, 65880), [logs]);
  const totalSwaps = 12854;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="co-shell">
        <Sidebar activePath="/co2-saving" />
        <div className="co-main">
          <TopBar />
          <div className="co-page">
            {/* Breadcrumb */}
            <div className="co-bc">
              <a href="/">Dashboard</a>
              <span className="co-bc-sep">/</span>
              <span className="co-bc-sep">Reports</span>
              <span className="co-bc-sep">/</span>
              <span className="co-bc-cur">CO2 Saving</span>
            </div>

            {/* Title & Actions */}
            <div className="co-title-row">
              <div>
                <h1 className="co-h1">CO2 Saving Dashboard</h1>
                <p className="co-sub">Track real-time environmental impact, carbon offsets, and equivalent ecological parameters.</p>
              </div>
              <div className="co-actions">
                <button className="co-btn" onClick={() => triggerToast('Environmental impact report downloaded')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Export Report
                </button>
                <button className="co-btn-primary co-btn" onClick={() => {
                  const newDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                  const newLog: CarbonLog = {
                    date: newDate,
                    vehicleCount: 88,
                    swaps: 360,
                    distance: '6,450 km',
                    fuelSaved: 293,
                    co2Saved: 686,
                    status: 'Verified'
                  };
                  setLogs([newLog, ...logs]);
                  setCurrentPage(1);
                  triggerToast(`Log entry added for ${newDate}!`);
                }}>
                  + Add Daily Entry
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="co-stats-row">
              <div className="co-stat-card">
                <div className="co-stat-ic ic-green">🍀</div>
                <div className="co-stat-info">
                  <span className="co-stat-lbl">Total CO2 Saved</span>
                  <div className="co-stat-val">{totalCo2Saved.toLocaleString()} kg</div>
                  <div className="co-stat-sub">Carbon offset YTD</div>
                </div>
              </div>
              <div className="co-stat-card">
                <div className="co-stat-ic ic-emerald">🌳</div>
                <div className="co-stat-info">
                  <span className="co-stat-lbl">Trees Equivalent</span>
                  <div className="co-stat-val">{totalTreesPlanted.toLocaleString()}</div>
                  <div className="co-stat-sub">Yearly tree absorption</div>
                </div>
              </div>
              <div className="co-stat-card">
                <div className="co-stat-ic ic-blue">🚗</div>
                <div className="co-stat-info">
                  <span className="co-stat-lbl">Cars Off Road</span>
                  <div className="co-stat-val">{totalCarsOffRoad}</div>
                  <div className="co-stat-sub">Passenger car emissions/yr</div>
                </div>
              </div>
              <div className="co-stat-card">
                <div className="co-stat-ic ic-orange">⛽</div>
                <div className="co-stat-info">
                  <span className="co-stat-lbl">Fuel Avoided</span>
                  <div className="co-stat-val">{totalFuelSaved.toLocaleString()} L</div>
                  <div className="co-stat-sub">Petrol/Diesel offset</div>
                </div>
              </div>
              <div className="co-stat-card">
                <div className="co-stat-ic ic-purple">⚡</div>
                <div className="co-stat-info">
                  <span className="co-stat-lbl">Swaps Contributed</span>
                  <div className="co-stat-val">{totalSwaps.toLocaleString()}</div>
                  <div className="co-stat-sub">Battery swaps logged</div>
                </div>
              </div>
            </div>

            {/* Dashboard Graphics */}
            <div className="co-dashboard-grid">
              <div className="co-card">
                <div className="co-card-hdr">
                  <h3 className="co-card-tit">CO2 Saved Trend & Sources</h3>
                </div>

                <div className="co-charts-split">
                  {/* Line Chart */}
                  <div className="co-chart-wrap">
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', position: 'absolute', top: 0, left: 0 }}>CO2 Saved Over Time (kg)</span>
                    <svg width="100%" height="180" viewBox="0 0 300 150" style={{ overflow: 'visible', marginTop: '20px' }}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="20" y1="10" x2="280" y2="10" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="20" y1="40" x2="280" y2="40" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="20" y1="70" x2="280" y2="70" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="20" y1="100" x2="280" y2="100" stroke="#F1F5F9" strokeWidth="1" />
                      <line x1="20" y1="130" x2="280" y2="130" stroke="#CBD5E1" strokeWidth="1.5" />

                      {/* Area */}
                      <path d="M 20 130 L 20 90 L 72 100 L 124 85 L 176 65 L 228 50 L 280 40 L 280 130 Z" fill="url(#areaGrad)" />

                      {/* Trend Line */}
                      <path d="M 20 90 L 72 100 L 124 85 L 176 65 L 228 50 L 280 40" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />

                      {/* Dots */}
                      <circle cx="20" cy="90" r="4" fill="#fff" stroke="#10B981" strokeWidth="2" />
                      <circle cx="72" cy="100" r="4" fill="#fff" stroke="#10B981" strokeWidth="2" />
                      <circle cx="124" cy="85" r="4" fill="#fff" stroke="#10B981" strokeWidth="2" />
                      <circle cx="176" cy="65" r="4" fill="#fff" stroke="#10B981" strokeWidth="2" />
                      <circle cx="228" cy="50" r="4" fill="#fff" stroke="#10B981" strokeWidth="2" />
                      <circle cx="280" cy="40" r="4" fill="#fff" stroke="#10B981" strokeWidth="2" />

                      {/* Labels */}
                      <text x="20" y="145" fontSize="8.5" fill="#64748B" textAnchor="middle" fontWeight="600">Jan</text>
                      <text x="72" y="145" fontSize="8.5" fill="#64748B" textAnchor="middle" fontWeight="600">Feb</text>
                      <text x="124" y="145" fontSize="8.5" fill="#64748B" textAnchor="middle" fontWeight="600">Mar</text>
                      <text x="176" y="145" fontSize="8.5" fill="#64748B" textAnchor="middle" fontWeight="600">Apr</text>
                      <text x="228" y="145" fontSize="8.5" fill="#64748B" textAnchor="middle" fontWeight="600">May</text>
                      <text x="280" y="145" fontSize="8.5" fill="#64748B" textAnchor="middle" fontWeight="600">Jun</text>

                      <text x="15" y="12" fontSize="8" fill="#94A3B8" textAnchor="end" fontWeight="600">1.2k</text>
                      <text x="15" y="72" fontSize="8" fill="#94A3B8" textAnchor="end" fontWeight="600">800</text>
                      <text x="15" y="132" fontSize="8" fill="#94A3B8" textAnchor="end" fontWeight="600">0</text>
                    </svg>
                  </div>

                  {/* Donut Chart */}
                  <div className="co-chart-wrap" style={{ borderLeft: '1px solid #F1F5F9', paddingLeft: '20px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', alignSelf: 'flex-start' }}>CO2 Saved by Source</span>
                    <svg width="120" height="120" viewBox="0 0 36 36" style={{ marginTop: '10px' }}>
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                      {/* Segment 1: Rented Rides 60% */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="60 40" strokeDashoffset="25" />
                      {/* Segment 2: Hub operations 25% */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="3" strokeDasharray="25 75" strokeDashoffset="-35" />
                      {/* Segment 3: Solar & Green grid 15% */}
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="15 85" strokeDashoffset="-60" />
                    </svg>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%', marginTop: '12px', fontSize: '10px', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
                        <span>Rides (60%)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6', display: 'inline-block' }}></span>
                        <span>Hub (25%)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }}></span>
                        <span>Solar (15%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right panel */}
              <div className="co-card">
                <div className="co-card-hdr">
                  <h3 className="co-card-tit">Zone Distribution & Progress</h3>
                </div>

                <div className="co-progress-list">
                  <div className="co-prog-item">
                    <div className="co-prog-labels">
                      <span>Palika Bazaar, CP Hub</span>
                      <span>85% (131,597 kg)</span>
                    </div>
                    <div className="co-prog-bar-bg">
                      <div className="co-prog-bar-val" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="co-prog-item">
                    <div className="co-prog-labels">
                      <span>Karol Bagh Hub</span>
                      <span>62% (95,988 kg)</span>
                    </div>
                    <div className="co-prog-bar-bg">
                      <div className="co-prog-bar-val" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                  <div className="co-prog-item">
                    <div className="co-prog-labels">
                      <span>Jantar Mantar Station</span>
                      <span>45% (69,669 kg)</span>
                    </div>
                    <div className="co-prog-bar-bg">
                      <div className="co-prog-bar-val" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div className="co-prog-item">
                    <div className="co-prog-labels">
                      <span>Raja Garden Station</span>
                      <span>30% (46,446 kg)</span>
                    </div>
                    <div className="co-prog-bar-bg">
                      <div className="co-prog-bar-val" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px', marginTop: '4px' }}>
                  <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>Environmental Checklist</h4>
                  <div className="co-chk-list">
                    <div className="co-chk-item">
                      <span className="co-chk-ic">✓</span>
                      <span>Zero tailpipe emissions target achieved across all 6 central Delhi hubs.</span>
                    </div>
                    <div className="co-chk-item">
                      <span className="co-chk-ic">✓</span>
                      <span>Lithium-ion battery reuse & secondary recycling scheme active (partnered with GreenVolt).</span>
                    </div>
                    <div className="co-chk-item">
                      <span className="co-chk-ic">⚡</span>
                      <span>Solar grid micro-station charging integration planned for CP Hub 2 (In Progress).</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logs Table */}
            <div className="co-tcard">
              <div className="co-filter-bar">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div className="co-search-wrap">
                    <span className="co-search-ic">🔍</span>
                    <input
                      type="text"
                      className="co-search-inp"
                      placeholder="Search log date..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    />
                  </div>
                  <select className="co-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                    <option value="">All Statuses</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <button className="co-btn" style={{ padding: '6px 12px' }} onClick={() => { setSearchQuery(''); setStatusFilter(''); setCurrentPage(1); triggerToast('Filters reseted'); }}>
                  Reset Filters
                </button>
              </div>

              <table className="co-table">
                <thead>
                  <tr>
                    <th>Log Date</th>
                    <th>Active Fleet Size</th>
                    <th>Battery Swaps Logged</th>
                    <th>Cumulative Ride Distance</th>
                    <th>Petrol Avoided (L)</th>
                    <th>CO2 Offset (kg)</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                        No logs matched your criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedLogs.map((log, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 700 }}>{log.date}</td>
                        <td style={{ fontWeight: 600 }}>{log.vehicleCount} Vehicles</td>
                        <td>{log.swaps} swaps</td>
                        <td style={{ fontWeight: 600 }}>{log.distance}</td>
                        <td style={{ color: '#EA580C', fontWeight: 700 }}>{log.fuelSaved} Litres</td>
                        <td style={{ color: '#16A34A', fontWeight: 800 }}>{log.co2Saved} kg Offset</td>
                        <td>
                          <span className={log.status === 'Verified' ? 'pill-verified' : 'pill-pending'}>
                            {log.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button className="co-pg-btn" style={{ width: '24px', height: '24px', padding: 0 }} title="Inspect Data Log" onClick={() => alert(`CO2 Audit Info:\nDate: ${log.date}\nFuel Saved: ${log.fuelSaved} L\nCO2 Saved: ${log.co2Saved} kg\nCalculated factor: 2.34 kg CO2 per Litre petrol`)}>👁</button>
                            <button className="co-pg-btn" style={{ width: '24px', height: '24px', padding: 0 }} title="Re-Audit" onClick={() => triggerToast(`Audit recalc run for ${log.date}`)}>⚡</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Table Footer */}
              <div className="co-footer-bar">
                <span>Showing {(currentPage - 1) * 5 + 1} to {Math.min(currentPage * 5, filteredLogs.length)} of {filteredLogs.length} entries</span>
                <div className="co-pagination">
                  <button className="co-pg-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>&lt;</button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} className={`co-pg-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  ))}
                  <button className="co-pg-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>&gt;</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {toast.show && (
        <div className="co-toast co-toast-green">
          <span>🔔</span>
          <span>{toast.msg}</span>
        </div>
      )}
    </>
  );
}
