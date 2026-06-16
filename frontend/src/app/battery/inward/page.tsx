"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
.ba-shell { display: flex; min-height: 100vh; background: #F8FAFC; font-family: 'Inter', sans-serif; }
.ba-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.ba-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

/* Breadcrumb */
.ba-bc { display: flex; align-items: center; gap: 6px; font-size: 12.5px; color: #64748B; font-weight: 500; }
.ba-bc a { color: #64748B; text-decoration: none; }
.ba-bc a:hover { color: #6D28D9; }
.ba-bc-sep { color: #94A3B8; }
.ba-bc-cur { color: #1E293B; font-weight: 600; }

/* Header title */
.ba-title-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 4px; }
.ba-title-left { display: flex; align-items: center; gap: 12px; }
.ba-back-arrow { border: 1.5px solid #E2E8F0; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fff; transition: border-color .15s; font-size: 15px; }
.ba-back-arrow:hover { border-color: #6D28D9; color: #6D28D9; }
.ba-h1 { font-size: 22px; font-weight: 800; color: #0F172A; margin: 0; letter-spacing: -0.02em; }
.ba-badge-completed { background: #DCFCE7; color: #16A34A; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; border: 1px solid #BBF7D0; }

.ba-actions { display: flex; align-items: center; gap: 10px; }
.ba-btn { display: flex; align-items: center; gap: 7px; padding: 8px 14px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; font-weight: 700; color: #475569; cursor: pointer; transition: all .15s; }
.ba-btn:hover { border-color: #6D28D9; color: #6D28D9; }
.ba-btn-primary { background: #6D28D9; color: #fff; border-color: #6D28D9; }
.ba-btn-primary:hover { background: #5B21B6; border-color: #5B21B6; }

/* Large Header Card details */
.ba-profile-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.02); display: grid; grid-template-columns: 240px 1.5fr 1.5fr; gap: 24px; align-items: center; }
.ba-profile-left { display: flex; gap: 18px; align-items: center; }
.ba-img-box { width: 90px; height: 110px; border-radius: 10px; overflow: hidden; background: #FAF5FF; display: flex; align-items: center; justify-content: center; border: 1px solid #E9D5FF; flex-shrink: 0; }
.ba-soc-panel { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.ba-soc-title { font-size: 16px; font-weight: 800; color: #0F172A; }
.ba-soc-bar-bg { width: 100%; height: 8px; background: #F1F5F9; border-radius: 4px; overflow: hidden; margin: 2px 0; }
.ba-soc-bar-val { height: 100%; background: linear-gradient(90deg, #10B981, #34D399); border-radius: 4px; }
.ba-soc-lbl { font-size: 11px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em; }

.ba-details-col { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 16px; border-left: 1px solid #F1F5F9; padding-left: 24px; height: 100%; align-content: center; }
.ba-detail-item { display: flex; align-items: flex-start; gap: 8px; }
.ba-detail-ic { color: #6D28D9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; margin-top: 2px; }
.ba-detail-text { display: flex; flex-direction: column; gap: 1px; }
.ba-detail-lbl { font-size: 10px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em; }
.ba-detail-val { font-size: 12.5px; font-weight: 700; color: #1E293B; }
.dot-green { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #16A34A; margin-right: 4px; vertical-align: middle; }

/* Tabs */
.ba-tabs { display: flex; border-bottom: 1.5px solid #E2E8F0; gap: 24px; margin-top: 10px; }
.ba-tab { padding: 12px 4px; font-size: 13.5px; font-weight: 700; color: #64748B; cursor: pointer; border-bottom: 3px solid transparent; transition: all .15s; margin-bottom: -1.5px; }
.ba-tab:hover { color: #6D28D9; }
.ba-tab.active { color: #6D28D9; border-bottom-color: #6D28D9; }

/* Tab Content Grid Layout */
.ba-grid-overview { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
.ba-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.02); display: flex; flex-direction: column; gap: 14px; position: relative; }
.ba-card-hdr { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #F1F5F9; padding-bottom: 12px; }
.ba-card-tit { font-size: 14px; font-weight: 800; color: #0F172A; text-transform: uppercase; letter-spacing: 0.03em; display: flex; align-items: center; gap: 6px; }

/* Info Lists */
.ba-info-list { display: flex; flex-direction: column; gap: 11px; }
.ba-info-row { display: flex; justify-content: space-between; align-items: center; font-size: 12.5px; }
.ba-info-lbl { color: #64748B; font-weight: 600; display: flex; align-items: center; gap: 6px; }
.ba-info-val { font-weight: 700; color: #1E293B; }

/* Health Gauge */
.ba-health-con { position: relative; width: 115px; height: 115px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ba-health-svg { transform: rotate(-90deg); width: 100px; height: 100px; }
.ba-health-txt { position: absolute; text-align: center; }
.ba-health-num { font-size: 20px; font-weight: 800; color: #0F172A; }
.ba-health-lbl { font-size: 9.5px; color: #64748B; font-weight: 600; text-transform: uppercase; }

/* Bottom layout grid */
.ba-grid-bottom { display: grid; grid-template-columns: 1.5fr 1fr 1fr; gap: 20px; }
.ba-link { font-size: 12px; font-weight: 700; color: #6D28D9; text-decoration: none; cursor: pointer; }
.ba-link:hover { text-decoration: underline; }

/* Recent inwards table */
.ba-table { width: 100%; border-collapse: collapse; }
.ba-table th { font-size: 10.5px; font-weight: 700; color: #64748B; text-transform: uppercase; padding: 8px 10px; border-bottom: 1px solid #E2E8F0; text-align: left; }
.ba-table td { padding: 8px 10px; font-size: 12px; color: #334155; border-bottom: 1px solid #F1F5F9; }
.ba-table tr:hover td { background: #F8FAFC; }

/* Checklist */
.ba-chk-item { display: flex; justify-content: space-between; align-items: center; font-size: 12.5px; padding-bottom: 5px; border-bottom: 1px solid #F1F5F9; }
.ba-chk-item:last-child { border-bottom: none; }
.ba-chk-lbl { color: #475569; font-weight: 500; display: flex; align-items: center; gap: 6px; }
.ba-chk-val { color: #16A34A; font-weight: 800; font-size: 11px; }

/* Attachments carousel */
.ba-attach-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.ba-attach-card { border: 1.2px solid #E2E8F0; border-radius: 8px; overflow: hidden; background: #FAFBFD; display: flex; flex-direction: column; text-align: center; }
.ba-attach-thumb { height: 50px; background: #EEF2FF; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.ba-attach-name { font-size: 10px; font-weight: 700; color: #1E293B; padding: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ba-attach-date { font-size: 8px; color: #94A3B8; padding-bottom: 4px; }

/* Horizontal Timeline */
.ba-timeline { display: flex; justify-content: space-between; align-items: center; position: relative; padding: 10px 0; margin-top: 10px; }
.ba-timeline::before { content: ''; position: absolute; left: 20px; right: 20px; top: 25px; height: 3px; background: #E2E8F0; z-index: 0; }
.ba-tl-step { display: flex; flex-direction: column; align-items: center; position: relative; z-index: 1; flex: 1; }
.ba-tl-circle { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; background: #fff; border: 2.5px solid #CBD5E1; color: #64748B; transition: all .2s; }
.ba-tl-circle.done { border-color: #10B981; background: #DCFCE7; color: #10B981; }
.ba-tl-circle.active { border-color: #6D28D9; background: #F5F3FF; color: #6D28D9; }
.ba-tl-label { font-size: 11.5px; font-weight: 700; color: #1E293B; margin-top: 8px; }
.ba-tl-time { font-size: 9px; color: #94A3B8; margin-top: 1px; font-weight: 500; }
`;

export default function BatteryInwardDetailsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');
  const [notes, setNotes] = useState('Regular battery inward');
  const [checklist, setChecklist] = useState([
    { name: 'Battery Physical Check', status: 'OK' },
    { name: 'Voltage Check', status: 'OK' },
    { name: 'Temperature Check', status: 'OK' },
    { name: 'Connector & Wiring Check', status: 'OK' },
    { name: 'BMS Communication Check', status: 'OK' },
    { name: 'Capacity Verification', status: 'OK' },
    { name: 'Cosmetic Condition Check', status: 'OK' },
    { name: 'Documents Verified', status: 'OK' }
  ]);

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ba-shell">
        <Sidebar activePath="/battery/inward" />
        <div className="ba-main">
          <TopBar />
          <div className="ba-page">
            {/* Breadcrumbs */}
            <div className="ba-bc">
              <a href="/">Dashboard</a>
              <span className="ba-bc-sep">&gt;</span>
              <a href="/battery/inventory">Battery</a>
              <span className="ba-bc-sep">&gt;</span>
              <span className="ba-bc-sep">Battery Inward</span>
              <span className="ba-bc-sep">&gt;</span>
              <span className="ba-bc-cur">BAT-450X-12340001</span>
            </div>

            {/* Title Row */}
            <div className="ba-title-row">
              <div className="ba-title-left">
                <button className="ba-back-arrow" onClick={() => router.push('/iot-devices/inward')}>
                  ←
                </button>
                <h1 className="ba-h1">Battery Inward Details</h1>
                <span className="ba-badge-completed">Completed</span>
              </div>
              <div className="ba-actions">
                <button className="ba-btn" onClick={() => alert('Map route visualization')}>
                  📍 View on Map
                </button>
                <button className="ba-btn-primary ba-btn" onClick={() => alert('Metadata operations panel')}>
                  ... More Actions
                </button>
              </div>
            </div>

            {/* Large Battery Profile Header Card */}
            <div className="ba-profile-card">
              <div className="ba-profile-left">
                <div className="ba-img-box">
                  {/* High fidelity battery custom SVG icon */}
                  <svg width="54" height="84" viewBox="0 0 60 90">
                    <rect x="5" y="15" width="50" height="70" rx="6" fill="#1F2937" stroke="#6D28D9" strokeWidth="2.5"/>
                    <rect x="15" y="5" width="10" height="10" rx="2" fill="#E2E8F0"/>
                    <rect x="35" y="5" width="10" height="10" rx="2" fill="#E2E8F0"/>
                    <line x1="20" y1="10" x2="20" y2="10" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
                    <line x1="40" y1="10" x2="40" y2="10" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"/>
                    <rect x="12" y="30" width="36" height="40" rx="4" fill="#111827"/>
                    <text x="30" y="44" fill="#10B981" fontSize="9" fontWeight="900" textAnchor="middle">evegah</text>
                    <text x="30" y="56" fill="#fff" fontSize="7.5" fontWeight="700" textAnchor="middle">LITHIUM</text>
                    <circle cx="30" cy="72" r="3" fill="#10B981"/>
                  </svg>
                </div>
                <div className="ba-soc-panel">
                  <div className="ba-soc-title">BAT-450X-12340001</div>
                  <span style={{ fontSize: '10.5px', color: '#10B981', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, alignSelf: 'flex-start' }}>Healthy</span>
                  <div className="ba-soc-bar-bg">
                    <div className="ba-soc-bar-val" style={{ width: '78%' }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B', fontWeight: 600 }}>
                    <span>78% Battery SoC</span>
                  </div>
                </div>
              </div>

              {/* Middle metadata column */}
              <div className="ba-details-col">
                <div className="ba-detail-item">
                  <span className="ba-detail-ic">🔋</span>
                  <div className="ba-detail-text">
                    <span className="ba-detail-lbl">Battery Type</span>
                    <span className="ba-detail-val">Li-ion</span>
                  </div>
                </div>
                <div className="ba-detail-item">
                  <span className="ba-detail-ic">⚡</span>
                  <div className="ba-detail-text">
                    <span className="ba-detail-lbl">Voltage</span>
                    <span className="ba-detail-val">48.6 V</span>
                  </div>
                </div>
                <div className="ba-detail-item">
                  <span className="ba-detail-ic">📦</span>
                  <div className="ba-detail-text">
                    <span className="ba-detail-lbl">Capacity</span>
                    <span className="ba-detail-val">45 Ah</span>
                  </div>
                </div>
                <div className="ba-detail-item">
                  <span className="ba-detail-ic">⚖️</span>
                  <div className="ba-detail-text">
                    <span className="ba-detail-lbl">Weight</span>
                    <span className="ba-detail-val">10.2 kg</span>
                  </div>
                </div>
                <div className="ba-detail-item">
                  <span className="ba-detail-ic">🛵</span>
                  <div className="ba-detail-text">
                    <span className="ba-detail-lbl">Compatible Model</span>
                    <span className="ba-detail-val">Ather 450X</span>
                  </div>
                </div>
                <div className="ba-detail-item" style={{ gridColumn: 'span 2' }}>
                  <span className="ba-detail-ic">🔢</span>
                  <div className="ba-detail-text">
                    <span className="ba-detail-lbl">Battery Serial No.</span>
                    <span className="ba-detail-val" style={{ fontFamily: 'monospace' }}>BAT450X2120001</span>
                  </div>
                </div>
                <div className="ba-detail-item">
                  <span className="ba-detail-ic">⚙️</span>
                  <div className="ba-detail-text">
                    <span className="ba-detail-lbl">Status</span>
                    <span className="ba-detail-val"><span className="dot-green"></span>Active</span>
                  </div>
                </div>
                <div className="ba-detail-item">
                  <span className="ba-detail-ic">📥</span>
                  <div className="ba-detail-text">
                    <span className="ba-detail-lbl">Inward Type</span>
                    <span className="ba-detail-val">Manual</span>
                  </div>
                </div>
              </div>

              {/* Right metadata column */}
              <div className="ba-details-col" style={{ borderLeft: '1.5px solid #F1F5F9' }}>
                <div className="ba-detail-item">
                  <span className="ba-detail-ic">👤</span>
                  <div className="ba-detail-text">
                    <span className="ba-detail-lbl">Rahul Sharma</span>
                    <span className="ba-detail-val" style={{ fontSize: '10.5px', color: '#64748B' }}>Inward Operator</span>
                  </div>
                </div>
                <div className="ba-detail-item">
                  <span className="ba-detail-ic">📅</span>
                  <div className="ba-detail-text">
                    <span className="ba-detail-lbl">Inward Date & Time</span>
                    <span className="ba-detail-val" style={{ fontSize: '11px' }}>20 May 2024, 10:15 AM</span>
                  </div>
                </div>
                <div className="ba-detail-item">
                  <span className="ba-detail-ic">📍</span>
                  <div className="ba-detail-text">
                    <span className="ba-detail-lbl">Inward Location</span>
                    <span className="ba-detail-val">Palika Bazaar, CP</span>
                  </div>
                </div>
                <div className="ba-detail-item">
                  <span className="ba-detail-ic">🚗</span>
                  <div className="ba-detail-text">
                    <span className="ba-detail-lbl">Odometer Reading</span>
                    <span className="ba-detail-val">2,156 km</span>
                  </div>
                </div>
                <div className="ba-detail-item">
                  <span className="ba-detail-ic">💚</span>
                  <div className="ba-detail-text">
                    <span className="ba-detail-lbl">Current SoH</span>
                    <span className="ba-detail-val" style={{ color: '#16A34A' }}>Good (92%)</span>
                  </div>
                </div>
                <div className="ba-detail-item">
                  <span className="ba-detail-ic">🔄</span>
                  <div className="ba-detail-text">
                    <span className="ba-detail-lbl">Cycle Count</span>
                    <span className="ba-detail-val">45</span>
                  </div>
                </div>
                <div className="ba-detail-item">
                  <span className="ba-detail-ic">🏭</span>
                  <div className="ba-detail-text">
                    <span className="ba-detail-lbl">Manufactured On</span>
                    <span className="ba-detail-val" style={{ fontSize: '11px' }}>10 Apr 2024</span>
                  </div>
                </div>
                <div className="ba-detail-item">
                  <span className="ba-detail-ic">🛡️</span>
                  <div className="ba-detail-text">
                    <span className="ba-detail-lbl">Warranty Valid Till</span>
                    <span className="ba-detail-val" style={{ fontSize: '11px' }}>14 Apr 2025</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Swi Bar */}
            <div className="ba-tabs">
              {['Overview', 'Battery Health', 'Inward Metrics', 'Documents', 'History'].map((tab) => (
                <div key={tab} className={`ba-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => handleTabClick(tab)}>
                  {tab}
                </div>
              ))}
            </div>

            {/* Tab Contents Overview Grid */}
            {activeTab === 'Overview' && (
              <div className="ba-grid-overview">
                
                {/* 1. Inward Information */}
                <div className="ba-card">
                  <div className="ba-card-hdr">
                    <h3 className="ba-card-tit">Inward Information</h3>
                  </div>
                  <div className="ba-info-list">
                    <div className="ba-info-row">
                      <span className="ba-info-lbl">Inward ID</span>
                      <span className="ba-info-val" style={{ fontFamily: 'monospace' }}>BINW-2024-5678</span>
                    </div>
                    <div className="ba-info-row">
                      <span className="ba-info-lbl">Inward Date & Time</span>
                      <span className="ba-info-val">20 May 2024, 10:15 AM</span>
                    </div>
                    <div className="ba-info-row">
                      <span className="ba-info-lbl">Inward Type</span>
                      <span className="ba-info-val">Manual</span>
                    </div>
                    <div className="ba-info-row">
                      <span className="ba-info-lbl">Inward Reason</span>
                      <span className="ba-info-val">New Battery Inward</span>
                    </div>
                    <div className="ba-info-row">
                      <span className="ba-info-lbl">Inward Location</span>
                      <span className="ba-info-val" style={{ textAlign: 'right' }}>Palika Bazaar, CP / New Delhi, Delhi</span>
                    </div>
                    <div className="ba-info-row">
                      <span className="ba-info-lbl">Assigned To</span>
                      <span className="ba-info-val">Rahul Sharma</span>
                    </div>
                    <div className="ba-info-row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                      <span className="ba-info-lbl">Notes</span>
                      <span className="ba-info-val" style={{ fontWeight: 500, color: '#64748B' }}>{notes}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Battery Health Overview (gauge + list) */}
                <div className="ba-card">
                  <div className="ba-card-hdr">
                    <h3 className="ba-card-tit">Battery Health Overview</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', height: '100%' }}>
                    <div className="ba-health-con">
                      <svg viewBox="0 0 36 36" className="ba-health-svg">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="2.5" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="2.5" strokeDasharray="92 8" strokeDashoffset="25" />
                      </svg>
                      <div className="ba-health-txt">
                        <div className="ba-health-num">92%</div>
                        <div className="ba-health-lbl" style={{ color: '#16A34A' }}>Good</div>
                      </div>
                    </div>
                    <div className="ba-info-list" style={{ flex: 1, gap: '8px' }}>
                      <div className="ba-info-row">
                        <span className="ba-info-lbl">State of Charge</span>
                        <span className="ba-info-val">78%</span>
                      </div>
                      <div className="ba-info-row">
                        <span className="ba-info-lbl">Voltage</span>
                        <span className="ba-info-val">48.6 V</span>
                      </div>
                      <div className="ba-info-row">
                        <span className="ba-info-lbl">Current</span>
                        <span className="ba-info-val">-12.4 A</span>
                      </div>
                      <div className="ba-info-row">
                        <span className="ba-info-lbl">Temperature</span>
                        <span className="ba-info-val">32°C</span>
                      </div>
                      <div className="ba-info-row">
                        <span className="ba-info-lbl">Health Status</span>
                        <span className="ba-info-val" style={{ color: '#16A34A' }}>Good</span>
                      </div>
                      <div className="ba-info-row">
                        <span className="ba-info-lbl">Power Status</span>
                        <span className="ba-info-val" style={{ color: '#16A34A' }}>Normal</span>
                      </div>
                    </div>
                  </div>
                  <button className="ba-btn" style={{ justifyContent: 'center' }} onClick={() => setActiveTab('Battery Health')}>
                    View Detailed Health Report
                  </button>
                </div>

                {/* 3. Battery Specifications */}
                <div className="ba-card">
                  <div className="ba-card-hdr">
                    <h3 className="ba-card-tit">Battery Specifications</h3>
                  </div>
                  <div className="ba-info-list">
                    <div className="ba-info-row">
                      <span className="ba-info-lbl">Battery ID</span>
                      <span className="ba-info-val" style={{ fontFamily: 'monospace' }}>BAT-450X-12340001</span>
                    </div>
                    <div className="ba-info-row">
                      <span className="ba-info-lbl">Model</span>
                      <span className="ba-info-val">450X-BAT-V1</span>
                    </div>
                    <div className="ba-info-row">
                      <span className="ba-info-lbl">IP Rating</span>
                      <span className="ba-info-val">IP67</span>
                    </div>
                    <div className="ba-info-row">
                      <span className="ba-info-lbl">Charging Voltage</span>
                      <span className="ba-info-val">54.6 V</span>
                    </div>
                    <div className="ba-info-row">
                      <span className="ba-info-lbl">Max Charge Current</span>
                      <span className="ba-info-val">25 A</span>
                    </div>
                    <div className="ba-info-row">
                      <span className="ba-info-lbl">Discharge Current</span>
                      <span className="ba-info-val">60 A</span>
                    </div>
                    <div className="ba-info-row">
                      <span className="ba-info-lbl">Cells Configuration</span>
                      <span className="ba-info-val">13S4P</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Bottom Panels Grid */}
            <div className="ba-grid-bottom">
              
              {/* 4. Recent Inwards Table */}
              <div className="ba-card">
                <div className="ba-card-hdr">
                  <h3 className="ba-card-tit">Recent Inwards</h3>
                  <span className="ba-link" onClick={() => alert('Opening full records logs...')}>View All</span>
                </div>
                <table className="ba-table">
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Inward ID</th>
                      <th>Inward By</th>
                      <th>Location</th>
                      <th style={{ textAlign: 'right' }}>Odometer</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>20 May 2024, 10:15 AM</td>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>BINW-2024-5678</td>
                      <td style={{ fontWeight: 600 }}>Rahul Sharma</td>
                      <td>Palika Bazaar, CP</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>2,156 km</td>
                    </tr>
                    <tr>
                      <td>16 May 2024, 09:30 AM</td>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>BINW-2024-5567</td>
                      <td style={{ fontWeight: 600 }}>Ritu Sharma</td>
                      <td>Karol Bagh</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>2,100 km</td>
                    </tr>
                    <tr>
                      <td>12 May 2024, 08:50 AM</td>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>BINW-2024-5446</td>
                      <td style={{ fontWeight: 600 }}>Mohit Singh</td>
                      <td>Paharganj</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>2,048 km</td>
                    </tr>
                    <tr>
                      <td>08 May 2024, 07:45 AM</td>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>BINW-2024-5335</td>
                      <td style={{ fontWeight: 600 }}>Neha Gupta</td>
                      <td>Rajendra Place</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>1,984 km</td>
                    </tr>
                    <tr>
                      <td>04 May 2024, 09:10 AM</td>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>BINW-2024-5224</td>
                      <td style={{ fontWeight: 600 }}>Sandeep Kumar</td>
                      <td>Janpath Market</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>1,923 km</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 5. Inward Checklist */}
              <div className="ba-card">
                <div className="ba-card-hdr">
                  <h3 className="ba-card-tit">Inward Checklist</h3>
                  <span className="ba-link" onClick={() => alert('View physical inspection logs...')}>View Checklist</span>
                </div>
                <div className="ba-info-list" style={{ gap: '8px' }}>
                  {checklist.map((item, idx) => (
                    <div key={idx} className="ba-chk-item">
                      <span className="ba-chk-lbl">
                        <span style={{ color: '#16A34A', fontWeight: 'bold' }}>✓</span>
                        {item.name}
                      </span>
                      <span className="ba-chk-val">OK</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Attachments deck */}
              <div className="ba-card">
                <div className="ba-card-hdr">
                  <h3 className="ba-card-tit">Attachments</h3>
                  <span className="ba-link" onClick={() => alert('Viewing all 5 document files')}>View All (5)</span>
                </div>
                <div className="ba-attach-grid">
                  <div className="ba-attach-card">
                    <div className="ba-attach-thumb">🏷️</div>
                    <span className="ba-attach-name">Battery Label</span>
                    <span className="ba-attach-date">20 May, 10:10 AM</span>
                  </div>
                  <div className="ba-attach-card">
                    <div className="ba-attach-thumb">🔌</div>
                    <span className="ba-attach-name">Connector Check</span>
                    <span className="ba-attach-date">20 May, 10:10 AM</span>
                  </div>
                  <div className="ba-attach-card">
                    <div className="ba-attach-thumb">📸</div>
                    <span className="ba-attach-name">Top View</span>
                    <span className="ba-attach-date">20 May, 10:10 AM</span>
                  </div>
                  <div className="ba-attach-card">
                    <div className="ba-attach-thumb">📦</div>
                    <span className="ba-attach-name">Packaging</span>
                    <span className="ba-attach-date">20 May, 10:10 AM</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '10px' }}>&lt;</button>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6D28D9', display: 'inline-block' }}></span>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#CBD5E1', display: 'inline-block' }}></span>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#CBD5E1', display: 'inline-block' }}></span>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '10px' }}>&gt;</button>
                </div>
              </div>

            </div>

            {/* 7. Process Timeline tracker */}
            <div className="ba-card">
              <div className="ba-card-hdr" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                <h3 className="ba-card-tit">Inward Timeline Tracker</h3>
              </div>
              <div className="ba-timeline">
                <div className="ba-tl-step">
                  <div className="ba-tl-circle done">✓</div>
                  <span className="ba-tl-label">Inward Created</span>
                  <span className="ba-tl-time">20 May 2024, 10:05 AM</span>
                </div>
                <div className="ba-tl-step">
                  <div className="ba-tl-circle done">✓</div>
                  <span className="ba-tl-label">Battery Received</span>
                  <span className="ba-tl-time">20 May 2024, 10:07 AM</span>
                </div>
                <div className="ba-tl-step">
                  <div className="ba-tl-circle done">✓</div>
                  <span className="ba-tl-label">Inspection Started</span>
                  <span className="ba-tl-time">20 May 2024, 10:08 AM</span>
                </div>
                <div className="ba-tl-step">
                  <div className="ba-tl-circle done">✓</div>
                  <span className="ba-tl-label">Inspection Completed</span>
                  <span className="ba-tl-time">20 May 2024, 10:12 AM</span>
                </div>
                <div className="ba-tl-step">
                  <div className="ba-tl-circle active">✓</div>
                  <span className="ba-tl-label">Inward Completed</span>
                  <span className="ba-tl-time">20 May 2024, 10:15 AM</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
