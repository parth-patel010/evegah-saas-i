"use client";
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
.rep-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', sans-serif; }
.rep-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.rep-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

/* Custom top bar profile and zone switcher info */
.rep-top-info { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; background: #fff; border-bottom: 1px solid #E2E8F0; }
.rep-user-greet { display: flex; align-items: center; gap: 10px; }
.rep-user-avatar { width: 34px; height: 34px; border-radius: 50%; object-fit: cover; background: #EEF2FF; }
.rep-user-text { display: flex; flex-direction: column; }
.rep-user-name { font-size: 13.5px; font-weight: 700; color: #1E293B; }
.rep-user-role { font-size: 11.5px; color: #64748B; }

.rep-top-actions { display: flex; align-items: center; gap: 16px; }
.rep-zone-select { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #334155; background: #fff; cursor: pointer; }
.rep-bell-btn { position: relative; width: 36px; height: 36px; border-radius: 50%; border: 1.5px solid #E2E8F0; display: flex; align-items: center; justify-content: center; color: #475569; background: #fff; cursor: pointer; }
.rep-bell-badge { position: absolute; top: -2px; right: -2px; width: 16px; height: 16px; border-radius: 50%; background: #2a195c; color: #fff; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; }

/* Header title */
.rep-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-top: 4px; }
.rep-h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 6px; letter-spacing: -0.02em; }
.rep-sub { font-size: 13.5px; color: #64748B; margin: 0; font-weight: 400; }

.rep-actions { display: flex; align-items: center; gap: 10px; }
.rep-btn { display: flex; align-items: center; gap: 7px; padding: 10px 16px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all .15s; }
.rep-btn:hover { border-color: #2a195c; color: #2a195c; }
.rep-btn-primary { background: #2a195c; color: #fff; border-color: #2a195c; }
.rep-btn-primary:hover { background: #4338CA; border-color: #4338CA; color: #fff; }

/* Report categories tabs */
.rep-tabs-card { border-bottom: 1px solid #E2E8F0; margin-bottom: 4px; overflow-x: auto; }
.rep-tabs-list { display: flex; gap: 24px; }
.rep-tab { padding: 12px 4px 14px; font-size: 13.5px; font-weight: 600; color: #64748B; cursor: pointer; border-bottom: 2.5px solid transparent; transition: all .15s; white-space: nowrap; background: transparent; border-top: none; border-left: none; border-right: none; }
.rep-tab:hover { color: #2a195c; }
.rep-tab.active { color: #2a195c; border-color: #2a195c; font-weight: 700; }

/* Filters card */
.rep-filter-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 14px 16px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.rep-filter-grid { display: grid; grid-template-columns: 1fr 1fr 1.25fr 1.5fr auto auto auto; gap: 12px; align-items: center; }
.rep-select { width: 100%; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 500; outline: none; background: #fff; color: #334155; cursor: pointer; appearance: none; -webkit-appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; background-size: 12px; padding-right: 36px; }
.rep-select:focus { border-color: #2a195c; }

.rep-date-picker { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 600; background: #fff; color: #334155; cursor: pointer; }
.rep-date-picker:hover { border-color: #2a195c; }
.rep-date-icon { color: #64748B; display: flex; align-items: center; }

.rep-filter-btn { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; background: #F1F5F9; border: 1.5px solid transparent; border-radius: 10px; font-size: 13px; color: #475569; cursor: pointer; transition: all .15s; }
.rep-filter-btn:hover { background: #E2E8F0; color: #2a195c; }

.rep-reset-btn { padding: 10px 18px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 700; color: #64748B; cursor: pointer; transition: all .15s; }
.rep-reset-btn:hover { border-color: #EF4444; color: #EF4444; }
.rep-apply-btn { padding: 10px 20px; background: #2a195c; border: 1.5px solid #2a195c; border-radius: 10px; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; transition: all .15s; }
.rep-apply-btn:hover { background: #4338CA; border-color: #4338CA; }

/* KPI indicator row */
.rep-kpis-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.rep-kpi-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.rep-kpi-ic { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ic-purple { background: #EEF2FF; color: #2a195c; }
.ic-green { background: #ECFDF5; color: #059669; }
.ic-blue { background: #EFF6FF; color: #2563EB; }
.ic-orange { background: #FFF7ED; color: #EA580C; }
.ic-red { background: #FEE2E2; color: #DC2626; }

.rep-kpi-info { display: flex; flex-direction: column; flex: 1; min-width: 0; }
.rep-kpi-lbl { font-size: 11.5px; color: #64748B; font-weight: 600; margin-bottom: 4px; }
.rep-kpi-val { font-size: 20px; font-weight: 800; color: #0F172A; line-height: 1.1; }
.rep-kpi-delta { font-size: 11.5px; margin-top: 6px; font-weight: 600; display: flex; align-items: center; gap: 3px; }
.delta-up { color: #16A34A; }
.delta-down { color: #EF4444; }
.delta-lbl { color: #94A3B8; font-weight: 400; margin-left: 2px; }

/* Charts Layout Grid */
.rep-charts-grid { display: grid; grid-template-columns: 2fr 1.2fr 1fr; gap: 16px; }
.rep-chart-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.02); display: flex; flex-direction: column; }
.rep-chart-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.rep-chart-tit { font-size: 14px; font-weight: 700; color: #0F172A; }

.rep-chart-viewall { font-size: 11px; font-weight: 700; color: #6366F1; text-decoration: none; cursor: pointer; }
.rep-chart-viewall:hover { text-decoration: underline; }

.rep-chart-body { display: flex; align-items: center; justify-content: center; flex: 1; min-height: 180px; }

/* Donut Legend styles */
.rep-donut-layout { display: flex; flex-direction: column; align-items: center; gap: 14px; width: 100%; }
.rep-donut-vis { position: relative; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; }
.rep-donut-center { position: absolute; text-align: center; }
.rep-donut-num { font-size: 15px; font-weight: 800; color: #1E293B; }
.rep-donut-lbl { font-size: 10px; color: #64748B; margin-top: 1px; font-weight: 500; }
.rep-donut-legend { width: 100%; display: flex; flex-direction: column; gap: 6px; }
.rep-leg-item { display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; }
.rep-leg-l { display: flex; align-items: center; gap: 6px; }
.rep-leg-dot { width: 8px; height: 8px; border-radius: 50%; }
.rep-leg-name { color: #64748B; font-weight: 500; }
.rep-leg-val { font-weight: 700; color: #1E293B; }
.rep-leg-pct { color: #94A3B8; font-weight: 400; margin-left: 2px; }

/* Table styling */
.rep-tcard { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); overflow: hidden; display: flex; flex-direction: column; }
.rep-tcard-hdr { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid #E2E8F0; }
.rep-tcard-tit { font-size: 14.5px; font-weight: 700; color: #1E293B; }
.rep-tbl-wrap { overflow-x: auto; }
.rep-tbl { width: 100%; border-collapse: collapse; min-width: 1000px; }
.rep-tbl th { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: .06em; text-align: left; padding: 12px 16px; background: #FAFBFD; border-bottom: 1px solid #E2E8F0; }
.rep-tbl td { padding: 12px 16px; font-size: 13px; color: #334155; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
.rep-tbl tr:last-child td { border-bottom: none; }
.rep-tbl tr:hover td { background: #F8FAFC; }

.rep-tbl-strong { font-weight: 700; color: #1E293B; }

.rep-three-dots { background: none; border: none; font-size: 16px; color: #94A3B8; cursor: pointer; padding: 4px; display: inline-flex; align-items: center; justify-content: center; }
.rep-three-dots:hover { color: #2a195c; }

.rep-tcard-ft { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; border-top: 1px solid #E2E8F0; background: #FAFBFD; }
.rep-tcard-ft-lbl { font-size: 13px; color: #64748B; font-weight: 500; }
.rep-pg { display: flex; align-items: center; gap: 4px; }
.rep-pgb { width: 28px; height: 28px; border: 1.5px solid #E2E8F0; border-radius: 6px; background: #fff; font-size: 12.5px; font-weight: 700; color: #475569; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; }
.rep-pgb:hover:not(:disabled) { border-color: #2a195c; color: #2a195c; }
.rep-pgb.cur { background: #2a195c; color: #fff; border-color: #2a195c; }
.rep-pgb:disabled { opacity: 0.5; cursor: not-allowed; }

.rep-limit-select { padding: 6px 10px; border: 1.5px solid #E2E8F0; border-radius: 6px; font-size: 12px; font-weight: 600; outline: none; background: #fff; color: #475569; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 8px center; background-size: 10px; padding-right: 24px; }
`;

interface FranchiseRow {
  name: string;
  vehicles: number;
  rentals: number;
  revenue: number;
  transactions: number;
  swaps: number;
  utilization: number;
  collectionPct: number;
  overdue: number;
}

const FRANCHISE_DATA: FranchiseRow[] = [
  { name: 'Connaught Place', vehicles: 160, rentals: 180, revenue: 124560, transactions: 620, swaps: 245, utilization: 74.6, collectionPct: 98.2, overdue: 8 },
  { name: 'Karol Bagh', vehicles: 152, rentals: 152, revenue: 98230, transactions: 480, swaps: 190, utilization: 71.2, collectionPct: 96.5, overdue: 6 },
  { name: 'Paharganj', vehicles: 120, rentals: 120, revenue: 76890, transactions: 392, swaps: 152, utilization: 68.4, collectionPct: 95.1, overdue: 12 },
  { name: 'Rajendra Place', vehicles: 98, rentals: 98, revenue: 24450, transactions: 210, swaps: 98, utilization: 65.1, collectionPct: 97.3, overdue: 5 },
  { name: 'Pragati Maidan', vehicles: 86, rentals: 86, revenue: 840, transactions: 54, swaps: 45, utilization: 61.3, collectionPct: 94.8, overdue: 25 }
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('Franchise Report');

  const tabs = [
    'Franchise Report',
    'Vehicle Report',
    'Rental Report',
    'Battery Report',
    'Financial Report',
    'Maintenance Report',
    'User Activity Report'
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="rep-shell">
        <Sidebar activePath="/reports" />
        <div className="rep-main">
          {/* Custom Top bar for user welcome & zone */}
          <div className="rep-top-info">
            <div className="rep-user-greet">
              <div className="rep-user-avatar" style={{ background: '#2a195c', color: '#fff', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="rep-user-text">
                <span className="rep-user-name">Hello, Akash 👋</span>
                <span className="rep-user-role">Zone Employee</span>
              </div>
            </div>
            <div className="rep-top-actions">
              <button className="rep-zone-select">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Connaught Place Zone
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <button className="rep-bell-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="rep-bell-badge">3</span>
              </button>
            </div>
          </div>

          <div className="rep-page">
            {/* Page Title */}
            <div className="rep-title-row">
              <div>
                <h1 className="rep-h1">Reports</h1>
                <p className="rep-sub">View and analyze franchise performance and operational insights.</p>
              </div>
              <div className="rep-actions">
                <button className="rep-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2a195c" strokeWidth="2.5" style={{ marginRight: 2 }}>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create Custom Report
                </button>
                <button className="rep-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ marginRight: 2 }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Schedule Report
                </button>
                <button className="rep-btn rep-btn-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ marginRight: 2 }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export Report
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 4 }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Category tabs */}
            <div className="rep-tabs-card">
              <div className="rep-tabs-list">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`rep-tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Filters panel */}
            <div className="rep-filter-card">
              <div className="rep-filter-grid">
                <div>
                  <select className="rep-select" defaultValue="All Zones">
                    <option>All Zones</option>
                    <option>Connaught Place Zone</option>
                  </select>
                </div>
                <div>
                  <select className="rep-select" defaultValue="All Franchise">
                    <option>All Franchise</option>
                    <option>Connaught Place Hub</option>
                  </select>
                </div>
                <div>
                  <select className="rep-select" defaultValue="Performance Summary">
                    <option>Performance Summary</option>
                    <option>Financial Summary</option>
                  </select>
                </div>
                <button className="rep-date-picker">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="rep-date-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </span>
                    20 May 2024 - 20 May 2024
                  </span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: '#64748B' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <button className="rep-filter-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                    <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                    <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
                  </svg>
                </button>
                <button className="rep-reset-btn">Reset</button>
                <button className="rep-apply-btn">Apply Filters</button>
              </div>
            </div>

            {/* KPI Cards Row */}
            <div className="rep-kpis-grid">
              <div className="rep-kpi-card">
                <div className="rep-kpi-ic ic-purple">
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>₹</span>
                </div>
                <div className="rep-kpi-info">
                  <span className="rep-kpi-lbl">Total Revenue (MTD)</span>
                  <span className="rep-kpi-val">₹3,24,850</span>
                  <span className="rep-kpi-delta delta-up">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                    12.6%
                    <span className="delta-lbl">vs last month</span>
                  </span>
                </div>
              </div>

              <div className="rep-kpi-card">
                <div className="rep-kpi-ic ic-green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M17 2.1l4 4-4 4M3 21.9l-4-4 4-4" />
                    <path d="M21 6.1H9a4 4 0 0 0-4 4v5m-2 1.8h12a4 4 0 0 0 4-4v-5" />
                  </svg>
                </div>
                <div className="rep-kpi-info">
                  <span className="rep-kpi-lbl">Total Rentals (MTD)</span>
                  <span className="rep-kpi-val">1,248</span>
                  <span className="rep-kpi-delta delta-up">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                    9.4%
                    <span className="delta-lbl">vs last month</span>
                  </span>
                </div>
              </div>

              <div className="rep-kpi-card">
                <div className="rep-kpi-ic ic-purple">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div className="rep-kpi-info">
                  <span className="rep-kpi-lbl">Total Transactions (MTD)</span>
                  <span className="rep-kpi-val">2,156</span>
                  <span className="rep-kpi-delta delta-up">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                    8.7%
                    <span className="delta-lbl">vs last month</span>
                  </span>
                </div>
              </div>

              <div className="rep-kpi-card">
                <div className="rep-kpi-ic ic-orange">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="1" y="6" width="18" height="12" rx="2" />
                    <line x1="23" y1="13" x2="23" y2="11" />
                    <polyline points="7 12 11 8 11 12 15 12" />
                  </svg>
                </div>
                <div className="rep-kpi-info">
                  <span className="rep-kpi-lbl">Total Battery Swaps (MTD)</span>
                  <span className="rep-kpi-val">842</span>
                  <span className="rep-kpi-delta delta-up">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                    11.8%
                    <span className="delta-lbl">vs last month</span>
                  </span>
                </div>
              </div>

              <div className="rep-kpi-card">
                <div className="rep-kpi-ic ic-red">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div className="rep-kpi-info">
                  <span className="rep-kpi-lbl">Overdue Rentals</span>
                  <span className="rep-kpi-val">56</span>
                  <span className="rep-kpi-delta delta-up" style={{ color: '#DC2626' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                    5.2%
                    <span className="delta-lbl">vs last month</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="rep-charts-grid">
              {/* Chart 1: Revenue Overview */}
              <div className="rep-chart-card">
                <div className="rep-chart-hdr">
                  <span className="rep-chart-tit">Revenue Overview</span>
                </div>
                <div className="rep-chart-body">
                  <svg width="100%" height="180" viewBox="0 0 500 180" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                    {/* Grid Lines */}
                    <line x1="0" y1="160" x2="500" y2="160" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F5F9" strokeWidth="1" />
                    <line x1="0" y1="10" x2="500" y2="10" stroke="#F1F5F9" strokeWidth="1" />

                    {/* Gradient fill */}
                    <defs>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Path Area */}
                    <path
                      d="M 10 140 Q 90 120 170 80 T 330 90 T 490 40 L 490 160 L 10 160 Z"
                      fill="url(#purpleGrad)"
                    />

                    {/* Spline Path Line */}
                    <path
                      d="M 10 140 Q 90 120 170 80 T 330 90 T 490 40"
                      fill="none"
                      stroke="#7C3AED"
                      strokeWidth="2.5"
                    />

                    {/* Data Points */}
                    <circle cx="10" cy="140" r="4.5" fill="#fff" stroke="#7C3AED" strokeWidth="2.5" />
                    <circle cx="90" cy="120" r="4.5" fill="#fff" stroke="#7C3AED" strokeWidth="2.5" />
                    <circle cx="170" cy="80" r="4.5" fill="#fff" stroke="#7C3AED" strokeWidth="2.5" />
                    <circle cx="250" cy="95" r="4.5" fill="#fff" stroke="#7C3AED" strokeWidth="2.5" />
                    <circle cx="330" cy="90" r="4.5" fill="#fff" stroke="#7C3AED" strokeWidth="2.5" />
                    <circle cx="410" cy="110" r="4.5" fill="#fff" stroke="#7C3AED" strokeWidth="2.5" />
                    <circle cx="490" cy="40" r="4.5" fill="#fff" stroke="#7C3AED" strokeWidth="2.5" />

                    {/* Labels */}
                    <text x="10" y="178" fontSize="10.5" fill="#64748B" textAnchor="middle">14 May</text>
                    <text x="90" y="178" fontSize="10.5" fill="#64748B" textAnchor="middle">15 May</text>
                    <text x="170" y="178" fontSize="10.5" fill="#64748B" textAnchor="middle">16 May</text>
                    <text x="250" y="178" fontSize="10.5" fill="#64748B" textAnchor="middle">17 May</text>
                    <text x="330" y="178" fontSize="10.5" fill="#64748B" textAnchor="middle">18 May</text>
                    <text x="410" y="178" fontSize="10.5" fill="#64748B" textAnchor="middle">19 May</text>
                    <text x="490" y="178" fontSize="10.5" fill="#64748B" textAnchor="middle">20 May</text>

                    {/* Y values */}
                    <text x="-8" y="163" fontSize="9.5" fill="#94A3B8" textAnchor="end">₹0</text>
                    <text x="-8" y="123" fontSize="9.5" fill="#94A3B8" textAnchor="end">₹25k</text>
                    <text x="-8" y="83" fontSize="9.5" fill="#94A3B8" textAnchor="end">₹50k</text>
                    <text x="-8" y="43" fontSize="9.5" fill="#94A3B8" textAnchor="end">₹75k</text>
                    <text x="-8" y="13" fontSize="9.5" fill="#94A3B8" textAnchor="end">₹100k</text>
                  </svg>
                </div>
              </div>

              {/* Chart 2: Revenue by Franchise */}
              <div className="rep-chart-card">
                <div className="rep-chart-hdr">
                  <span className="rep-chart-tit">Revenue by Franchise</span>
                </div>
                <div className="rep-chart-body">
                  <div className="rep-donut-layout">
                    <div className="rep-donut-vis">
                      {/* SVG Donut representation */}
                      <svg width="120" height="120" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
                        {/* CP - 38.3% */}
                        <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="#7C3AED" strokeWidth="4.2" strokeDasharray="38.3 61.7" strokeDashoffset="0" />
                        {/* KB - 30.2% */}
                        <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="#3B82F6" strokeWidth="4.2" strokeDasharray="30.2 69.8" strokeDashoffset="-38.3" />
                        {/* PG - 23.7% */}
                        <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="#EAB308" strokeWidth="4.2" strokeDasharray="23.7 76.3" strokeDashoffset="-68.5" />
                        {/* RP - 7.5% */}
                        <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="#10B981" strokeWidth="4.2" strokeDasharray="7.5 92.5" strokeDashoffset="-92.2" />
                        {/* PM - 0.3% */}
                        <circle cx="18" cy="18" r="15.91" fill="transparent" stroke="#F97316" strokeWidth="4.2" strokeDasharray="0.3 99.7" strokeDashoffset="-99.7" />
                      </svg>
                      <div className="rep-donut-center">
                        <div className="rep-donut-num">₹3,24,850</div>
                        <div className="rep-donut-lbl">Total</div>
                      </div>
                    </div>

                    <div className="rep-donut-legend">
                      <div className="rep-leg-item">
                        <div className="rep-leg-l">
                          <span className="rep-leg-dot" style={{ background: '#7C3AED' }} />
                          <span className="rep-leg-name">Connaught Place</span>
                        </div>
                        <span className="rep-leg-val">₹1,24,560 <span className="rep-leg-pct">(38.3%)</span></span>
                      </div>

                      <div className="rep-leg-item">
                        <div className="rep-leg-l">
                          <span className="rep-leg-dot" style={{ background: '#3B82F6' }} />
                          <span className="rep-leg-name">Karol Bagh</span>
                        </div>
                        <span className="rep-leg-val">₹98,230 <span className="rep-leg-pct">(30.2%)</span></span>
                      </div>

                      <div className="rep-leg-item">
                        <div className="rep-leg-l">
                          <span className="rep-leg-dot" style={{ background: '#EAB308' }} />
                          <span className="rep-leg-name">Paharganj</span>
                        </div>
                        <span className="rep-leg-val">₹76,890 <span className="rep-leg-pct">(23.7%)</span></span>
                      </div>

                      <div className="rep-leg-item">
                        <div className="rep-leg-l">
                          <span className="rep-leg-dot" style={{ background: '#10B981' }} />
                          <span className="rep-leg-name">Rajendra Place</span>
                        </div>
                        <span className="rep-leg-val">₹24,450 <span className="rep-leg-pct">(7.5%)</span></span>
                      </div>

                      <div className="rep-leg-item">
                        <div className="rep-leg-l">
                          <span className="rep-leg-dot" style={{ background: '#F97316' }} />
                          <span className="rep-leg-name">Pragati Maidan</span>
                        </div>
                        <span className="rep-leg-val">₹840 <span className="rep-leg-pct">(0.3%)</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart 3: Rental Trend */}
              <div className="rep-chart-card">
                <div className="rep-chart-hdr">
                  <span className="rep-chart-tit">Rental Trend</span>
                  <select className="rep-limit-select" style={{ border: 'none', background: 'transparent', paddingRight: '18px', padding: '0', fontSize: '11px', fontWeight: 'bold', color: '#64748B' }}>
                    <option>Last 7 Days</option>
                  </select>
                </div>
                <div className="rep-chart-body">
                  <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px' }}>
                    {/* SVG bar representation */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '130px', borderBottom: '1px solid #E2E8F0', paddingBottom: '4px', width: '100%' }}>
                      {/* Bar 1 - 14 May: value 180 */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1' }}>
                        <div style={{ height: '78px', width: '14px', background: 'linear-gradient(180deg, #7C3AED 0%, #2a195c 100%)', borderRadius: '4px 4px 0 0' }} />
                      </div>
                      {/* Bar 2 - 15 May: value 190 */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1' }}>
                        <div style={{ height: '84px', width: '14px', background: 'linear-gradient(180deg, #7C3AED 0%, #2a195c 100%)', borderRadius: '4px 4px 0 0' }} />
                      </div>
                      {/* Bar 3 - 16 May: value 210 */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1' }}>
                        <div style={{ height: '94px', width: '14px', background: 'linear-gradient(180deg, #7C3AED 0%, #2a195c 100%)', borderRadius: '4px 4px 0 0' }} />
                      </div>
                      {/* Bar 4 - 17 May: value 240 */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1' }}>
                        <div style={{ height: '108px', width: '14px', background: 'linear-gradient(180deg, #7C3AED 0%, #2a195c 100%)', borderRadius: '4px 4px 0 0' }} />
                      </div>
                      {/* Bar 5 - 18 May: value 220 */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1' }}>
                        <div style={{ height: '98px', width: '14px', background: 'linear-gradient(180deg, #7C3AED 0%, #2a195c 100%)', borderRadius: '4px 4px 0 0' }} />
                      </div>
                      {/* Bar 6 - 19 May: value 230 */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1' }}>
                        <div style={{ height: '102px', width: '14px', background: 'linear-gradient(180deg, #7C3AED 0%, #2a195c 100%)', borderRadius: '4px 4px 0 0' }} />
                      </div>
                      {/* Bar 7 - 20 May: value 250 */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1' }}>
                        <div style={{ height: '115px', width: '14px', background: 'linear-gradient(180deg, #7C3AED 0%, #2a195c 100%)', borderRadius: '4px 4px 0 0' }} />
                      </div>
                    </div>
                    {/* X axis labels */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8' }}>
                      <span style={{ flex: '1', textAlign: 'center' }}>14 May</span>
                      <span style={{ flex: '1', textAlign: 'center' }}>15 May</span>
                      <span style={{ flex: '1', textAlign: 'center' }}>16 May</span>
                      <span style={{ flex: '1', textAlign: 'center' }}>17 May</span>
                      <span style={{ flex: '1', textAlign: 'center' }}>18 May</span>
                      <span style={{ flex: '1', textAlign: 'center' }}>19 May</span>
                      <span style={{ flex: '1', textAlign: 'center' }}>20 May</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Franchise Performance Table */}
            <div className="rep-tcard">
              <div className="rep-tcard-hdr">
                <span className="rep-tcard-tit">Franchise Performance</span>
                <button className="rep-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ marginRight: 2 }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export
                </button>
              </div>

              <div className="rep-tbl-wrap">
                <table className="rep-tbl">
                  <thead>
                    <tr>
                      <th>Franchise Name</th>
                      <th>Total Vehicles</th>
                      <th>Total Rentals</th>
                      <th>Total Revenue (₹)</th>
                      <th>Total Transactions</th>
                      <th>Battery Swaps</th>
                      <th>Utilization Rate</th>
                      <th>Collection %</th>
                      <th>Overdue Rentals</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FRANCHISE_DATA.map((row, index) => (
                      <tr key={index}>
                        <td className="rep-tbl-strong">{row.name}</td>
                        <td>{row.vehicles}</td>
                        <td>{row.rentals}</td>
                        <td className="rep-tbl-strong">₹{row.revenue.toLocaleString('en-IN')}</td>
                        <td>{row.transactions}</td>
                        <td>{row.swaps}</td>
                        <td>{row.utilization}%</td>
                        <td>{row.collectionPct}%</td>
                        <td>{row.overdue}</td>
                        <td>
                          <button className="rep-three-dots">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="19" cy="12" r="1" />
                              <circle cx="5" cy="12" r="1" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="rep-tcard-ft">
                <span className="rep-tcard-ft-lbl">Showing 1 to 5 of 5 entries</span>
                <div className="rep-pg">
                  <button className="rep-pgb" disabled>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button className="rep-pgb cur">1</button>
                  <button className="rep-pgb" disabled>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>

                <div>
                  <select className="rep-limit-select" defaultValue="10">
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
