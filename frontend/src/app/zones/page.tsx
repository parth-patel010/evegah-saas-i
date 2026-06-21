"use client";
import { useState, useMemo, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import Link from 'next/link';
import { api } from '@/lib/api';

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

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.zm-shell{display:flex;min-height:100vh;background:#F3F4F9;font-family:Inter,sans-serif;}
.zm-main{margin-left:240px;display:flex;flex-direction:column;min-height:100vh;width:calc(100% - 240px);}
.zm-page{flex:1;padding:0 28px 60px;}

/* breadcrumb */
.zm-bc{display:flex;align-items:center;gap:6px;padding:14px 0 0;font-size:12px;color:#9CA3AF;}
.zm-bc a{color:#9CA3AF;text-decoration:none;}
.zm-bc a:hover{color:#4F46E5;}
.zm-bc-sep{color:#D1D5DB;}
.zm-bc-cur{color:#4F46E5;font-weight:600;}

/* Header Title row */
.zm-title-row{display:flex;align-items:flex-start;justify-content:space-between;margin:12px 0 18px;gap:16px;}
.zm-h1{font-size:22px;font-weight:800;color:#111827;margin:0 0 4px;}
.zm-sub{font-size:13px;color:#6B7280;margin:0;}
.zm-hdr-actions{display:flex;align-items:center;gap:10px;}
.zm-hdr-btn{display:flex;align-items:center;gap:7px;padding:9px 16px;background:#fff;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;font-weight:600;color:#374151;cursor:pointer;font-family:inherit;box-shadow:0 1px 3px rgba(0,0,0,.06);transition:all .15s;}
.zm-hdr-btn:hover{border-color:#4F46E5;color:#4F46E5;}
.zm-hdr-btn-primary{background:#4F46E5;color:#fff;border-color:#4F46E5;}
.zm-hdr-btn-primary:hover{background:#4338CA;border-color:#4338CA;color:#fff;}

/* Main Map + Panel Layout grid */
.zm-layout-grid{display:grid;grid-template-columns:1fr 310px;gap:20px;margin-bottom:20px;align-items:start;}

/* Map Container Card */
.zm-map-card{background:#fff;border:1px solid #E5E7EB;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,.06);overflow:hidden;position:relative;height:520px;}
.zm-map-bg{width:100%;height:100%;position:relative;}

/* Floating map controls (left side) */
.zm-map-ctrls{position:absolute;top:20px;left:20px;display:flex;flex-direction:column;gap:8px;z-index:1000;}
.zm-ctrl-btn{width:40px;height:48px;border-radius:10px;background:#fff;border:1px solid #E5E7EB;box-shadow:0 2px 8px rgba(0,0,0,.08);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer;color:#4B5563;font-size:9px;font-weight:700;transition:all .15s;}
.zm-ctrl-btn:hover{color:#4F46E5;border-color:#C7D2FE;}
.zm-ctrl-btn.active{background:#4F46E5;color:#fff;border-color:#4F46E5;}

/* Map Loading Overlay */
.zm-map-loading{position:absolute;inset:0;background:rgba(243,244,249,0.9);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:20;font-size:14px;color:#4F46E5;font-weight:600;gap:12px;}
.zm-map-search{position:absolute;top:20px;right:20px;z-index:1000;display:flex;align-items:center;background:#fff;border:1.5px solid #E2E8F0;border-radius:10px;padding:6px 12px;width:220px;box-shadow:0 4px 12px rgba(0,0,0,.08);}
.zm-map-search-input{border:none;font-size:12.5px;outline:none;width:100%;color:#1E293B;font-weight:500;margin-left:8px;}

/* Right Side Panel Selected zone details */
.zm-side-panel{background:#fff;border:1px solid #E5E7EB;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,.06);overflow:hidden;height:520px;display:flex;flex-direction:column;}
.zm-side-hdr{padding:14px 16px;border-bottom:1px solid #E5E7EB;display:flex;align-items:center;justify-content:space-between;}
.zm-side-title{font-size:14px;font-weight:700;color:#111827;}
.zm-side-body{padding:14px 16px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;}

.zm-veh-brief{display:flex;align-items:center;gap:12px;background:#F9FAFB;border-radius:10px;padding:10px 12px;border:1px solid #E5E7EB;}
.zm-veh-img-wrap{width:46px;height:46px;border-radius:8px;background:#EEF2FF;border:1px solid #E5E7EB;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;font-weight:bold;color:#4F46E5;}
.zm-veh-badge{font-size:11px;font-weight:700;padding:2px 8px;border-radius:6px;display:inline-block;}
.zm-veh-badge.online{background:#DCFCE7;color:#16A34A;}
.zm-veh-badge.offline{background:#F3F4F6;color:#6B7280;}

.zm-spec-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.zm-spec-box{display:flex;flex-direction:column;gap:2px;}
.zm-spec-lbl{font-size:10.5px;color:#9CA3AF;font-weight:600;}
.zm-spec-val{font-size:12.5px;font-weight:700;color:#111827;}

/* Action grid */
.zm-action-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:2px;}
.zm-act-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:8px 4px;border:1.5px solid #E5E7EB;border-radius:8px;background:#fff;cursor:pointer;transition:all .15s;}
.zm-act-btn:hover{border-color:#4F46E5;color:#4F46E5;background:#F5F3FF;}
.zm-act-btn-lbl{font-size:9.5px;font-weight:700;color:#374151;text-align:center;}

.zm-cta-btn{width:100%;padding:10px;background:#4F46E5;color:#fff;border-radius:8px;font-size:12.5px;font-weight:700;cursor:pointer;border:none;font-family:inherit;text-align:center;text-decoration:none;box-shadow:0 2px 6px rgba(79,70,229,.35);transition:background .15s;margin-top:auto;}
.zm-cta-btn:hover{background:#4338CA;}

/* Bottom Grid cards */
.zm-bottom-grid{display:grid;grid-template-columns:1.3fr 1.3fr 1fr;gap:20px;}
.zm-bot-card{background:#fff;border:1px solid #E5E7EB;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,.06);overflow:hidden;height:350px;display:flex;flex-direction:column;}
.zm-bot-hdr{padding:14px 18px;border-bottom:1px solid #E5E7EB;display:flex;align-items:center;justify-content:space-between;}
.zm-bot-title{font-size:13.5px;font-weight:700;color:#111827;}
.zm-bot-body{padding:14px 18px;flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;}

/* Timeline elements */
.zm-timeline{display:flex;flex-direction:column;gap:0;position:relative;padding-left:18px;}
.zm-timeline::before{content:'';position:absolute;left:4px;top:6px;bottom:6px;width:1.5px;background:#E5E7EB;}
.zm-tl-item{display:flex;align-items:flex-start;justify-content:space-between;padding-bottom:14px;position:relative;}
.zm-tl-item:last-child{padding-bottom:0;}
.zm-tl-item::before{content:'';position:absolute;left:-18px;top:5px;width:9px;height:9px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.2);z-index:2;}
.zm-tl-item.online::before{background:#10B981;}
.zm-tl-item.in_ride::before{background:#4F46E5;}
.zm-tl-item.offline::before{background:#EF4444;}
.zm-tl-item.low_bat::before{background:#F59E0B;}
.zm-tl-info{display:flex;flex-direction:column;gap:2px;}
.zm-tl-title{font-size:12px;font-weight:700;color:#1E293B;}
.zm-tl-desc{font-size:11px;color:#6B7280;line-height:1.4;}
.zm-tl-time{font-size:10px;color:#9CA3AF;font-weight:600;white-space:nowrap;}

.zm-shell { display: flex; min-height: 100vh; background: #F8F9FF; font-family: 'Inter', sans-serif; }
.zm-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.zm-page { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 20px; }

/* Breadcrumb */
.zm-bc { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748B; font-weight: 500; }
.zm-bc a { color: #8B5CF6; text-decoration: none; font-weight: 600; transition: color .15s; }
.zm-bc a:hover { color: #6D28D9; }
.zm-bc-sep { color: #D8B4FE; font-weight: 600; }
.zm-bc-cur { color: #0F172A; font-weight: 700; }

/* Header title */
.zm-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-top: -4px; }
.zm-h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0 0 6px; letter-spacing: -0.02em; }
.zm-sub { font-size: 13.5px; color: #64748B; margin: 0; font-weight: 500; }

.zm-actions { display: flex; align-items: center; gap: 10px; }
.zm-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; font-weight: 700; color: #475569; cursor: pointer; transition: all .15s; }
.zm-btn:hover { border-color: #2a195c; color: #2a195c; background: #FAFBFD; }
.zm-btn-primary { background: #2a195c; color: #fff; border-color: #2a195c; }
.zm-btn-primary:hover { background: #1e1145; border-color: #1e1145; color: #fff; }
.zm-btn-green { background: #82C43C; color: #fff; border-color: #82C43C; }
.zm-btn-green:hover { background: #6da82e; border-color: #6da82e; color: #fff; }

/* Tab Switcher */
.zm-tabs-card { border-bottom: 1.5px solid #E2E8F0; margin-bottom: 4px; }
.zm-tabs-list { display: flex; gap: 28px; }
.zm-tab { padding: 12px 4px 14px; font-size: 14px; font-weight: 700; color: #64748B; cursor: pointer; border-bottom: 3px solid transparent; transition: all .15s; background: transparent; border-top: none; border-left: none; border-right: none; margin-bottom: -1.5px; }
.zm-tab:hover { color: #2a195c; }
.zm-tab.active { color: #2a195c; border-bottom-color: #82C43C; font-weight: 800; }

/* Layout Grid */
.zm-map-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }

/* Map Viewport Container */
.zm-map-container { position: relative; height: 500px; border-radius: 16px; border: 1.5px solid #E2E8F0; background: #EBF0F5; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.zm-map-svg { width: 100%; height: 100%; display: block; }

/* Floating Tools Panel */
.zm-draw-toolbar { position: absolute; left: 16px; top: 16px; width: 42px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; display: flex; flex-direction: column; gap: 4px; padding: 4px; box-shadow: 0 4px 12px rgba(0,0,0,.04); z-index: 10; }
.zm-draw-btn { width: 32px; height: 32px; border: none; background: transparent; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #64748B; cursor: pointer; transition: all .15s; }
.zm-draw-btn:hover { background: #F1F5F9; color: #2a195c; }
.zm-draw-btn.active { background: #2a195c; color: #fff; }

/* Floating Search Panel */
.zm-search-panel { position: absolute; left: 70px; top: 16px; display: flex; align-items: center; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 4px 12px; width: 280px; box-shadow: 0 4px 12px rgba(0,0,0,.04); z-index: 10; }
.zm-search-back-btn { background: none; border: none; color: #64748B; cursor: pointer; display: flex; align-items: center; padding: 4px; margin-right: 6px; }
.zm-search-input { border: none; font-size: 13px; outline: none; width: 100%; color: #1E293B; font-weight: 500; }
.zm-search-ic { color: #94A3B8; display: flex; align-items: center; }

/* Floating Top-Right Layer Actions */
.zm-layer-toolbar { position: absolute; right: 16px; top: 16px; display: flex; gap: 8px; z-index: 10; }
.zm-layer-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12.5px; font-weight: 700; color: #475569; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,.04); }
.zm-layer-btn:hover { border-color: #2a195c; color: #2a195c; }

/* Floating Zoom / Target Controls */
.zm-control-toolbar { position: absolute; right: 16px; bottom: 16px; display: flex; flex-direction: column; gap: 6px; z-index: 10; }
.zm-control-btn { width: 36px; height: 36px; border: 1.5px solid #E2E8F0; background: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #475569; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,.04); font-size: 18px; font-weight: 700; transition: all .15s; }
.zm-control-btn:hover { border-color: #2a195c; color: #2a195c; }

/* Zone List Sidebar */
.zm-list-sidebar { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.02); display: flex; flex-direction: column; gap: 16px; }
.zm-sidebar-title { font-size: 14.5px; font-weight: 800; color: #0F172A; }
.zm-sidebar-search { display: flex; align-items: center; gap: 8px; width: 100%; }
.zm-sidebar-input { flex: 1; padding: 8px 12px 8px 34px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; outline: none; background: #fff; font-weight: 500; width: 100%; }
.zm-sidebar-input:focus { border-color: #2a195c; }
.zm-sidebar-search-wrap { position: relative; width: 100%; }
.zm-sidebar-search-ic { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94A3B8; display: flex; align-items: center; }
.zm-sidebar-filter { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border: 1.5px solid #E2E8F0; border-radius: 8px; background: #fff; color: #64748B; cursor: pointer; transition: all .15s; }
.zm-sidebar-filter:hover { border-color: #2a195c; color: #2a195c; }

.zm-items-list { display: flex; flex-direction: column; gap: 8px; flex: 1; overflow-y: auto; max-height: 340px; }
.zm-item-card { padding: 12px 14px; border: 1.5px solid #E2E8F0; border-radius: 10px; cursor: pointer; transition: all .15s; display: flex; flex-direction: column; gap: 8px; background: #fff; }
.zm-item-card:hover { border-color: #C7D2FE; }
.zm-item-card.active { border-color: #2a195c; background: #FAF5FF; }
.zm-item-hdr { display: flex; justify-content: space-between; align-items: center; }
.zm-item-title { display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 700; color: #1E293B; }
.zm-item-dot { width: 8px; height: 8px; border-radius: 50%; }
.status-pill { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; border: 1px solid transparent; }
.pill-active { background: #DCFCE7; color: #15803D; border-color: #BBF7D0; }
.pill-inactive { background: #F1F5F9; color: #475569; border-color: #E2E8F0; }

.zm-item-stats { display: flex; gap: 16px; font-size: 12px; color: #64748B; font-weight: 600; }
.zm-item-stat-el strong { color: #0F172A; }

/* Bottom stats sheets */
.zm-bottom-cards { display: grid; grid-template-columns: 1fr 1.6fr; gap: 20px; }
.zm-detail-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.02); display: flex; flex-direction: column; gap: 16px; }
.zm-detail-hdr { display: flex; justify-content: space-between; align-items: center; }
.zm-detail-tit { font-size: 15px; font-weight: 800; color: #0F172A; }
.zm-detail-edit-btn { background: none; border: none; color: #64748B; cursor: pointer; display: flex; align-items: center; padding: 4px; border: 1.5px solid #E2E8F0; border-radius: 6px; transition: all .15s; }
.zm-detail-edit-btn:hover { border-color: #2a195c; color: #2a195c; }

.zm-detail-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.zm-detail-subcard { background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 12px 14px; }
.zm-detail-sublbl { font-size: 11px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.zm-detail-subval { font-size: 18px; font-weight: 800; color: #1E293B; margin-top: 4px; }

.zm-detail-meta { display: flex; gap: 24px; font-size: 12.5px; color: #64748B; border-top: 1.5px solid #F1F5F9; padding-top: 12px; font-weight: 500; }
.zm-detail-metaval { font-weight: 700; color: #1E293B; }

/* Geo fence coordinates tabs */
.zm-subtabs-row { display: flex; gap: 20px; border-bottom: 1.5px solid #E2E8F0; margin-bottom: 12px; }
.zm-subtab { padding: 8px 4px 10px; font-size: 13.5px; font-weight: 700; color: #64748B; cursor: pointer; border-bottom: 2.5px solid transparent; background: transparent; border-top: none; border-left: none; border-right: none; transition: all .15s; }
.zm-subtab.active { color: #82C43C; border-color: #82C43C; }

.zm-geofence-grid { display: grid; grid-template-columns: 1fr 1.6fr; gap: 20px; }
.zm-gf-left { display: flex; flex-direction: column; gap: 10px; }
.zm-gf-param { display: flex; justify-content: space-between; align-items: center; font-size: 13px; padding: 8px 0; border-bottom: 1.5px solid #F1F5F9; }
.zm-gf-param-lbl { color: #64748B; font-weight: 600; }
.zm-gf-param-val { font-weight: 700; color: #1E293B; }
.zm-badge-polygon { background: #EEF2FF; color: #4F46E5; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; border: 1.2px solid #C7D2FE; }

.zm-gf-right { display: flex; flex-direction: column; gap: 10px; }
.zm-gf-coords-title { display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 700; color: #1E293B; }
.zm-coords-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; max-height: 120px; overflow-y: auto; padding: 8px; border: 1.5px solid #E2E8F0; border-radius: 10px; background: #F8FAFC; }
.zm-coord-row { display: flex; align-items: center; gap: 6px; font-size: 11px; font-family: monospace; color: #475569; font-weight: 600; }

/* Table styling */
.zm-tbl-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.02); overflow: hidden; display: flex; flex-direction: column; }
.zm-tbl-wrap { overflow-x: auto; }
.zm-tbl { width: 100%; border-collapse: collapse; min-width: 900px; font-size: 13px; }
.zm-tbl th { font-size: 11.5px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: .06em; text-align: left; padding: 12px 18px; background: #FAFBFD; border-bottom: 1.5px solid #E2E8F0; }
.zm-tbl td { padding: 12px 18px; color: #334155; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
.zm-tbl tr:last-child td { border-bottom: none; }
.zm-tbl tr:hover td { background: #FAFBFD; }

.zm-tbl-avatar { width: 26px; height: 26px; border-radius: 50%; background: #EEF2FF; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #4F46E5; border: 1.2px solid #E2E8F0; margin-right: 8px; }

/* Action row icons */
.zm-tbl-act-btn { width: 28px; height: 28px; border: 1.5px solid #E2E8F0; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; color: #64748B; background: #fff; cursor: pointer; transition: all .15s; margin-right: 6px; }
.zm-tbl-act-btn:hover { border-color: #2a195c; color: #2a195c; }
.zm-tbl-act-btn:last-child { margin-right: 0; }

/* Log Filters Grid */
.zl-filter-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 14px; padding: 14px 16px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.zl-filter-grid { display: grid; grid-template-columns: 1.8fr 1fr 1fr 1fr auto; gap: 12px; align-items: center; }
.zl-search-wrap { position: relative; display: flex; align-items: center; }
.zl-search-input { width: 100%; padding: 8px 12px 8px 34px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; outline: none; transition: border-color .15s; font-weight: 500; }
.zl-search-input:focus { border-color: #2a195c; }
.zl-search-icon { position: absolute; left: 12px; color: #94A3B8; display: flex; align-items: center; }
.zl-select { padding: 8px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; outline: none; background: #fff; color: #374151; cursor: pointer; font-weight: 500; }
.zl-select:focus { border-color: #2a195c; }
.zl-reset-btn { font-size: 12.5px; font-weight: 700; color: #EF4444; background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; }
.zl-reset-btn:hover { text-decoration: underline; }

.zl-split-layout { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }
.zl-left-col { display: flex; flex-direction: column; gap: 16px; }
.zl-right-col { display: flex; flex-direction: column; gap: 16px; }

/* Event / Status Badges */
.badge-entered { background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px; text-transform: uppercase; }
.badge-exited { background: #FEE2E2; color: #B91C1C; border: 1px solid #FCA5A5; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px; text-transform: uppercase; }
.badge-completed { background: #ECFDF5; color: #16A34A; border: 1px solid #A7F3D0; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; }

/* Right Log Panel items */
.zl-card { background: #fff; border: 1.5px solid #E2E8F0; border-radius: 16px; padding: 18px; box-shadow: 0 1px 3px rgba(0,0,0,.02); display: flex; flex-direction: column; gap: 14px; }
.zl-card-tit { font-size: 14px; font-weight: 800; color: #0F172A; display: flex; justify-content: space-between; align-items: center; }
.zl-overview-map { height: 160px; background: #E2E8F0; border-radius: 10px; border: 1px solid #CBD5E1; overflow: hidden; position: relative; }

.zl-summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.zl-summary-item { background: #F8FAFC; border: 1.5px solid #E2E8F0; border-radius: 10px; padding: 10px 12px; display: flex; align-items: center; gap: 10px; }
.zl-summary-ic { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.zl-summary-ic.green { background: #10B981; color: #fff; }
.zl-summary-ic.red { background: #EF4444; color: #fff; }
.zl-summary-ic.purple { background: #8B5CF6; color: #fff; }
.zl-summary-ic.orange { background: #F97316; color: #fff; }
.zl-summary-num { font-size: 16px; font-weight: 800; color: #1E293B; line-height: 1.2; }
.zl-summary-lbl { font-size: 10.5px; color: #64748B; font-weight: 600; }

.zl-alert-timeline { display: flex; flex-direction: column; gap: 12px; position: relative; padding-left: 14px; margin-top: 6px; }
.zl-alert-timeline::before { content: ''; position: absolute; left: 3.5px; top: 6px; bottom: 6px; width: 1.5px; background: #E2E8F0; }
.zl-alert-item { display: flex; gap: 10px; position: relative; }
.zl-alert-dot { width: 8px; height: 8px; border-radius: 50%; background: #CBD5E1; border: 2px solid #fff; position: absolute; left: -14px; top: 5px; box-shadow: 0 0 0 2px #E2E8F0; }
.zl-alert-item.red .zl-alert-dot { background: #EF4444; box-shadow: 0 0 0 2px #FCA5A5; }
.zl-alert-item.green .zl-alert-dot { background: #10B981; box-shadow: 0 0 0 2px #A7F3D0; }
.zl-alert-info { display: flex; flex-direction: column; gap: 2px; }
.zl-alert-txt { font-size: 12px; color: #334155; font-weight: 600; line-height: 1.4; }
.zl-alert-time { font-size: 10.5px; color: #94A3B8; font-weight: 500; }

/* Statistics tab classes */
.zs-kpi-row { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
.zs-kpi-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.zs-kpi-ic { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; }
.zs-kpi-ic.purple { background: #8B5CF6; color: #fff; }
.zs-kpi-ic.green { background: #10B981; color: #fff; }
.zs-kpi-ic.blue { background: #3B82F6; color: #fff; }
.zs-kpi-ic.orange { background: #F97316; color: #fff; }
.zs-kpi-ic.red { background: #EF4444; color: #fff; }
.zs-kpi-info { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.zs-kpi-lbl { font-size: 11px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
.zs-kpi-val { font-size: 19px; font-weight: 800; color: #0F172A; line-height: 1.2; margin-top: 2px; }
.zs-kpi-trend { font-size: 10.5px; font-weight: 700; margin-top: 4px; display: flex; align-items: center; gap: 2px; }
.zs-kpi-trend.up { color: #16A34A; }
.zs-kpi-trend.down { color: #EF4444; }

.zs-charts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.zs-chart-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,.02); display: flex; flex-direction: column; height: 260px; }
.zs-chart-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.zs-chart-tit { font-size: 13.5px; font-weight: 800; color: #0F172A; }
.zs-chart-body { flex: 1; display: flex; align-items: center; justify-content: center; }

.zs-lower-grid { display: grid; grid-template-columns: 1fr 1.2fr 1fr; gap: 16px; }
.zs-summary-list { display: flex; flex-direction: column; gap: 12px; }
.zs-summary-item { display: flex; justify-content: space-between; align-items: center; font-size: 12.5px; font-weight: 600; color: #334155; border-bottom: 1px dashed #E2E8F0; padding-bottom: 8px; }
.zs-summary-item:last-child { border-bottom: none; padding-bottom: 0; }
.zs-summary-lbl { color: #64748B; }
.zs-summary-val { display: flex; align-items: center; gap: 6px; }

.zs-badge-good { background: #DCFCE7; color: #15803D; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
.zs-badge-excellent { background: #F3E8FF; color: #7E22CE; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }

/* Heatmap Peak Hours styling */
.zs-heatmap-row { display: grid; grid-template-columns: repeat(24, 1fr); gap: 2px; align-items: flex-end; height: 100px; padding-bottom: 10px; border-bottom: 1px solid #E2E8F0; }
.zs-heatmap-cell { height: var(--bar-height); background: #7C3AED; opacity: var(--bar-opacity); border-radius: 2px; cursor: pointer; transition: all .15s; position: relative; }
.zs-heatmap-cell:hover { opacity: 1 !important; transform: scaleY(1.05); }
.zs-heatmap-hours-labels { display: grid; grid-template-columns: repeat(24, 1fr); gap: 2px; text-align: center; margin-top: 6px; font-size: 9px; color: #64748B; font-weight: 700; }

/* Alerts notification timeline card */
.zs-alert-item { display: flex; gap: 10px; align-items: start; border-bottom: 1.5px solid #F1F5F9; padding-bottom: 8px; }
.zs-alert-item:last-child { border-bottom: none; padding-bottom: 0; }
.zs-alert-ic { width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.zs-alert-ic.red { background: #EF4444; color: #fff; }
.zs-alert-ic.orange { background: #F97316; color: #fff; }
.zs-alert-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.zs-alert-txt { font-size: 12px; color: #334155; font-weight: 600; line-height: 1.45; }
.zs-alert-time { font-size: 10.5px; color: #94A3B8; font-weight: 500; }
.leaflet-container { width: 100%; height: 100%; z-index: 1; }
`;

interface Coordinate {
  lat: number;
  lng: number;
}

interface ZoneData {
  id: string;
  name: string;
  code: string;
  manager: string;
  vehicles: number;
  renters: number;
  areaKm2: number;
  status: 'active' | 'inactive';
  createdOn: string;
  color: string;
  svgPath: string;
  markerPos: { cx: number; cy: number };
  coordinates: string[];
  points?: Coordinate[];
}

function parseCoordinates(coordStrings: string[]): Coordinate[] {
  return coordStrings.map(str => {
    const cleaned = str.replace(/^\d+\.\s*/, '');
    const [latStr, lngStr] = cleaned.split(',');
    if (!latStr || !lngStr) return { lat: 0, lng: 0 };
    return {
      lat: parseFloat(latStr.trim()),
      lng: parseFloat(lngStr.trim())
    };
  }).filter(c => c.lat !== 0 && c.lng !== 0);
}

const ZONES: ZoneData[] = [
  {
    id: '1',
    name: 'Connaught Place',
    code: 'ZONE-CP-001',
    manager: 'Akash Verma',
    vehicles: 24,
    renters: 312,
    areaKm2: 2.45,
    status: 'active',
    createdOn: '15 Apr 2024, 10:30 AM',
    color: '#7C3AED',
    svgPath: 'M 250,170 L 290,195 L 320,230 L 290,265 L 250,290 L 210,265 L 180,230 L 210,195 Z',
    markerPos: { cx: 250, cy: 230 },
    coordinates: [
      '1. 28.6315, 77.2197',
      '2. 28.6328, 77.2051',
      '3. 28.6261, 77.2314',
      '4. 28.6198, 77.2190',
      '5. 28.6181, 77.2093',
      '6. 28.6232, 77.2051',
      '7. 28.6289, 77.2078',
      '8. 28.6315, 77.2197'
    ]
  },
  {
    id: '2',
    name: 'Karol Bagh',
    code: 'ZONE-KB-002',
    manager: 'Ritu Sharma',
    vehicles: 18,
    renters: 245,
    areaKm2: 1.80,
    status: 'active',
    createdOn: '16 Apr 2024, 09:15 AM',
    color: '#10B981',
    svgPath: 'M 70,80 L 140,80 L 140,150 L 70,150 Z',
    markerPos: { cx: 105, cy: 115 },
    coordinates: [
      '1. 28.6441, 77.1882',
      '2. 28.6472, 77.1990',
      '3. 28.6385, 77.1992',
      '4. 28.6341, 77.1880',
      '5. 28.6441, 77.1882'
    ]
  },
  {
    id: '3',
    name: 'Paharganj',
    code: 'ZONE-PG-003',
    manager: 'Mohit Singh',
    vehicles: 12,
    renters: 180,
    areaKm2: 1.25,
    status: 'active',
    createdOn: '17 Apr 2024, 02:45 PM',
    color: '#F97316',
    svgPath: 'M 190,100 L 250,110 L 230,160 L 170,140 Z',
    markerPos: { cx: 210, cy: 128 },
    coordinates: [
      '1. 28.6432, 77.2081',
      '2. 28.6415, 77.2155',
      '3. 28.6322, 77.2120',
      '4. 28.6349, 77.2030'
    ]
  },
  {
    id: '4',
    name: 'Rajendra Place',
    code: 'ZONE-RP-004',
    manager: 'Neha Gupta',
    vehicles: 8,
    renters: 112,
    areaKm2: 1.10,
    status: 'active',
    createdOn: '18 Apr 2024, 11:20 AM',
    color: '#3B82F6',
    svgPath: 'M 60,190 L 120,170 L 140,220 L 80,240 Z',
    markerPos: { cx: 100, cy: 205 },
    coordinates: [
      '1. 28.6410, 77.1782',
      '2. 28.6435, 77.1850',
      '3. 28.6355, 77.1892',
      '4. 28.6320, 77.1810'
    ]
  },
  {
    id: '5',
    name: 'Pragati Maidan',
    code: 'ZONE-PM-005',
    manager: 'Sandeep Kumar',
    vehicles: 6,
    renters: 98,
    areaKm2: 1.05,
    status: 'active',
    createdOn: '19 Apr 2024, 04:30 PM',
    color: '#8B5CF6',
    svgPath: 'M 360,280 L 440,290 L 420,360 L 340,330 Z',
    markerPos: { cx: 390, cy: 315 },
    coordinates: [
      '1. 28.6231, 77.2410',
      '2. 28.6255, 77.2520',
      '3. 28.6145, 77.2482',
      '4. 28.6160, 77.2390'
    ]
  },
  {
    id: '6',
    name: 'Dwarka Sector 12',
    code: 'ZONE-DS12-006',
    manager: 'Priya Mehta',
    vehicles: 0,
    renters: 0,
    areaKm2: 2.10,
    status: 'inactive',
    createdOn: '20 Apr 2024, 10:05 AM',
    color: '#EF4444',
    svgPath: 'M 20,380 L 100,370 L 80,440 L 10,430 Z',
    markerPos: { cx: 50, cy: 405 },
    coordinates: [
      '1. 28.5921, 77.0422',
      '2. 28.5950, 77.0510',
      '3. 28.5840, 77.0560',
      '4. 28.5810, 77.0450'
    ]
  },
  {
    id: '7',
    name: 'Rohini Sector 18',
    code: 'ZONE-RS18-007',
    manager: 'Vikram Yadav',
    vehicles: 0,
    renters: 0,
    areaKm2: 1.75,
    status: 'inactive',
    createdOn: '21 Apr 2024, 09:40 AM',
    color: '#10B981',
    svgPath: 'M 260,20 L 320,10 L 340,60 L 280,70 Z',
    markerPos: { cx: 300, cy: 40 },
    coordinates: [
      '1. 28.7410, 77.1232',
      '2. 28.7450, 77.1320',
      '3. 28.7350, 77.1380',
      '4. 28.7300, 77.1290'
    ]
  },
  {
    id: '8',
    name: 'Okhla Phase 1',
    code: 'ZONE-OP1-008',
    manager: 'Anjali Verma',
    vehicles: 0,
    renters: 0,
    areaKm2: 1.60,
    status: 'inactive',
    createdOn: '22 Apr 2024, 03:10 PM',
    color: '#3B82F6',
    svgPath: 'M 350,420 L 450,400 L 480,460 L 380,470 Z',
    markerPos: { cx: 415, cy: 438 },
    coordinates: [
      '1. 28.5255, 77.2722',
      '2. 28.5290, 77.2840',
      '3. 28.5180, 77.2880',
      '4. 28.5140, 77.2760'
    ]
  },
  {
    id: '9',
    name: 'Lajpat Nagar',
    code: 'ZONE-LN-009',
    manager: 'Rahul Jain',
    vehicles: 0,
    renters: 0,
    areaKm2: 1.50,
    status: 'inactive',
    createdOn: '23 Apr 2024, 11:00 AM',
    color: '#F97316',
    svgPath: 'M 300,320 L 370,300 L 390,350 L 320,370 Z',
    markerPos: { cx: 345, cy: 335 },
    coordinates: [
      '1. 28.5615, 77.2430',
      '2. 28.5680, 77.2520',
      '3. 28.5520, 77.2560',
      '4. 28.5490, 77.2400'
    ]
  },
  {
    id: '10',
    name: 'Mayur Vihar Phase 1',
    code: 'ZONE-MV1-010',
    manager: 'Divya Nair',
    vehicles: 0,
    renters: 0,
    areaKm2: 1.35,
    status: 'inactive',
    createdOn: '24 Apr 2024, 01:25 PM',
    color: '#EC4899',
    svgPath: 'M 410,120 L 480,140 L 460,190 L 390,170 Z',
    markerPos: { cx: 435, cy: 155 },
    coordinates: [
      '1. 28.6121, 77.2910',
      '2. 28.6180, 77.3020',
      '3. 28.6015, 77.3050',
      '4. 28.5990, 77.2890'
    ]
  }
];

interface LogEntry {
  time: string;
  vehicle: string;
  type: string;
  zone: string;
  event: 'Entered' | 'Exited';
  location: string;
  status: string;
  color: string;
}

const LOGS: LogEntry[] = [
  { time: '20 May 2024, 10:35:24 AM', vehicle: 'EV-12KA-1234', type: 'Electric Scooter', zone: 'Connaught Place', event: 'Entered', location: 'Near Palika Bazaar New Delhi, Delhi', status: 'Completed', color: '#7C3AED' },
  { time: '20 May 2024, 10:18:07 AM', vehicle: 'EV-12KA-5678', type: 'Electric Scooter', zone: 'Karol Bagh', event: 'Exited', location: 'Ajmal Khan Road New Delhi, Delhi', status: 'Completed', color: '#10B981' },
  { time: '20 May 2024, 09:47:52 AM', vehicle: 'EV-12KA-9012', type: 'Electric Scooter', zone: 'Paharganj', event: 'Entered', location: 'Main Bazar New Delhi, Delhi', status: 'Completed', color: '#F97316' },
  { time: '20 May 2024, 09:32:15 AM', vehicle: 'EV-12KA-3456', type: 'Electric Scooter', zone: 'Rajendra Place', event: 'Exited', location: 'Pusa Road New Delhi, Delhi', status: 'Completed', color: '#3B82F6' },
  { time: '20 May 2024, 09:05:41 AM', vehicle: 'EV-12KA-6789', type: 'Electric Scooter', zone: 'Connaught Place', event: 'Entered', location: 'Hanuman Road Area New Delhi, Delhi', status: 'Completed', color: '#7C3AED' },
  { time: '20 May 2024, 08:56:12 AM', vehicle: 'EV-12KA-1122', type: 'Electric Scooter', zone: 'Pragati Maidan', event: 'Exited', location: 'Bhairon Marg New Delhi, Delhi', status: 'Completed', color: '#8B5CF6' },
  { time: '20 May 2024, 08:33:55 AM', vehicle: 'EV-12KA-7788', type: 'Electric Scooter', zone: 'Karol Bagh', event: 'Entered', location: 'Gaffar Market New Delhi, Delhi', status: 'Completed', color: '#10B981' },
  { time: '20 May 2024, 08:10:23 AM', vehicle: 'EV-12KA-3344', type: 'Electric Scooter', zone: 'Paharganj', event: 'Exited', location: 'Arakashan Road New Delhi, Delhi', status: 'Completed', color: '#F97316' },
  { time: '20 May 2024, 07:55:48 AM', vehicle: 'EV-12KA-8899', type: 'Electric Scooter', zone: 'Rajendra Place', event: 'Entered', location: 'Old Rajinder Nagar New Delhi, Delhi', status: 'Completed', color: '#3B82F6' },
  { time: '20 May 2024, 07:32:17 AM', vehicle: 'EV-12KA-5566', type: 'Electric Scooter', zone: 'Pragati Maidan', event: 'Exited', location: 'Ring Road New Delhi, Delhi', status: 'Completed', color: '#8B5CF6' }
];

const PEAK_HOURS_DATA = [
  { hour: '00', val: 12, height: '18px', opacity: 0.2 },
  { hour: '01', val: 8, height: '12px', opacity: 0.1 },
  { hour: '02', val: 5, height: '8px', opacity: 0.1 },
  { hour: '03', val: 4, height: '6px', opacity: 0.05 },
  { hour: '04', val: 6, height: '10px', opacity: 0.1 },
  { hour: '05', val: 15, height: '22px', opacity: 0.2 },
  { hour: '06', val: 35, height: '42px', opacity: 0.4 },
  { hour: '07', val: 58, height: '64px', opacity: 0.6 },
  { hour: '08', val: 78, height: '82px', opacity: 0.8 },
  { hour: '09', val: 95, height: '98px', opacity: 0.95 },
  { hour: '10', val: 88, height: '90px', opacity: 0.9 },
  { hour: '11', val: 72, height: '76px', opacity: 0.75 },
  { hour: '12', val: 60, height: '65px', opacity: 0.65 },
  { hour: '13', val: 54, height: '58px', opacity: 0.6 },
  { hour: '14', val: 48, height: '52px', opacity: 0.5 },
  { hour: '15', val: 52, height: '56px', opacity: 0.55 },
  { hour: '16', val: 65, height: '70px', opacity: 0.7 },
  { hour: '17', val: 85, height: '92px', opacity: 0.85 },
  { hour: '18', val: 99, height: '100px', opacity: 1.0 },
  { hour: '19', val: 92, height: '94px', opacity: 0.95 },
  { hour: '20', val: 76, height: '80px', opacity: 0.8 },
  { hour: '21', val: 50, height: '55px', opacity: 0.55 },
  { hour: '22', val: 32, height: '38px', opacity: 0.35 },
  { hour: '23', val: 18, height: '24px', opacity: 0.2 }
];

function latLngToSvg(lat: number, lng: number) {
  const x = 250 + (lng - 77.220) * 6000;
  const y = 230 - (lat - 28.630) * 8000;
  return { x, y };
}

function calculatePolygonAreaKm2(coords: { lat: number; lng: number }[]) {
  if (coords.length < 3) return 0;
  let area = 0;
  const latMid = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;
  const mPerDegLat = 111.132 * 1000;
  const mPerDegLng = 40075 * 1000 * Math.cos(latMid * Math.PI / 180) / 360;
  const projected = coords.map(c => ({
    x: c.lng * mPerDegLng,
    y: c.lat * mPerDegLat
  }));
  for (let i = 0; i < projected.length; i++) {
    const j = (i + 1) % projected.length;
    area += projected[i].x * projected[j].y;
    area -= projected[j].x * projected[i].y;
  }
  return Math.abs(area) / 2 / 1000000;
}

function ZoneManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'Zone List';

  const [dbZones, setDbZones] = useState<any[]>([]);

  const fetchZones = () => {
    api.get('/zones')
      .then(res => {
        if (res && res.data) {
          setDbZones(res.data);
        }
      })
      .catch(err => {
        console.error('Error fetching zones:', err);
      });
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleDeleteZone = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the zone "${name}"?`)) return;
    try {
      const response = await api.delete(`/zones/${id}`);
      if (response.status === 'success') {
        alert('Zone deleted successfully!');
        fetchZones();
      } else {
        alert('Failed to delete zone: ' + response.message);
      }
    } catch (err: any) {
      console.error(err);
      alert('Error deleting zone: ' + err.message);
    }
  };

  const zonesList = useMemo(() => {
    if (dbZones.length === 0) {
      return ZONES.map(z => ({
        ...z,
        points: parseCoordinates(z.coordinates)
      }));
    }
    
    return dbZones.map((dbz, index) => {
      const matchedStatic = ZONES.find(sz => sz.code.toLowerCase() === dbz.code.toLowerCase() || sz.name.toLowerCase() === dbz.name.toLowerCase());
      const pts = Array.isArray(dbz.points) ? dbz.points : JSON.parse(dbz.points || '[]');
      
      let svgPath = '';
      let markerPos = { cx: 250, cy: 230 };
      let coordinates: string[] = [];
      let areaKm2 = 0;
      let zonePts: Coordinate[] = [];
      
      if (matchedStatic) {
        svgPath = matchedStatic.svgPath;
        markerPos = matchedStatic.markerPos;
        coordinates = matchedStatic.coordinates;
        areaKm2 = matchedStatic.areaKm2;
        zonePts = parseCoordinates(matchedStatic.coordinates);
      } else if (pts.length > 0) {
        svgPath = pts.map((p: any, idx: number) => {
          const { x, y } = latLngToSvg(p.lat, p.lng);
          return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ') + ' Z';
        
        let sumX = 0, sumY = 0;
        pts.forEach((p: any) => {
          const { x, y } = latLngToSvg(p.lat, p.lng);
          sumX += x;
          sumY += y;
        });
        markerPos = { cx: sumX / pts.length, cy: sumY / pts.length };
        
        coordinates = pts.map((p: any, idx: number) => `${idx + 1}. ${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`);
        areaKm2 = parseFloat(calculatePolygonAreaKm2(pts).toFixed(2));
        zonePts = pts;
      }
      
      const colors = ['#7C3AED', '#10B981', '#F97316', '#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#3B82F6', '#F97316', '#EC4899'];
      const color = matchedStatic?.color || colors[index % colors.length] || '#7C3AED';
      
      return {
        id: String(dbz.id),
        name: dbz.name,
        code: dbz.code,
        manager: dbz.locality || matchedStatic?.manager || 'Akash Verma',
        vehicles: dbz.max_vehicles || matchedStatic?.vehicles || 0,
        renters: dbz.renters || matchedStatic?.renters || 0,
        areaKm2: areaKm2 || matchedStatic?.areaKm2 || 0.5,
        status: dbz.status || matchedStatic?.status || 'active',
        createdOn: matchedStatic?.createdOn || '15 Apr 2024, 10:30 AM',
        color,
        svgPath,
        markerPos,
        coordinates,
        points: zonePts
      } as ZoneData;
    });
  }, [dbZones]);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedZoneId, setSelectedZoneId] = useState('1');
  const [subtab, setSubtab] = useState('Geo Fence');

  // Leaflet integration state and references
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const mapRef = useRef<any>(null);
  const polygonsRef = useRef<Record<string, any>>({});
  const markersRef = useRef<Record<string, any>>({});

  const getPointsCenter = (coords: Coordinate[]) => {
    if (coords.length === 0) return { lat: 28.6315, lng: 77.2197 };
    let sumLat = 0, sumLng = 0;
    coords.forEach(c => {
      sumLat += c.lat;
      sumLng += c.lng;
    });
    return { lat: sumLat / coords.length, lng: sumLng / coords.length };
  };

  // Load Leaflet dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  // Map Initialization
  useEffect(() => {
    if (!leafletLoaded) return;
    const L = (window as any).L;
    if (!L) return;

    const container = document.getElementById('dashboard-zone-map');
    if (!container) return;

    // Determine initial center
    let initialCenter = [28.6315, 77.2197]; // Default Delhi CP
    const cpZone = zonesList.find(z => z.id === '1');
    if (cpZone && cpZone.points && cpZone.points.length > 0) {
      initialCenter = [cpZone.points[0].lat, cpZone.points[0].lng];
    }

    const map = L.map('dashboard-zone-map', {
      center: initialCenter,
      zoom: 13,
      zoomControl: false,
      dragging: true,
      scrollWheelZoom: true
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

    const polys: Record<string, any> = {};
    const markers: Record<string, any> = {};

    zonesList.forEach(z => {
      if (!z.points || z.points.length < 3) return;
      const latlngs = z.points.map(pt => [pt.lat, pt.lng]);
      
      const poly = L.polygon(latlngs, {
        color: z.color,
        fillColor: z.color,
        fillOpacity: z.id === selectedZoneId ? 0.25 : 0.1,
        weight: z.id === selectedZoneId ? 3.5 : 2,
        dashArray: z.id === selectedZoneId ? undefined : '4, 4'
      }).addTo(map);

      poly.on('click', () => {
        setSelectedZoneId(z.id);
      });

      polys[z.id] = poly;

      // Add marker
      const center = getPointsCenter(z.points);
      const marker = L.marker([center.lat, center.lng], {
        icon: L.divIcon({
          className: 'custom-dashboard-marker',
          html: `
            <div style="cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
              <div style="width: ${z.id === selectedZoneId ? '12px' : '8px'}; height: ${z.id === selectedZoneId ? '12px' : '8px'}; border-radius: 50%; background: ${z.color}; border: 1.5px solid #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
              ${z.id === selectedZoneId ? `
                <div style="position: absolute; bottom: 16px; background: #2a195c; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.25);">
                  ${z.name}
                </div>
              ` : ''}
            </div>
          `,
          iconSize: [60, 60],
          iconAnchor: [30, 30]
        })
      }).addTo(map);

      marker.on('click', () => {
        setSelectedZoneId(z.id);
      });

      markers[z.id] = marker;
    });

    polygonsRef.current = polys;
    markersRef.current = markers;

    // Pan/fit bounds of selected zone
    const activeZoneObj = zonesList.find(z => z.id === selectedZoneId);
    if (activeZoneObj && activeZoneObj.points && activeZoneObj.points.length > 0) {
      const activePoly = polys[selectedZoneId];
      if (activePoly) {
        map.fitBounds(activePoly.getBounds(), { padding: [50, 50], maxZoom: 14 });
      }
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [activeTab, leafletLoaded, zonesList]);

  // Handle selectedZoneId change
  useEffect(() => {
    if (!mapRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    const polys = polygonsRef.current;
    const markers = markersRef.current;

    zonesList.forEach(z => {
      const poly = polys[z.id];
      const marker = markers[z.id];
      const isSelected = z.id === selectedZoneId;

      if (poly) {
        poly.setStyle({
          fillOpacity: isSelected ? 0.25 : 0.1,
          weight: isSelected ? 3.5 : 2,
          dashArray: isSelected ? undefined : '4, 4'
        });
        if (isSelected) {
          poly.bringToFront();
        }
      }

      if (marker) {
        marker.setIcon(L.divIcon({
          className: 'custom-dashboard-marker',
          html: `
            <div style="cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
              <div style="width: ${isSelected ? '12px' : '8px'}; height: ${isSelected ? '12px' : '8px'}; border-radius: 50%; background: ${z.color}; border: 1.5px solid #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>
              ${isSelected ? `
                <div style="position: absolute; bottom: 16px; background: #2a195c; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 700; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.25);">
                  ${z.name}
                </div>
              ` : ''}
            </div>
          `,
          iconSize: [60, 60],
          iconAnchor: [30, 30]
        }));
      }
    });

    const activeZoneObj = zonesList.find(z => z.id === selectedZoneId);
    if (activeZoneObj && activeZoneObj.points && activeZoneObj.points.length > 0 && mapRef.current) {
      const poly = polys[selectedZoneId];
      if (poly) {
        mapRef.current.fitBounds(poly.getBounds(), { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [selectedZoneId, zonesList]);

  const handleMapSearch = async () => {
    if (!mapSearchQuery.trim()) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapSearchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newLat = parseFloat(lat);
        const newLng = parseFloat(lon);
        if (mapRef.current) {
          mapRef.current.setView([newLat, newLng], 14);
        }
      } else {
        alert("Location not found.");
      }
    } catch (err) {
      console.error("Error searching location:", err);
    }
  };

  // Filters for Zone Map Tab
  const [zoneSearch, setZoneSearch] = useState('');

  // Filters for Zone List Tab
  const [listSearch, setListSearch] = useState('');
  const [listStatus, setListStatus] = useState('All');

  // Filters for Geo Fence Logs Tab
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logFilterZone, setLogFilterZone] = useState('All Zones');
  const [logFilterEvent, setLogFilterEvent] = useState('All Events');
  const [logFilterVehicle, setLogFilterVehicle] = useState('All Vehicles');

  const selectedZone = useMemo(() => {
    return zonesList.find(z => z.id === selectedZoneId) || zonesList[0] || ZONES[0];
  }, [selectedZoneId, zonesList]);

  // Sidebar list zones (filtered)
  const filteredSidebarZones = useMemo(() => {
    return zonesList.filter(z => z.name.toLowerCase().includes(zoneSearch.toLowerCase()));
  }, [zoneSearch, zonesList]);

  // Zone List Tab main list (filtered)
  const filteredListZones = useMemo(() => {
    return zonesList.filter(z => {
      const matchesSearch = z.name.toLowerCase().includes(listSearch.toLowerCase()) || z.code.toLowerCase().includes(listSearch.toLowerCase());
      const matchesStatus = listStatus === 'All' || z.status === listStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [listSearch, listStatus, zonesList]);

  // Logs list (filtered)
  const filteredLogs = useMemo(() => {
    return LOGS.filter(l => {
      const matchesSearch = l.vehicle.toLowerCase().includes(logSearchQuery.toLowerCase()) || l.location.toLowerCase().includes(logSearchQuery.toLowerCase());
      const matchesZone = logFilterZone === 'All Zones' || l.zone === logFilterZone;
      const matchesEvent = logFilterEvent === 'All Events' || l.event === logFilterEvent;
      const matchesVehicle = logFilterVehicle === 'All Vehicles' || l.type === logFilterVehicle;
      return matchesSearch && matchesZone && matchesEvent && matchesVehicle;
    });
  }, [logSearchQuery, logFilterZone, logFilterEvent, logFilterVehicle]);

  const handleCopyCoords = () => {
    const coordsText = selectedZone.coordinates.map(c => c.substring(3)).join('\n');
    navigator.clipboard.writeText(coordsText);
    alert('Coordinates copied to clipboard!');
  };

  const resetLogFilters = () => {
    setLogSearchQuery('');
    setLogFilterZone('All Zones');
    setLogFilterEvent('All Events');
    setLogFilterVehicle('All Vehicles');
  };
const IPower = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>;
const ILocate = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>;
const IDots = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="zm-shell">
        <Sidebar activePath="/zones" />
        <div className="zm-main">
          
          <TopBar 
            title="Hello, Akash" 
            subtitle="Zone Employee" 
            notificationCount={3}
            showSearch={false}
            hideZone={false}
          />

          <div className="zm-page">
            
            {/* Breadcrumb chevrons */}
            <div className="zm-bc">
              <Link href="/">Dashboard</Link>
              <span className="zm-bc-sep">&gt;</span>
              <span>Operations</span>
              <span className="zm-bc-sep">&gt;</span>
              <span className="zm-bc-cur">Zone Management</span>
            </div>

            {/* Header Title & Top Buttons Row */}
            <div className="zm-title-row">
              <div>
                <h1 className="zm-h1">Zone Map</h1>
                <p className="zm-sub">Monitor and manage operational zones geographically.</p>
              </div>
              <div className="zm-hdr-actions">
                <button className="zm-hdr-btn" onClick={() => alert('Exporting Report...')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export Report
                </button>
                <button className="zm-hdr-btn zm-hdr-btn-primary" onClick={() => router.push('/zones/new')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add New Zone
                </button>
              </div>
            </div>

            {/* Main Layout Grid */}
            <div className="zm-layout-grid">
              
              {/* LEFT: MAP */}
              <div className="zm-map-card">
                <div className="zm-map-bg">
                  <div id="dashboard-zone-map" ref={mapRef} className="leaflet-container" />
                </div>
                
                {/* Floating Map Controls */}
                <div className="zm-map-ctrls">
                  <div className="zm-ctrl-btn active">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <span>Zones</span>
                  </div>
                  <div className="zm-ctrl-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>Vehicles</span>
                  </div>
                </div>

                {/* Map Search */}
                <div className="zm-map-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  <input
                    type="text"
                    className="zm-map-search-input"
                    placeholder="Search Location..."
                    value={mapSearchQuery}
                    onChange={(e) => setMapSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMapSearch()}
                  />
                </div>
              </div>

              {/* RIGHT: SIDE PANEL */}
              <div className="zm-side-panel">
                <div className="zm-side-hdr">
                  <div className="zm-side-title">Selected Zone Details</div>
                </div>
                <div className="zm-side-body">
                  {selectedZone ? (
                    <>
                      <div className="zm-veh-brief">
                        <div className="zm-veh-img-wrap" style={{ color: selectedZone.color }}>
                           {selectedZone.name.substring(0,2).toUpperCase()}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedZone.name}</div>
                          <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px', fontFamily: 'monospace' }}>{selectedZone.code}</div>
                        </div>
                        <span className={`zm-veh-badge ${selectedZone.status === 'active' ? 'online' : 'offline'}`}>
                          {selectedZone.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="zm-spec-grid">
                        <div className="zm-spec-box">
                          <span className="zm-spec-lbl">Manager</span>
                          <span className="zm-spec-val">{selectedZone.manager}</span>
                        </div>
                        <div className="zm-spec-box">
                          <span className="zm-spec-lbl">Area</span>
                          <span className="zm-spec-val">{selectedZone.areaKm2} km²</span>
                        </div>
                        <div className="zm-spec-box">
                          <span className="zm-spec-lbl">Vehicles</span>
                          <span className="zm-spec-val">{selectedZone.vehicles}</span>
                        </div>
                        <div className="zm-spec-box">
                          <span className="zm-spec-lbl">Renters</span>
                          <span className="zm-spec-val">{selectedZone.renters}</span>
                        </div>
                      </div>

                      <div className="zm-action-grid">
                        <div className="zm-act-btn" onClick={() => handleCopyCoords()}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                          <span className="zm-act-btn-lbl">Copy<br/>Coords</span>
                        </div>
                        <div className="zm-act-btn" onClick={() => router.push(`/zones/new?id=${selectedZone.id}`)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                          <span className="zm-act-btn-lbl">Edit<br/>Zone</span>
                        </div>
                        <div className="zm-act-btn" style={{ color: '#EF4444', borderColor: '#FCA5A5' }} onClick={() => handleDeleteZone(selectedZone.id, selectedZone.name)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          <span className="zm-act-btn-lbl" style={{ color: '#EF4444' }}>Delete<br/>Zone</span>
                        </div>
                      </div>
                      
                      <Link href={`/zones/new?id=${selectedZone.id}`} className="zm-cta-btn">Manage Zone Details</Link>
                    </>
                  ) : (
                    <div style={{ color: '#64748B', textAlign: 'center', marginTop: '20px', fontSize: '13px' }}>Select a zone on the map to view details</div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Cards Section */}
            <div className="zm-bottom-grid">
              
              {/* Timeline Card (Geo Fence Logs) */}
              <div className="zm-bot-card">
                <div className="zm-bot-hdr">
                  <div className="zm-bot-title">Recent Geo Fence Logs</div>
                  <Link href="/reports" style={{ fontSize: '11.5px', color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}>View All</Link>
                </div>
                <div className="zm-bot-body">
                  <div className="zm-timeline">
                    {filteredLogs.slice(0, 5).map((log, i) => (
                      <div key={i} className={`zm-tl-item ${log.type === 'Entered' ? 'online' : 'offline'}`}>
                        <div className="zm-tl-info">
                          <div className="zm-tl-title">{log.vehicle} {log.type} Zone</div>
                          <div className="zm-tl-desc">At {log.location} ({log.zone})</div>
                        </div>
                        <div className="zm-tl-time">{log.time.split(' ')[1]} {log.time.split(' ')[2]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Alerts Card */}
              <div className="zm-bot-card">
                <div className="zm-bot-hdr">
                  <div className="zm-bot-title">Active Zone Alerts</div>
                  <Link href="/alerts" style={{ fontSize: '11.5px', color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}>View Alerts</Link>
                </div>
                <div className="zm-bot-body">
                  <div className="zm-timeline">
                    <div className="zm-tl-item low_bat">
                      <div className="zm-tl-info">
                        <div className="zm-tl-title">Zone Density High</div>
                        <div className="zm-tl-desc">Connaught Place has over 20 vehicles.</div>
                      </div>
                      <div className="zm-tl-time">10 mins ago</div>
                    </div>
                    <div className="zm-tl-item offline">
                      <div className="zm-tl-info">
                        <div className="zm-tl-title">Zone Breach Attempt</div>
                        <div className="zm-tl-desc">Vehicle EV-002 exited Karol Bagh.</div>
                      </div>
                      <div className="zm-tl-time">1 hour ago</div>
                    </div>
                    <div className="zm-tl-item in_ride">
                      <div className="zm-tl-info">
                        <div className="zm-tl-title">New Vehicles Added</div>
                        <div className="zm-tl-desc">5 vehicles added to Rajendra Place.</div>
                      </div>
                      <div className="zm-tl-time">2 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Card */}
              <div className="zm-bot-card">
                <div className="zm-bot-hdr">
                  <div className="zm-bot-title">Zone Statistics</div>
                </div>
                <div className="zm-bot-body">
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontSize: '12.5px', color: '#6B7280', fontWeight: 600 }}>Total Zones</span>
                       <span style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>{zonesList.length}</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontSize: '12.5px', color: '#6B7280', fontWeight: 600 }}>Active Zones</span>
                       <span style={{ fontSize: '14px', fontWeight: 800, color: '#10B981' }}>{zonesList.filter(z => z.status === 'active').length}</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontSize: '12.5px', color: '#6B7280', fontWeight: 600 }}>Total Area Coverage</span>
                       <span style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>{zonesList.reduce((acc, z) => acc + z.areaKm2, 0).toFixed(2)} km²</span>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontSize: '12.5px', color: '#6B7280', fontWeight: 600 }}>Total Vehicles in Zones</span>
                       <span style={{ fontSize: '14px', fontWeight: 800, color: '#4F46E5' }}>{zonesList.reduce((acc, z) => acc + z.vehicles, 0)}</span>
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

export default function ZoneManagementPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '24px', fontFamily: 'sans-serif', color: '#64748B' }}>
        Loading Zone Management...
      </div>
    }>
      <ZoneManagementContent />
    </Suspense>
  );
}
