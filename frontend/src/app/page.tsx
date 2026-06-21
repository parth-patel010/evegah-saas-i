"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import FranchiseOnboard from "./franchise/onboard/page";

function AnimatedCount({ value }: { value: string | number }) {
  const [displayValue, setDisplayValue] = useState<string | number>(value);

  useEffect(() => {
    const str = String(value);
    const numericMatch = str.match(/[\d.]+/g);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }
    const numericStr = numericMatch.join('');
    const target = parseFloat(numericStr);
    if (isNaN(target)) {
      setDisplayValue(value);
      return;
    }
    let start = 0;
    const duration = 1000;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(start + easeProgress * (target - start));
      let formatted = String(current);
      if (str.includes('₹')) {
        formatted = '₹' + current.toLocaleString('en-IN');
      } else if (str.includes(',')) {
        formatted = current.toLocaleString('en-US');
      } else if (str.includes('%')) {
        formatted = current + '%';
      }
      setDisplayValue(formatted);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <>{displayValue}</>;
}

const COMMON_CSS = `
.role-switcher-fab { position: fixed; bottom: 20px; right: 20px; background: #2a195c; color: #fff; border: none; border-radius: 30px; padding: 10px 18px; font-size: 11.5px; font-weight: 800; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); z-index: 1000; display: flex; align-items: center; gap: 6px; transition: all 0.15s; }
.role-switcher-fab:hover { background: #4338CA; transform: scale(1.03); }
.role-dropdown-panel { position: fixed; bottom: 65px; right: 20px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.15); z-index: 1000; width: 220px; display: flex; flex-direction: column; gap: 6px; }
.role-opt { padding: 8px 12px; font-size: 11.5px; font-weight: 700; color: #475569; border: 1px solid transparent; border-radius: 6px; cursor: pointer; text-align: left; background: none; width: 100%; transition: all 0.15s; }
.role-opt:hover { background: #EEF2FF; color: #6366F1; }
.role-opt.act { background: #2a195c; color: #fff; }

@keyframes drawPath {
  to { stroke-dashoffset: 0; }
}
@keyframes scaleIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
.animate-draw {
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: drawPath 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.animate-draw-large {
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  animation: drawPath 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.animate-scale-in {
  transform-origin: center;
  animation: scaleIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
`;

/* ── Employee Dashboard CSS & Components ── */
const EMPLOYEE_CSS = `
.ev-shell{display:flex;min-height:100vh}
.ev-main{margin-left:230px;display:flex;flex-direction:column;min-height:100vh;flex:1;min-width:0;background:#fff}
.ev-body{padding:20px 22px 70px;flex:1;display:flex;flex-direction:column;gap:20px}
.ev-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.ev-sc{background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:15px 16px 13px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.ev-sc-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2px}
.ev-sc-ic{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ic-purple { background: #8B5CF6; color: #fff; }
.ic-green { background: #10B981; color: #fff; }
.ic-orange { background: #F97316; color: #fff; }
.ic-blue { background: #3B82F6; color: #fff; }
.ic-teal { background: #14B8A6; color: #fff; }
.ev-sc-tit{font-size:11.5px;font-weight:500;color:#6B7280}
.ev-sc-per{font-size:10.5px;color:#9CA3AF;margin-top:1px}
.ev-sc-val{font-size:28px;font-weight:800;color:#111827;line-height:1;margin:6px 0}
.ev-sc-bot{display:flex;align-items:center;justify-content:space-between}
.ev-sc-chg{display:flex;align-items:center;gap:3px;font-size:11.5px;font-weight:600}
.up{color:#16A34A}.dn{color:#DC2626}
.ev-sc-lbl{font-size:11px;color:#9CA3AF;margin-left:3px}
.ev-grid2{display:grid;grid-template-columns:1fr 276px;gap:18px;align-items:start}
.ev-cr-h{font-size:15.5px;font-weight:700;color:#111827}
.ev-cr-sh{font-size:12.5px;color:#6B7280;margin-top:3px;margin-bottom:14px}
.ev-cr-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:22px}
.ev-rc{background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:20px 14px 16px;display:flex;flex-direction:column;align-items:center;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.06);cursor:pointer;transition:box-shadow .18s,border-color .18s,transform .15s;text-decoration:none}
.ev-rc:hover{box-shadow:0 4px 14px rgba(0,0,0,.1);border-color:#6366F1;transform:translateY(-1px)}
.ev-rc-orb{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:11px}
.orb-purple{background:#EEF2FF;color:#2a195c}
.orb-green{background:#DCFCE7;color:#16A34A}
.orb-orange{background:#FEF3C7;color:#D97706}
.orb-blue{background:#EFF6FF;color:#2563EB}
.orb-teal{background:#F0FDFA;color:#0D9488}
.ev-rc-tit{font-size:13px;font-weight:700;color:#111827;margin-bottom:5px}
.ev-rc-desc{font-size:11.5px;color:#6B7280;line-height:1.45;margin-bottom:11px}
.ev-rc-lnk{font-size:12px;font-weight:600;display:flex;align-items:center;gap:4px}
.lnk-purple{color:#2a195c}.lnk-green{color:#16A34A}.lnk-orange{color:#D97706}.lnk-blue{color:#2563EB}.lnk-teal{color:#0D9488}
.ev-tcard{background:#fff;border:1px solid #E5E7EB;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.06);overflow:hidden}
.ev-tcard-hdr{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid #E5E7EB}
.ev-tcard-tit{font-size:14.5px;font-weight:700;color:#111827}
.ev-va{font-size:12px;font-weight:600;color:#2a195c;text-decoration:none}
.ev-dt{width:100%;border-collapse:collapse}
.ev-dt th{font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.06em;text-align:left;padding:9px 18px;background:#FAFBFD;border-bottom:1px solid #E5E7EB}
.ev-dt td{padding:11px 18px;font-size:12.5px;color:#111827;border-bottom:1px solid #F3F4F6;vertical-align:middle}
.ev-dt tr:last-child td{border-bottom:none}
.ev-dt tr:hover td{background:#FAFBFC}
.ev-rid{font-family:'SFMono-Regular',Consolas,monospace;font-size:11.5px;color:#6B7280}
.ev-type-cell{display:flex;align-items:center;gap:8px}
.ev-type-ic{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ev-sbadge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:600;white-space:nowrap}
.s-completed{background:#DCFCE7;color:#15803D}
.s-pending{background:#FEF9C3;color:#A16207}
.s-in_progress{background:#DBEAFE;color:#1D4ED8}
.ev-eye-btn{width:28px;height:28px;border:1px solid #E5E7EB;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#9CA3AF;background:#fff;cursor:pointer}
.ev-eye-btn:hover{border-color:#2a195c;color:#2a195c}
.ev-tcard-ft{display:flex;align-items:center;justify-content:space-between;padding:10px 18px;border-top:1px solid #E5E7EB}
.ev-tcard-ft-lbl{font-size:12px;color:#9CA3AF}
.ev-pg{display:flex;align-items:center;gap:3px}
.ev-pgb{width:28px;height:28px;border:1px solid #E5E7EB;border-radius:6px;background:#fff;font-size:12px;font-weight:500;color:#6B7280;display:flex;align-items:center;justify-content:center;cursor:pointer}
.ev-pgb.cur{background:#2a195c;color:#fff;border-color:#2a195c}
.ev-rp{display:flex;flex-direction:column;gap:14px}
.ev-pc{background:#fff;border:1px solid #E5E7EB;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.06);overflow:hidden}
.ev-pc-hdr{display:flex;align-items:center;justify-content:space-between;padding:12px 15px;border-bottom:1px solid #E5E7EB}
.ev-pc-tit{font-size:13.5px;font-weight:700;color:#111827}
.ev-pc-dt{font-size:11px;color:#9CA3AF}
.ev-sum-row{display:flex;align-items:center;justify-content:space-between;padding:9px 15px;border-bottom:1px solid #F3F4F6}
.ev-sum-row:last-of-type{border-bottom:none}
.ev-sum-l{display:flex;align-items:center;gap:8px}
.ev-sum-ic{width:20px;height:20px;border-radius:5px;display:flex;align-items:center;justify-content:center}
.ev-sum-lbl{font-size:12.5px;color:#6B7280}
.ev-sum-val{font-size:13px;font-weight:700;color:#111827}
.ev-pc-link{padding:10px 15px;border-top:1px solid #E5E7EB}
.ev-pc-link a{font-size:12px;font-weight:600;color:#2a195c;display:flex;align-items:center;gap:4px;text-decoration:none}
.ev-donut-wrap{padding:14px 15px;display:flex;flex-direction:column;align-items:center;gap:14px}
.ev-donut-rel{position:relative;width:140px;height:140px;display:flex;align-items:center;justify-content:center}
.ev-donut-center{position:absolute;text-align:center}
.ev-donut-num{font-size:22px;font-weight:800;color:#111827;line-height:1}
.ev-donut-lbl{font-size:10.5px;color:#9CA3AF;margin-top:2px}
.ev-legend{width:100%;display:flex;flex-direction:column;gap:6px}
.ev-leg{display:flex;align-items:center;justify-content:space-between}
.ev-leg-l{display:flex;align-items:center;gap:7px}
.ev-leg-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
.ev-leg-lbl{font-size:12px;color:#6B7280}
.ev-leg-val{font-size:12px;font-weight:600;color:#111827}
.ev-leg-pct{font-size:10.5px;color:#9CA3AF;font-weight:400;margin-left:2px}
.ev-kn-row{display:flex;align-items:center;gap:10px;padding:10px 15px;border-bottom:1px solid #F3F4F6;cursor:pointer;transition:background .1s;text-decoration:none}
.ev-kn-row:last-of-type{border-bottom:none}
.ev-kn-row:hover{background:#FAFBFC}
.ev-kn-ic{width:32px;height:32px;background:#EEF2FF;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#2a195c;flex-shrink:0}
.ev-kn-t{font-size:12.5px;font-weight:600;color:#111827}
.ev-kn-s{font-size:11px;color:#9CA3AF;margin-top:1px}
.ev-kn-ft{padding:10px 15px;border-top:1px solid #E5E7EB;text-align:center}
.ev-kn-ft a{font-size:12px;font-weight:600;color:#2a195c;display:inline-flex;align-items:center;gap:4px;text-decoration:none}
`;

/* ── Admin Dashboard CSS & Components ── */
const ADMIN_CSS = `
.adm-grid3 { display: grid; grid-template-columns: 1fr 280px 280px; gap: 16px; }
.adm-kpi-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.adm-kpi { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
.adm-kpi-top { display: flex; justify-content: space-between; align-items: flex-start; }
.adm-kpi-lbl { font-size: 11px; font-weight: 600; color: #64748B; }
.adm-kpi-ic { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.adm-kpi-val { font-size: 22px; font-weight: 800; color: #0F172A; margin: 8px 0 4px; }
.adm-kpi-bot { display: flex; align-items: center; justify-content: space-between; }
.adm-trend-up { font-size: 10.5px; color: #10B981; font-weight: 700; display: flex; align-items: center; gap: 2px; }
.adm-trend-dn { font-size: 10.5px; color: #EF4444; font-weight: 700; display: flex; align-items: center; gap: 2px; }
.adm-trend-per { font-size: 10px; color: #94A3B8; }

.adm-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); display: flex; flex-direction: column; overflow: hidden; }
.adm-card-hdr { padding: 12px 16px; border-bottom: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between; }
.adm-card-tit { font-size: 13.5px; font-weight: 700; color: #0F172A; }
.adm-card-body { padding: 16px; flex: 1; display: flex; flex-direction: column; position: relative; }

/* Admin spline chart details */
.adm-chart-legend { display: flex; gap: 12px; font-size: 10.5px; margin-bottom: 12px; }
.adm-legend-item { display: flex; align-items: center; gap: 4px; color: #475569; font-weight: 600; }
.adm-legend-dot { width: 7px; height: 7px; border-radius: 50%; }

/* System Health row */
.health-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F1F5F9; }
.health-item:last-child { border-bottom: none; }
.health-l { display: flex; align-items: center; gap: 8px; }
.health-icon { width: 24px; height: 24px; background: #EEF2FF; color: #4F46E5; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.health-lbl { font-size: 12px; font-weight: 700; color: #1E293B; }
.health-badge { padding: 2px 6px; background: #ECFDF5; color: #047857; border-radius: 4px; font-size: 9.5px; font-weight: 700; text-transform: uppercase; }

/* Recent Tickets */
.tkt-badge { padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; }
.tkt-open { background: #FEE2E2; color: #EF4444; }
.tkt-progress { background: #FFF7ED; color: #F97316; }
.tkt-hold { background: #EFF6FF; color: #3B82F6; }
.tkt-resolved { background: #ECFDF5; color: #10B981; }

/* Usage cards */
.adm-usage-grid { display: grid; grid-template-columns: repeat(4, 1fr) 280px; gap: 14px; }
.adm-usage-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
.adm-usage-top { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; color: #64748B; }
.adm-usage-ic { width: 24px; height: 24px; background: #EEF2FF; color: #6366F1; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.adm-usage-val { font-size: 14px; font-weight: 800; color: #0F172A; }
.adm-progress-bg { height: 6px; background: #E2E8F0; border-radius: 3px; overflow: hidden; margin-top: 4px; }
.adm-progress-fill { height: 100%; background: #6366F1; border-radius: 3px; }

.help-banner { background: #FAF5FF; border: 1.5px solid #E9D5FF; border-radius: 12px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; }
`;

/* ── Zone Manager Dashboard CSS & Components ── */
const ZONE_CSS = `
.zn-grid2 { display: grid; grid-template-columns: 1fr 320px; gap: 16px; }
.zn-station-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
.zn-station-hdr { display: flex; justify-content: space-between; align-items: center; font-size: 12.5px; font-weight: 700; color: #0F172A; }
.zn-battery-bar { height: 8px; background: #E2E8F0; border-radius: 4px; overflow: hidden; }
.zn-battery-fill { height: 100%; background: #10B981; }
`;

export default function DynamicDashboard() {
  const [role, setRole] = useState<string | null>(null);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("evegah_role");
    if (!storedRole) {
      router.push("/login");
      return;
    }
    setRole(storedRole);

    const updateRole = () => {
      const currentRole = localStorage.getItem("evegah_role");
      if (!currentRole) {
        router.push("/login");
      } else {
        setRole(currentRole);
      }
    };
    window.addEventListener("evegah_role_changed", updateRole);
    return () => window.removeEventListener("evegah_role_changed", updateRole);
  }, [router]);

  const handleRoleChange = (newRole: string) => {
    localStorage.setItem("evegah_role", newRole);
    setRole(newRole);
    window.dispatchEvent(new Event("evegah_role_changed"));
    setShowRoleDropdown(false);
  };

  // Condition 0: Checking auth state
  if (role === null) {
    return null;
  }

  // Condition 1: First-time login / Franchise onboarding view
  if (role === "first_time_franchise") {
    return <FranchiseOnboard />;
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: COMMON_CSS }} />
      
      {/* Floating Role Switcher Panel */}
      <button className="role-switcher-fab" onClick={() => setShowRoleDropdown(!showRoleDropdown)}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        Switch User View
      </button>

      {showRoleDropdown && (
        <div className="role-dropdown-panel">
          <button className={`role-opt ${role === 'employee' ? 'act' : ''}`} onClick={() => handleRoleChange('employee')}>Zone Employee (Operator)</button>
          <button className={`role-opt ${role === 'admin' ? 'act' : ''}`} onClick={() => handleRoleChange('admin')}>Platform Admin</button>
          <button className={`role-opt ${role === 'zone_manager' ? 'act' : ''}`} onClick={() => handleRoleChange('zone_manager')}>Zone Manager</button>
          <button className={`role-opt ${role === 'first_time_franchise' ? 'act' : ''}`} onClick={() => handleRoleChange('first_time_franchise')}>Franchise Owner Onboarding</button>
        </div>
      )}

      {/* Render selected Dashboard layout */}
      {role === "admin" ? (
        <AdminDashboard />
      ) : role === "zone_manager" ? (
        <ZoneManagerDashboard />
      ) : (
        <EmployeeDashboard />
      )}
    </>
  );
}

/* ──────────────────────────────────────────────────────── */
/* ── 2. ADMIN DASHBOARD VIEW (Image 1 Style) ───────────── */
/* ──────────────────────────────────────────────────────── */
function AdminDashboard() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS + EMPLOYEE_CSS }} />
      <div className="ev-shell">
        <Sidebar activePath="/" />
        <div className="ev-main">
          
          <TopBar title="Admin Dashboard" subtitle="Welcome back, Admin! Here's what's happening across Evegah." showHand={false} hideLeftAvatar={true} hideZone={true} notificationCount={8} />

          <div className="ev-body">
            
            {/* Date range selection */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '10px', padding: '8px 14px', fontSize: '12.5px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>May 12 – May 18, 2024</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </div>

              <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Export Report
              </button>
            </div>

            {/* KPI statistics cards */}
            <div className="adm-kpi-row">
              {[
                { label: 'Total Users', val: '3,842', change: '12.5%', up: true, class: 'ic-purple', icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                ), pts: '0,22 10,18 20,20 30,12 40,16 50,8 60,14 70,6 80,8' },
                { label: 'Active Zones', val: '128', change: '8.3%', up: true, class: 'ic-green', icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /></svg>
                ), pts: '0,28 10,24 20,25 30,18 40,22 50,12 60,18 70,10 80,12' },
                { label: 'Total Vehicles', val: '5,721', change: '10.1%', up: true, class: 'ic-blue', icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/></svg>
                ), pts: '0,26 10,22 20,24 30,14 40,20 50,8 60,16 70,10 80,6' },
                { label: 'Open Tickets', val: '342', change: '5.4%', up: false, class: 'ic-orange', icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ), pts: '0,6 10,10 20,8 30,18 40,14 50,22 60,16 70,18 80,24' },
                { label: 'Announcements', val: '24', change: '20%', up: true, class: 'ic-purple', icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /></svg>
                ), pts: '0,22 10,20 20,24 30,16 40,20 50,12 60,18 70,10 80,8' }
              ].map(kpi => (
                <div className="adm-kpi" key={kpi.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className={`ev-sc-ic ${kpi.class}`} style={{ margin: 0, width: '42px', height: '42px', flexShrink: 0 }}>{kpi.icon}</div>
                  <div className="zs-kpi-info" style={{ flex: 1 }}>
                    <span className="zs-kpi-lbl" style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>{kpi.label}</span>
                    <span className="zs-kpi-val" style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', display: 'block', marginTop: '2px' }}><AnimatedCount value={kpi.val} /></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 1: overview Spline, Tickets donut, System Health */}
            <div className="adm-grid3">
              
              {/* Overview Spline Chart */}
              <div className="adm-card" style={{ flex: 1 }}>
                <div className="adm-card-hdr">
                  <span className="adm-card-tit">Overview</span>
                  <select className="sa-select-sm">
                    <option>Last 7 Days</option>
                  </select>
                </div>
                <div className="adm-card-body">
                  <div className="adm-chart-legend">
                    <div className="adm-legend-item">
                      <span className="adm-legend-dot" style={{ background: '#6366F1' }} />
                      <span>Tickets Created</span>
                    </div>
                    <div className="adm-legend-item">
                      <span className="adm-legend-dot" style={{ background: '#10B981' }} />
                      <span>Tickets Resolved</span>
                    </div>
                    <div className="adm-legend-item">
                      <span className="adm-legend-dot" style={{ background: '#3B82F6' }} />
                      <span>Active Vehicles</span>
                    </div>
                  </div>

                  {/* SVG Multi Line Spline chart */}
                  <div style={{ flex: 1, position: 'relative', height: '140px' }}>
                    <svg viewBox="0 0 300 130" width="100%" height="100%" style={{ overflow: 'visible' }}>
                      <line x1="0" y1="120" x2="300" y2="120" stroke="#F1F5F9" strokeWidth="1.5" />
                      <line x1="0" y1="90" x2="300" y2="90" stroke="#F1F5F9" strokeWidth="1.5" />
                      <line x1="0" y1="60" x2="300" y2="60" stroke="#F1F5F9" strokeWidth="1.5" />
                      <line x1="0" y1="30" x2="300" y2="30" stroke="#F1F5F9" strokeWidth="1.5" />

                      {/* Tickets Created Path */}
                      <path className="animate-draw-large" d="M 0 90 Q 50 65, 100 85 T 200 70 T 300 45" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
                      {/* Tickets Resolved Path */}
                      <path className="animate-draw-large" d="M 0 110 Q 50 95, 100 100 T 200 90 T 300 65" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                      {/* Active Vehicles Path */}
                      <path className="animate-draw-large" d="M 0 45 Q 50 35, 100 50 T 200 38 T 300 25" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />

                      {[
                        { cx: 0, day: '12 May' },
                        { cx: 50, day: '13 May' },
                        { cx: 100, day: '14 May' },
                        { cx: 150, day: '15 May' },
                        { cx: 200, day: '16 May' },
                        { cx: 250, day: '17 May' },
                        { cx: 300, day: '18 May' }
                      ].map((pt, idx) => (
                        <text key={idx} x={pt.cx} y="132" fontSize="8" fill="#94A3B8" textAnchor="middle" fontWeight="bold">{pt.day}</text>
                      ))}
                    </svg>
                  </div>
                </div>
              </div>

              {/* Tickets by Status Donut */}
              <div className="adm-card">
                <div className="adm-card-hdr">
                  <span className="adm-card-tit">Tickets by Status</span>
                </div>
                <div className="adm-card-body" style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                    <svg className="animate-scale-in" viewBox="0 0 100 100" width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#6366F1" strokeWidth="12" strokeDasharray="68.8 182.6" strokeDashoffset="0" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" strokeWidth="12" strokeDasharray="83.6 167.8" strokeDashoffset="-68.8" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3B82F6" strokeWidth="12" strokeDasharray="25.8 225.6" strokeDashoffset="-152.4" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="12" strokeDasharray="72.8 178.6" strokeDashoffset="-178.2" />
                    </svg>
                    <div className="bdonut-center">
                      <span className="bdonut-num" style={{ fontSize: '15px' }}>1,248</span>
                      <span className="bdonut-lbl" style={{ fontSize: '6.5px' }}>Total</span>
                    </div>
                  </div>

                  <div className="blegend" style={{ marginTop: '12px' }}>
                    {[
                      { color: '#6366F1', label: 'Open', count: 342, pct: '27.4%' },
                      { color: '#F59E0B', label: 'In Progress', count: 416, pct: '33.3%' },
                      { color: '#3B82F6', label: 'On Hold', count: 128, pct: '10.3%' },
                      { color: '#10B981', label: 'Resolved', count: 362, pct: '29.0%' }
                    ].map(l => (
                      <div className="bleg-row" key={l.label}>
                        <div className="bleg-row-l">
                          <span className="bleg-dot" style={{ background: l.color }} />
                          <span>{l.label}</span>
                        </div>
                        <span className="bleg-val">{l.count} <span style={{ color: '#94A3B8', fontWeight: 'normal' }}>({l.pct})</span></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div className="adm-card">
                <div className="adm-card-hdr">
                  <span className="adm-card-tit">System Health</span>
                  <a href="/settings" className="sa-viewall">View Status</a>
                </div>
                <div className="adm-card-body" style={{ padding: '0 16px', justifyContent: 'center' }}>
                  {[
                    { lbl: 'API Services', status: 'Operational' },
                    { lbl: 'Database', status: 'Operational' },
                    { lbl: 'File Storage', status: 'Operational' },
                    { lbl: 'Push Notifications', status: 'Operational' },
                    { lbl: 'Email Service', status: 'Operational' }
                  ].map(h => (
                    <div className="health-item" key={h.lbl}>
                      <div className="health-l">
                        <span className="health-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                        <span className="health-lbl">{h.lbl}</span>
                      </div>
                      <span className="health-badge">{h.status}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Row 2: Recent Tickets, Top Zones, Announcements */}
            <div className="adm-grid3">
              
              {/* Recent Tickets */}
              <div className="adm-card">
                <div className="adm-card-hdr">
                  <span className="adm-card-tit">Recent Tickets</span>
                  <a href="/alerts" className="sa-viewall">View All</a>
                </div>
                <div className="adm-card-body" style={{ padding: 0 }}>
                  <table className="sa-dt-table">
                    <thead>
                      <tr>
                        <th>Ticket</th>
                        <th>Status</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { title: 'Vehicle not exiting zone', code: '#TK-2148', zone: 'South Depot Zone', status: 'Open', color: 'tkt-open', time: 'May 18, 2024 10:30 AM' },
                        { title: 'Battery threshold alert', code: '#TK-2147', zone: 'North Warehouse', status: 'In Progress', color: 'tkt-progress', time: 'May 18, 2024 09:15 AM' },
                        { title: 'Geofence breach detected', code: '#TK-2146', zone: 'Port Area Zone', status: 'On Hold', color: 'tkt-hold', time: 'May 17, 2024 04:45 PM' },
                        { title: 'Vehicle maintenance overdue', code: '#TK-2145', zone: 'Central Zone', status: 'Resolved', color: 'tkt-resolved', time: 'May 17, 2024 02:20 PM' },
                        { title: 'Low battery warning', code: '#TK-2144', zone: 'South Depot Zone', status: 'Resolved', color: 'tkt-resolved', time: 'May 17, 2024 11:10 AM' }
                      ].map((t, idx) => (
                        <tr key={idx}>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontWeight: '700', fontSize: '11.5px' }}>{t.title}</span>
                              <span style={{ fontSize: '10px', color: '#94A3B8' }}>{t.code} • {t.zone}</span>
                            </div>
                          </td>
                          <td><span className={`tkt-badge ${t.color}`}>{t.status}</span></td>
                          <td style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '500' }}>{t.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Zones by Activity */}
              <div className="adm-card">
                <div className="adm-card-hdr">
                  <span className="adm-card-tit">Top Zones by Activity</span>
                  <a href="/zones" className="sa-viewall">View All</a>
                </div>
                <div className="adm-card-body" style={{ padding: 0 }}>
                  <table className="sa-dt-table">
                    <thead>
                      <tr>
                        <th>Zone</th>
                        <th>Active Vehicles</th>
                        <th>Alerts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'South Depot Zone', vehicles: 812, alerts: 24 },
                        { name: 'North Warehouse', vehicles: 645, alerts: 18 },
                        { name: 'Port Area Zone', vehicles: 510, alerts: 16 },
                        { name: 'Central Zone', vehicles: 438, alerts: 12 },
                        { name: 'Industrial Zone', vehicles: 362, alerts: 9 }
                      ].map((z, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: '700' }}>{z.name}</td>
                          <td style={{ fontWeight: '600', color: '#475569' }}>{z.vehicles}</td>
                          <td style={{ fontWeight: '800', color: '#EF4444' }}>{z.alerts}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ padding: '12px' }}>
                    <button className="on-back-btn" style={{ width: '100%', justifyContent: 'center' }}>View All Zones</button>
                  </div>
                </div>
              </div>

              {/* Announcements */}
              <div className="adm-card">
                <div className="adm-card-hdr">
                  <span className="adm-card-tit">Announcements</span>
                  <a href="/announcements" className="sa-viewall">View All</a>
                </div>
                <div className="adm-card-body" style={{ padding: '12px 16px', gap: '10px', justifyContent: 'flex-start' }}>
                  {[
                    { label: 'System Maintenance Scheduled', desc: 'System maintenance on May 20, 2024', time: 'May 18, 2024' },
                    { label: 'New Feature Update', desc: 'Check out the new analytics dashboard', time: 'May 16, 2024' },
                    { label: 'High Temperature Alert', desc: 'High temperatures expected this week', time: 'May 15, 2024' }
                  ].map((ann, idx) => (
                    <div className="inward-item" key={idx}>
                      <div className="inward-l">
                        <span className="inward-icon" style={{ background: '#F5F3FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3z"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                        </span>
                        <div className="inward-info">
                          <span className="inward-code" style={{ fontSize: '11px' }}>{ann.label}</span>
                          <span className="inward-name" style={{ fontSize: '9.5px' }}>{ann.desc}</span>
                        </div>
                      </div>
                      <div className="inward-r">
                        <span className="badge-pill badg-app-approved" style={{ fontSize: '7.5px', padding: '1px 5px', minWidth: 'auto' }}>Published</span>
                        <span className="inward-time">{ann.time}</span>
                      </div>
                    </div>
                  ))}

                  <button className="fr-btn fr-btn-primary" style={{ marginTop: 'auto', width: '100%', justifyContent: 'center', borderRadius: '8px', fontSize: '11.5px', padding: '8px' }}>Create Announcement</button>
                </div>
              </div>

            </div>

            {/* Platform Usage Summary */}
            <div className="adm-usage-grid">
              {[
                { label: 'Storage Used', val: '256 GB / 1 TB', pct: '25%', numPct: 25 },
                { label: 'API Calls', val: '128,532 / 500K', pct: '25.7%', numPct: 25.7 },
                { label: 'Push Sent', val: '45,132 / 100K', pct: '45.1%', numPct: 45.1 },
                { label: 'Email Sent', val: '32,145 / 100K', pct: '32.1%', numPct: 32.1 }
              ].map(u => (
                <div className="adm-usage-card" key={u.label}>
                  <div className="adm-usage-top">
                    <span className="adm-usage-ic" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                    </span>
                    <span>{u.label}</span>
                  </div>
                  <div className="adm-usage-val">{u.val}</div>
                  <div className="adm-progress-bg">
                    <div className="adm-progress-fill" style={{ width: `${u.numPct}%` }} />
                  </div>
                  <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 'bold', textAlign: 'right' }}>{u.pct}</span>
                </div>
              ))}

              <div className="help-banner" style={{ gridColumn: 'span 1' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>Need Help?</span>
                  <span style={{ fontSize: '9.5px', color: '#64748B' }}>Contact support for assistance</span>
                </div>
                <button className="fr-btn fr-btn-primary" style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px' }}>Support</button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────────────── */
/* ── 3. ZONE MANAGER DASHBOARD VIEW ────────────────────── */
/* ──────────────────────────────────────────────────────── */
function ZoneManagerDashboard() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ZONE_CSS + EMPLOYEE_CSS }} />
      <div className="ev-shell">
        <Sidebar activePath="/" />
        <div className="ev-main">
          
          <TopBar title="Zone Manager Dashboard" subtitle="Monitoring and managing Connaught Place Zone." showHand={false} />

          <div className="ev-body">
            
            {/* KPI cards (5) */}
            <div className="adm-kpi-row">
              {[
                { label: 'Zone Active Vehicles', val: '412', change: '8.5%', up: true, class: 'ic-blue', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
                { label: 'Available Batteries', val: '184', change: '4.2%', up: true, class: 'ic-teal', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/></svg> },
                { label: 'Active Swap Stations', val: '8 / 8', change: '100% Online', up: true, class: 'ic-green', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
                { label: "Today's Swaps", val: '92 swaps', change: '12% vs yesterday', up: true, class: 'ic-purple', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg> },
                { label: 'Zone Revenue (Today)', val: '₹24,500', change: '18% vs last week', up: true, class: 'ic-green', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> }
              ].map(k => (
                <div className="adm-kpi" key={k.label} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className={`ev-sc-ic ${k.class}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, width: '42px', height: '42px', flexShrink: 0 }}>{k.icon}</div>
                  <div className="zs-kpi-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span className="zs-kpi-lbl" style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>{k.label}</span>
                    <span className="zs-kpi-val" style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', display: 'block', marginTop: '2px' }}>{k.val}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Content: Zone Map and Station Charge Status */}
            <div className="zn-grid2">
              {/* Geofence Map */}
              <div className="adm-card" style={{ height: '380px' }}>
                <div className="adm-card-hdr">
                  <span className="adm-card-tit">Connaught Place Zone Live Map</span>
                </div>
                <div className="adm-card-body" style={{ padding: 0, background: '#F8FAFC' }}>
                  <svg width="100%" height="100%" style={{ minHeight: '300px' }}>
                    {/* Geofence layout */}
                    <polygon points="100 50, 320 20, 420 180, 200 240" fill="rgba(99, 102, 241, 0.08)" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="2.5" strokeDasharray="4 4" />
                    
                    {/* Routes */}
                    <path d="M 120 70 C 180 90, 240 120, 310 170" fill="none" stroke="#6366F1" strokeWidth="2" strokeDasharray="3 3" />
                    <path d="M 220 30 C 260 100, 300 150, 350 210" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="3 3" />
                    
                    {/* Vehicle Markers */}
                    <circle cx="180" cy="90" r="6" fill="#6366F1" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="280" cy="150" r="6" fill="#10B981" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="310" cy="90" r="6" fill="#EF4444" stroke="#fff" strokeWidth="1.5" />
                    <circle cx="210" cy="180" r="6" fill="#6366F1" stroke="#fff" strokeWidth="1.5" />
                    
                    {/* Labels */}
                    <text x="210" y="210" fontSize="10" fill="#475569" fontWeight="bold" textAnchor="middle">Inner Circle geofence</text>
                  </svg>
                </div>
              </div>

              {/* Station battery status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="adm-card">
                  <div className="adm-card-hdr">
                    <span className="adm-card-tit">Swap Stations Status</span>
                  </div>
                  <div className="adm-card-body" style={{ gap: '10px' }}>
                    {[
                      { name: 'CP Hub Station A', charged: 24, total: 32, pct: 75, color: '#10B981' },
                      { name: 'CP Metro Gate 2 Station', charged: 14, total: 16, pct: 87, color: '#10B981' },
                      { name: 'Janpath Crossing Cabinet', charged: 6, total: 12, pct: 50, color: '#F59E0B' },
                      { name: 'Barakhamba Road Cabinet', charged: 2, total: 8, pct: 25, color: '#EF4444' }
                    ].map(st => (
                      <div className="zn-station-card" key={st.name}>
                        <div className="zn-station-hdr">
                          <span>{st.name}</span>
                          <span style={{ color: st.color }}>{st.charged}/{st.total} Charged</span>
                        </div>
                        <div className="zn-battery-bar">
                          <div className="zn-battery-fill" style={{ width: `${st.pct}%`, background: st.color }} />
                        </div>
                        <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 'bold', textAlign: 'right' }}>{st.pct}% Capacity Available</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}

const ROWS = [
  { id: "REQ-2024-0518-0012", type: "new_rider", name: "Amit Kumar", mob: "+91 98765 43210", st: "completed", d1: "May 18, 2024", d2: "10:30 AM" },
  { id: "REQ-2024-0518-0011", type: "retain_rider", name: "Neha Gupta", mob: "+91 91254 56789", st: "pending", d1: "May 18, 2024", d2: "09:45 AM" },
  { id: "REQ-2024-0518-0010", type: "return_ride", name: "Rohit Singh", mob: "+91 99876 54321", st: "in_progress", d1: "May 18, 2024", d2: "09:15 AM" },
  { id: "REQ-2024-0518-0009", type: "extend_ride", name: "Sneha Reddy", mob: "+91 87654 32109", st: "completed", d1: "May 18, 2024", d2: "08:30 AM" },
  { id: "REQ-2024-0518-0008", type: "battery_swap", name: "Vikram Patel", mob: "+91 78945 61230", st: "pending", d1: "May 18, 2024", d2: "08:05 AM" }
];

const T_CFG: Record<string, { label: string; ic: string; icon: React.ReactNode }> = {
  new_rider:    { label: "New Rider",    ic: "ic-purple", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  retain_rider: { label: "Retain Rider", ic: "ic-green",  icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
  return_ride:  { label: "Return Ride",  ic: "ic-orange", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg> },
  extend_ride:  { label: "Extend Ride",  ic: "ic-blue",   icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  battery_swap: { label: "Battery Swap", ic: "ic-teal",   icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/></svg> }
};

const S_LBL: Record<string, string> = {
  completed: "Completed",
  pending: "Pending",
  in_progress: "In Progress"
};

function DonutChart() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const DPR = window.devicePixelRatio || 2, SZ = 140;
    c.width = SZ * DPR;
    c.height = SZ * DPR;
    c.style.width = SZ + "px";
    c.style.height = SZ + "px";
    ctx.scale(DPR, DPR);
    const cx = SZ / 2, cy = SZ / 2, R = 56, r = 37;
    const slices = [
      { v: 96, color: "#22C55E" },
      { v: 28, color: "#3B82F6" },
      { v: 32, color: "#F59E0B" },
      { v: 12, color: "#EF4444" },
      { v: 20, color: "#6B7280" }
    ];
    let a = -Math.PI / 2;
    slices.forEach(({ v, color }) => {
      const da = (v / 208) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, a, a + da);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      a += da;
    });
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    a = -Math.PI / 2;
    slices.forEach(({ v }) => {
      ctx.beginPath();
      ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      a += (v / 208) * 2 * Math.PI;
    });
  }, []);
  return <canvas ref={ref} />;
}

function EmployeeDashboard() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: EMPLOYEE_CSS }} />
      <div className="ev-shell">
        <Sidebar activePath="/" />
        <div className="ev-main">
          <TopBar />
          
          <div className="ev-body">
            
            {/* Stat Cards */}
            <div className="ev-stats">
              {[
                { tit: "Requests Created", per: "This Month", v: 128, chg: 18.4, up: true, pts: "0,28 14,22 28,18 40,20 52,12 64,15 76,8 82,10", clr: "#6366F1", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, cls: "ic-purple" },
                { tit: "Completed Requests", per: "This Month", v: 96, chg: 16.7, up: true, pts: "0,30 14,24 28,18 40,14 52,18 64,10 76,13 82,6", clr: "#22C55E", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>, cls: "ic-green" },
                { tit: "Pending Requests", per: "Currently", v: 32, chg: 5.2, up: false, pts: "0,8 14,13 28,10 40,18 52,14 64,22 76,17 82,20", clr: "#F59E0B", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, cls: "ic-orange" },
                { tit: "Total Riders", per: "Managed", v: 356, chg: 12.3, up: true, pts: "0,22 14,20 28,24 40,16 52,20 64,13 76,17 82,11", clr: "#14B8A6", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, cls: "ic-teal" }
              ].map(c => (
                <div className="ev-sc" key={c.tit} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className={`ev-sc-ic ${c.cls}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0, width: '42px', height: '42px', flexShrink: 0 }}>{c.icon}</div>
                  <div className="zs-kpi-info" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span className="zs-kpi-lbl" style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>{c.tit}</span>
                    <span className="zs-kpi-val" style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', display: 'block', marginTop: '2px' }}><AnimatedCount value={c.v} /></span>
                  </div>
                </div>
              ))}
            </div>

            {/* 2-col grid */}
            <div className="ev-grid2">
              <div>
                <div className="ev-cr-h">Create New Request</div>
                <div className="ev-cr-sh">Select the type of request you want to create on behalf of the rider.</div>
                
                <div className="ev-cr-grid">
                  {[
                    { oc: "orb-purple", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, tit: "New Rider", desc: "Onboard a new rider and create a new ride.", lnk: "Create New Rider", lc: "lnk-purple", href: "/new-rider" },
                    { oc: "orb-green", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>, tit: "Retain Rider", desc: "Retain existing rider and start a new ride.", lnk: "Retain Rider", lc: "lnk-green", href: "/retain-rider" },
                    { oc: "orb-orange", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>, tit: "Return Ride", desc: "Complete the ride and initiate return.", lnk: "Return Ride", lc: "lnk-orange", href: "/return-ride" },
                    { oc: "orb-blue", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, tit: "Extend Ride", desc: "Extend the current ride duration.", lnk: "Extend Ride", lc: "lnk-blue", href: "/extend-ride" },
                    { oc: "orb-teal", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/></svg>, tit: "Battery Swap", desc: "Request battery swap for active ride.", lnk: "Battery Swap", lc: "lnk-teal", href: "/battery-swap" }
                  ].map(c => (
                    <a href={c.href} className="ev-rc" key={c.tit}>
                      <div className={`ev-rc-orb ${c.oc}`}>{c.icon}</div>
                      <div className="ev-rc-tit">{c.tit}</div>
                      <div className="ev-rc-desc">{c.desc}</div>
                      <span className={`ev-rc-lnk ${c.lc}`}>
                        {c.lnk} &gt;
                      </span>
                    </a>
                  ))}
                </div>

                {/* Table */}
                <div className="ev-tcard">
                  <div className="ev-tcard-hdr">
                    <div className="ev-tcard-tit">My Recent Requests</div>
                    <a className="ev-va" href="/registrations">View All</a>
                  </div>
                  <table className="ev-dt">
                    <thead>
                      <tr>
                        <th>Rider Name</th>
                        <th>Type</th>
                        <th>Mobile Number</th>
                        <th>Status</th>
                        <th>Created On</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ROWS.map(r => {
                        const t = T_CFG[r.type];
                        return (
                          <tr key={r.id}>
                            <td style={{ fontWeight: 600 }}>{r.name}</td>
                            <td>
                              <div className="ev-type-cell">
                                <div className={`ev-type-ic ${t.ic}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {t.icon}
                                </div>
                                <span style={{ fontSize: '12.5px', fontWeight: 500 }}>
                                  {t.label}
                                </span>
                              </div>
                            </td>
                            <td style={{ color: "#6B7280" }}>{r.mob}</td>
                            <td>
                              <span className={`ev-sbadge s-${r.st}`}>
                                {S_LBL[r.st]}
                              </span>
                            </td>
                            <td>
                              <div style={{ fontSize: '12px', fontWeight: 500, color: "#111827" }}>{r.d1}</div>
                              <div style={{ fontSize: '11px', color: "#9CA3AF" }}>{r.d2}</div>
                            </td>
                            <td>
                              <a href={`/new-rider?id=${r.id}`} className="ev-eye-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Side summary */}
              <div className="ev-rp">
                <div className="ev-pc">
                  <div className="ev-pc-hdr">
                    <div className="ev-pc-tit">Today&apos;s Summary</div>
                    <div className="ev-pc-dt">May 18, 2024</div>
                  </div>
                  {[
                    { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, cls: "ic-purple", lbl: "Requests Created", v: 12 },
                    { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>, cls: "ic-green", lbl: "Requests Completed", v: 8 },
                    { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, cls: "ic-orange", lbl: "Pending Requests", v: 4 },
                    { icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/></svg>, cls: "ic-teal", lbl: "Battery Swap Requests", v: 6 }
                  ].map(s => (
                    <div className="ev-sum-row" key={s.lbl}>
                      <div className="ev-sum-l">
                        <div className={`ev-sum-ic ${s.cls}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                        <span className="ev-sum-lbl">{s.lbl}</span>
                      </div>
                      <span className="ev-sum-val">{s.v}</span>
                    </div>
                  ))}
                </div>

                <div className="ev-pc">
                  <div className="ev-pc-hdr">
                    <div className="ev-pc-tit">Request Status Overview</div>
                  </div>
                  <div className="ev-donut-wrap">
                    <div className="ev-donut-rel">
                      <DonutChart />
                      <div className="ev-donut-center">
                        <div className="ev-donut-num">208</div>
                        <div className="ev-donut-lbl">Total</div>
                      </div>
                    </div>
                    <div className="ev-legend">
                      {[
                        { c: "#22C55E", l: "Completed", v: 96, p: "46%" },
                        { c: "#3B82F6", l: "In Progress", v: 28, p: "13%" },
                        { c: "#F59E0B", l: "Pending", v: 32, p: "15%" },
                        { c: "#EF4444", l: "Cancelled", v: 12, p: "6%" },
                        { c: "#6B7280", l: "Rejected", v: 20, p: "10%" }
                      ].map(l => (
                        <div className="ev-leg" key={l.l}>
                          <div className="ev-leg-l">
                            <div className="ev-leg-dot" style={{ background: l.c }} />
                            <span className="ev-leg-lbl">{l.l}</span>
                          </div>
                          <span className="ev-leg-val">
                            {l.v}
                            <span className="ev-leg-pct"> ({l.p})</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}
