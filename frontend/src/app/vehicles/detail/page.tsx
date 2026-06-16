'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

/* ──────────────────────────────────────────────────────────────
   VEHICLE DETAIL PAGE  ·  Redesigned Diagnostic Profile (Leaflet)
   ────────────────────────────────────────────────────────────── */

declare global {
  interface Window {
    L: any;
  }
}
declare var L: any;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
.vd-shell{display:flex;min-height:100vh;background:#F3F4F9;font-family:Inter,sans-serif;}
.vd-main{margin-left:240px;display:flex;flex-direction:column;min-height:100vh;width:calc(100% - 240px);}
.vd-page{flex:1;padding:0 28px 60px;}

/* breadcrumb */
.vd-bc{display:flex;align-items:center;gap:6px;padding:14px 0 0;font-size:12px;color:#9CA3AF;}
.vd-bc a{color:#9CA3AF;text-decoration:none;}
.vd-bc a:hover{color:#4F46E5;}
.vd-bc-sep{color:#D1D5DB;}
.vd-bc-cur{color:#4F46E5;font-weight:600;}

/* Title row */
.vd-title-row{display:flex;align-items:center;justify-content:space-between;margin:12px 0 16px;gap:16px;}
.vd-title-left{display:flex;align-items:center;gap:12px;}
.vd-back-btn{width:34px;height:34px;border-radius:50%;border:1.5px solid #E5E7EB;background:#fff;display:flex;align-items:center;justify-content:center;color:#4B5563;cursor:pointer;text-decoration:none;transition:all .15s;}
.vd-back-btn:hover{color:#4F46E5;border-color:#C7D2FE;background:#F5F3FF;}
.vd-title-info{display:flex;flex-direction:column;}
.vd-title-h1-row{display:flex;align-items:center;gap:10px;}
.vd-h1{font-size:22px;font-weight:800;color:#111827;margin:0;}
.vd-active-badge{background:#DCFCE7;color:#16A34A;border:1px solid #BBF7D0;border-radius:6px;font-size:11px;font-weight:700;padding:2px 8px;}
.vd-sub{font-size:13px;color:#6B7280;margin:4px 0 0;}

.vd-hdr-actions{display:flex;align-items:center;gap:10px;}
.vd-btn{display:flex;align-items:center;gap:7px;padding:9px 16px;background:#fff;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;font-weight:600;color:#374151;cursor:pointer;font-family:inherit;box-shadow:0 1px 3px rgba(0,0,0,.06);transition:all .15s;text-decoration:none;}
.vd-btn:hover{border-color:#4F46E5;color:#4F46E5;}
.vd-btn.primary{border-color:#4F46E5;color:#4F46E5;background:#F5F3FF;}

/* Header Scooter + KPI Strip Section */
.vd-header-card{background:#fff;border:1px solid #E5E7EB;border-radius:16px;padding:18px 24px;box-shadow:0 1px 4px rgba(0,0,0,.04);display:flex;align-items:center;gap:28px;margin-bottom:20px;}
.vd-scooter-wrap{width:110px;height:110px;border-radius:12px;background:#F9FAFB;border:1px solid #E5E7EB;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;}
.vd-scooter-img{width:90%;height:90%;object-fit:contain;}

.vd-kpi-strip{flex:1;display:grid;grid-template-columns:repeat(5,1fr);gap:16px;}
.vd-kpi-item{border-right:1px solid #E5E7EB;padding-right:12px;display:flex;flex-direction:column;gap:5px;}
.vd-kpi-item:last-child{border-right:none;padding-right:0;}
.vd-kpi-lbl{font-size:10.5px;color:#9CA3AF;font-weight:600;display:flex;align-items:center;gap:5px;}
.vd-kpi-val{font-size:15px;font-weight:800;color:#111827;}
.vd-kpi-bar-wrap{display:flex;align-items:center;gap:8px;margin-top:2px;}
.vd-kpi-bar{flex:1;height:5px;background:#E5E7EB;border-radius:3px;overflow:hidden;max-width:80px;}
.vd-kpi-bar-fill{height:100%;background:#10B981;border-radius:3px;}
.vd-kpi-dot{width:7px;height:7px;border-radius:50%;background:#10B981;display:inline-block;}

/* Tabs row */
.vd-tabs{display:flex;gap:24px;border-bottom:1.5px solid #E5E7EB;margin-bottom:22px;overflow-x:auto;}
.vd-tab{padding:8px 4px 12px;font-size:13px;font-weight:600;color:#6B7280;cursor:pointer;position:relative;white-space:nowrap;transition:color .15s;}
.vd-tab:hover{color:#4F46E5;}
.vd-tab.active{color:#4F46E5;}
.vd-tab.active::after{content:'';position:absolute;bottom:-1.5px;left:0;right:0;height:2.5px;background:#4F46E5;border-radius:2px 2px 0 0;}

/* Grid Row 1 (3 Columns Layout: 1fr 1.8fr 1.2fr) */
.vd-grid-1{display:grid;grid-template-columns:1fr 1.8fr 1.2fr;gap:20px;margin-bottom:20px;align-items:stretch;}
.vd-card{background:#fff;border:1px solid #E5E7EB;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,.05);overflow:hidden;display:flex;flex-direction:column;}
.vd-card-hdr{padding:14px 18px;border-bottom:1px solid #F3F4F6;display:flex;align-items:center;justify-content:space-between;font-size:13.5px;font-weight:700;color:#111827;}
.vd-card-hdr-left{display:flex;align-items:center;gap:6px;}
.vd-card-body{padding:16px 18px;flex:1;display:flex;flex-direction:column;gap:12px;}

/* Info table */
.vd-info-row{display:flex;align-items:center;justify-content:space-between;font-size:12.5px;padding:6px 0;border-bottom:1px solid #F9FAFB;}
.vd-info-row:last-child{border-bottom:none;}
.vd-info-lbl{color:#6B7280;}
.vd-info-val{font-weight:600;color:#111827;text-align:right;display:flex;align-items:center;gap:5px;}
.vd-copy-ic{color:#9CA3AF;cursor:pointer;}
.vd-copy-ic:hover{color:#4F46E5;}

.vd-card-btn{width:100%;padding:9px;border:1.5px solid #E5E7EB;border-radius:8px;background:#fff;font-size:12.5px;font-weight:700;color:#4B5563;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;font-family:inherit;transition:all .15s;margin-top:auto;}
.vd-card-btn:hover{color:#4F46E5;border-color:#C7D2FE;background:#F5F3FF;}

/* Map container & controls */
.vd-map-card{position:relative;background:#fff;border:1px solid #E5E7EB;border-radius:16px;box-shadow:0 1px 4px rgba(0,0,0,.05);overflow:hidden;}
.vd-map-box{width:100%;height:100%;min-height:360px;background:#F3F4F9;position:relative;}
.vd-map-loading{position:absolute;inset:0;background:rgba(255,255,255,0.85);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:20;font-size:13px;font-weight:600;color:#4F46E5;}

.vd-map-ctrls{position:absolute;bottom:20px;right:20px;display:flex;flex-direction:column;gap:6px;z-index:1000;}
.vd-map-zoom-btn{width:36px;height:36px;border-radius:8px;background:#fff;border:1px solid #E5E7EB;box-shadow:0 2px 8px rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#374151;font-size:18px;font-weight:700;transition:all .15s;}
.vd-map-zoom-btn:hover{border-color:#4F46E5;color:#4F46E5;}

.vd-map-layers-btn{position:absolute;top:20px;right:20px;width:36px;height:36px;border-radius:8px;background:#fff;border:1px solid #E5E7EB;box-shadow:0 2px 8px rgba(0,0,0,.08);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#374151;z-index:1000;transition:all .15s;}
.vd-map-layers-btn:hover{border-color:#4F46E5;color:#4F46E5;}

/* Actions card 2x4 grid */
.vd-action-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:8px;}
.vd-act-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:12px 4px;border:1.5px solid #E5E7EB;border-radius:10px;background:#fff;cursor:pointer;transition:all .15s;}
.vd-act-btn-lbl{font-size:9.5px;font-weight:700;color:#4B5563;}
.vd-act-btn.lock{color:#7C3AED;}
.vd-act-btn.unlock{color:#10B981;border-color:#A7F3D0;background:#ECFDF5;}
.vd-act-btn.lightson{color:#F59E0B;}
.vd-act-btn.lightsoff{color:#6B7280;}
.vd-act-btn.horn{color:#4F46E5;}
.vd-act-btn.locate{color:#8B5CF6;}
.vd-act-btn.restart{color:#06B6D4;}
.vd-act-btn.immobilize{color:#EF4444;border-color:#FCA5A5;background:#FEF2F2;}
.vd-act-btn:hover{transform:translateY(-1px);box-shadow:0 2px 5px rgba(0,0,0,0.06);}

.vd-act-more-link{display:block;text-align:center;font-size:12px;color:#4F46E5;font-weight:700;text-decoration:none;margin-top:2px;margin-bottom:8px;}
.vd-act-more-link:hover{text-decoration:underline;}

/* Assigned Renter Section */
.vd-renter-box{display:flex;align-items:center;justify-content:space-between;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:12px;padding:10px 14px;}
.vd-renter-left{display:flex;align-items:center;gap:10px;}
.vd-renter-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6366F1,#8B5CF6);color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;}
.vd-renter-name{font-size:12.5px;font-weight:800;color:#111827;}
.vd-renter-phone{font-size:11.5px;color:#6B7280;margin-top:1px;}
.vd-renter-actions{display:flex;gap:6px;}
.vd-renter-btn{width:30px;height:30px;border-radius:6px;border:1.5px solid #E5E7EB;background:#fff;color:#4B5563;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;}
.vd-renter-btn:hover{color:#4F46E5;border-color:#C7D2FE;background:#F5F3FF;}

/* Grid Row 2 (4 Columns Layout) */
.vd-grid-2{display:grid;grid-template-columns:1fr 1.1fr 1fr 1.2fr;gap:20px;margin-bottom:20px;}

/* Battery SoC Bar */
.vd-bat-bar-container{margin-bottom:12px;}
.vd-bat-hdr-row{display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:700;color:#111827;margin-bottom:6px;}
.vd-bat-ic-wrap{display:flex;align-items:center;gap:6px;color:#6B7280;}
.vd-bat-bar-bg{height:8px;background:#E5E7EB;border-radius:4px;overflow:hidden;}
.vd-bat-bar-fill{height:100%;background:#10B981;border-radius:4px;}

/* timeline activity */
.vd-timeline{display:flex;flex-direction:column;gap:0;position:relative;padding-left:14px;}
.vd-timeline::before{content:'';position:absolute;left:3px;top:5px;bottom:5px;width:1.5px;background:#E5E7EB;}
.vd-tl-item{display:flex;align-items:flex-start;justify-content:space-between;padding-bottom:11px;position:relative;}
.vd-tl-item:last-child{padding-bottom:0;}
.vd-tl-item::before{content:'';position:absolute;left:-14px;top:4.5px;width:7.5px;height:7.5px;border-radius:50%;border:1.5px solid #fff;box-shadow:0 1px 2px rgba(0,0,0,0.15);z-index:2;}
.vd-tl-item.green::before{background:#10B981;}
.vd-tl-item.blue::before{background:#3B82F6;}
.vd-tl-item.amber::before{background:#F59E0B;}
.vd-tl-item.orange::before{background:#F97316;}
.vd-tl-lbl{font-size:12px;font-weight:700;color:#111827;}
.vd-tl-time{font-size:10px;color:#9CA3AF;font-weight:500;}

/* Today summary columns */
.vd-summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;border-bottom:1px solid #F3F4F6;padding-bottom:12px;margin-bottom:8px;}
.vd-summary-box{display:flex;flex-direction:column;gap:3px;}
.vd-summary-lbl{font-size:10px;color:#9CA3AF;font-weight:600;}
.vd-summary-val{font-size:13.5px;font-weight:800;color:#111827;}

.vd-card-link{font-size:12.5px;font-weight:700;color:#4F46E5;text-decoration:none;display:inline-block;margin-top:auto;}
.vd-card-link:hover{text-decoration:underline;}

/* Custom label classes for Leaflet divIcon overlay */
.custom-map-label{border:none !important;background:none !important;}
.map-lbl{border:none !important;background:none !important;}
.kb-pin{border:none !important;background:none !important;}
.pm-pin{border:none !important;background:none !important;}
.scooter-live-pin{border:none !important;background:none !important;}
`;

/* ── SVG Icons ── */
const SI = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const Sv = (p: React.SVGProps<SVGSVGElement> & { s?: number }) => (
  <svg width={p.s || 14} height={p.s || 14} viewBox="0 0 24 24" {...SI} {...p} />
);

const ILocate   = () => <Sv><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></Sv>;
const IScooter  = ({ s = 14 }) => <Sv s={s}><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></Sv>;
const ILock     = () => <Sv><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Sv>;
const IUnlock   = () => <Sv><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></Sv>;
const ISun      = () => <Sv><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></Sv>;
const IMoon     = () => <Sv><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Sv>;
const IVolume   = () => <Sv><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></Sv>;
const IPower    = () => <Sv><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></Sv>;
const ICalendar = () => <Sv><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></Sv>;
const IFileText  = () => <Sv><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></Sv>;
const IDots     = () => <Sv><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></Sv>;
const IShield   = () => <Sv><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></Sv>;
const IArrowLeft = () => <Sv><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></Sv>;
const ICopy      = () => <Sv><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Sv>;
const ICall      = () => <Sv><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></Sv>;
const IChat      = () => <Sv><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Sv>;
const ILayers    = () => <Sv><polygon points="12 2 2 7 12 12 22 7 12 2"/><polygon points="2 17 12 22 22 17"/><polygon points="2 12 12 17 22 12"/></Sv>;
const ICheck     = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

export default function VehicleDetailPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  
  const mapInstance = useRef<any>(null);
  const LRef = useRef<any>(null);

  // Dynamic Leaflet Loader
  useEffect(() => {
    if (window.L) {
      LRef.current = window.L;
      setLeafletLoaded(true);
      return;
    }
    
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    
    // Load JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      LRef.current = (window as any).L;
      setLeafletLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  // Initialize Redesigned Leaflet Map
  useEffect(() => {
    if (!leafletLoaded || !LRef.current) return;
    const L = LRef.current;
    
    const container = document.getElementById("detail-leaflet-map");
    if (container && !container.classList.contains("leaflet-container")) {
      const map = L.map("detail-leaflet-map", {
        zoomControl: false,
        attributionControl: false
      }).setView([28.6320, 77.2150], 13); // Centered to fit route KB -> CP -> PM
      
      mapInstance.current = map;

      // Add styled light map tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      // Geofence Circle CP
      L.circle([28.6304, 77.2177], {
        color: '#818CF8',
        fillColor: '#818CF8',
        fillOpacity: 0.08,
        radius: 650,
        weight: 1.5,
        dashArray: '5, 5'
      }).addTo(map);
      
      // Connaught Place Text Label
      L.marker([28.6304, 77.2177], {
        icon: L.divIcon({
          className: 'custom-map-label',
          html: '<div style="font-size:12px;font-weight:800;color:#3730A3;text-align:center;line-height:1.2;opacity:0.85;">Connaught<br>Place</div>',
          iconSize: [80, 40],
          iconAnchor: [40, 20]
        })
      }).addTo(map);

      // Neighborhood Label markers
      const neighborhoods = [
        { name: 'Karol Bagh', lat: 28.6448, lng: 77.1888 },
        { name: 'Paharganj', lat: 28.6440, lng: 77.2144 },
        { name: 'Rajendra Place', lat: 28.6425, lng: 77.1783 },
        { name: 'Jantar Mantar', lat: 28.6271, lng: 77.2166 },
        { name: 'Pragati Maidan', lat: 28.6220, lng: 77.2435 },
        { name: 'India Gate', lat: 28.6129, lng: 77.2295 }
      ];
      neighborhoods.forEach(n => {
        L.marker([n.lat, n.lng], {
          icon: L.divIcon({
            className: 'map-lbl',
            html: `<div style="font-size:11px;font-weight:700;color:#9CA3AF;text-align:center;">${n.name}</div>`,
            iconSize: [100, 20],
            iconAnchor: [50, 10]
          })
        }).addTo(map);
      });

      // Karol Bagh (KB) Green Icon
      const kbIcon = L.divIcon({
        className: 'kb-pin',
        html: `
          <div style="background:#10B981;color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2.5px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,0.25);font-size:10px;font-weight:800;">
            KB
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker([28.6448, 77.1888], { icon: kbIcon }).addTo(map);

      // Pragati Maidan (PM) Red Icon
      const pmIcon = L.divIcon({
        className: 'pm-pin',
        html: `
          <div style="background:#EF4444;color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2.5px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,0.25);font-size:10px;font-weight:800;">
            PM
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker([28.6220, 77.2435], { icon: pmIcon }).addTo(map);

      // Live Scooter icon at CP
      const scooterIcon = L.divIcon({
        className: 'scooter-live-pin',
        html: `
          <div style="display:flex;align-items:center;gap:6px;position:relative;">
            <div style="background:#fff;border:1px solid #E5E7EB;box-shadow:0 2px 6px rgba(0,0,0,0.12);border-radius:6px;padding:3.5px 8px;font-size:10px;font-weight:800;color:#111827;white-space:nowrap;position:absolute;left:-44px;bottom:30px;display:flex;flex-direction:column;align-items:center;gap:1px;">
              EV-12KA-1234
              <span style="font-size:8.5px;color:#9CA3AF;font-weight:600;margin-top:1px;">● 25 km/h</span>
            </div>
            <div style="background:#4F46E5;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.35);">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      L.marker([28.6304, 77.2177], { icon: scooterIcon }).addTo(map);

      // Path KB -> CP -> PM
      const pathCoords = [
        [28.6448, 77.1888],
        [28.6430, 77.2020],
        [28.6304, 77.2177],
        [28.6250, 77.2320],
        [28.6220, 77.2435]
      ];
      L.polyline(pathCoords, {
        color: '#4F46E5',
        weight: 3.5,
        opacity: 0.85
      }).addTo(map);
    }
  }, [leafletLoaded]);

  // Programmatic Zoom controls
  const handleZoomIn = () => {
    if (mapInstance.current) {
      mapInstance.current.zoomIn();
    }
  };
  const handleZoomOut = () => {
    if (mapInstance.current) {
      mapInstance.current.zoomOut();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="vd-shell">
        <Sidebar activePath="/vehicles/detail" />
        <div className="vd-main">
          <TopBar />
          <div className="vd-page">

            {/* Breadcrumbs */}
            <div className="vd-bc">
              <Link href="/">Home</Link>
              <span className="vd-bc-sep">›</span>
              <Link href="/vehicles/all">Vehicles</Link>
              <span className="vd-bc-sep">›</span>
              <span className="vd-bc-cur">Vehicle Details</span>
            </div>

            {/* Header Title Row */}
            <div className="vd-title-row">
              <div className="vd-title-left">
                <Link href="/vehicles/all" className="vd-back-btn">
                  <IArrowLeft />
                </Link>
                <div className="vd-title-info">
                  <div className="vd-title-h1-row">
                    <h1 className="vd-h1">EV-12KA-1234</h1>
                    <span className="vd-active-badge">Active</span>
                  </div>
                  <p className="vd-sub">Electric Scooter • Ather 450X</p>
                </div>
              </div>
              <div className="vd-hdr-actions">
                <Link href="/vehicles/map" className="vd-btn">
                  <ILocate /> View on Map
                </Link>
                <button className="vd-btn">
                  <IDots /> More Actions
                </button>
              </div>
            </div>

            {/* Scooter green image + KPI strip */}
            <div className="vd-header-card">
              <div className="vd-scooter-wrap">
                <img src="/assets/v1.webp" alt="Ather 450X" className="vd-scooter-img" />
              </div>
              <div className="vd-kpi-strip">
                <div className="vd-kpi-item">
                  <span className="vd-kpi-lbl"><IScooter s={12} /> Battery</span>
                  <span className="vd-kpi-val">78%</span>
                  <div className="vd-kpi-bar-wrap">
                    <div className="vd-kpi-bar">
                      <div className="vd-kpi-bar-fill" style={{ width: '78%' }} />
                    </div>
                  </div>
                </div>
                <div className="vd-kpi-item">
                  <span className="vd-kpi-lbl"><ILocate /> Speed</span>
                  <span className="vd-kpi-val">25 km/h</span>
                </div>
                <div className="vd-kpi-item">
                  <span className="vd-kpi-lbl"><ICalendar /> Odometer</span>
                  <span className="vd-kpi-val">2,156 km</span>
                </div>
                <div className="vd-kpi-item">
                  <span className="vd-kpi-lbl"><div className="vd-kpi-dot" /> Status</span>
                  <span className="vd-kpi-val" style={{ color: '#16A34A' }}>Online</span>
                </div>
                <div className="vd-kpi-item">
                  <span className="vd-kpi-lbl"><ICalendar /> Last Updated</span>
                  <span className="vd-kpi-val" style={{ fontSize: 13, fontWeight: 700 }}>20 May 2024, 10:15 AM</span>
                </div>
              </div>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="vd-tabs">
              {['Overview', 'Live Tracking', 'Ride History', 'Alerts', 'Maintenance', 'Documents'].map(tab => (
                <div 
                  key={tab} 
                  className={`vd-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </div>
              ))}
            </div>

            {/* Row 1 Layout (1fr 1.8fr 1.2fr) */}
            <div className="vd-grid-1">
              
              {/* Column 1: Current Ride */}
              <div className="vd-card">
                <div className="vd-card-hdr">
                  <div className="vd-card-hdr-left"><IScooter s={14} /> Current Ride</div>
                  <span className="vd-active-badge" style={{ background: '#F5F3FF', color: '#4F46E5', borderColor: '#C7D2FE' }}>In Ride</span>
                </div>
                <div className="vd-card-body">
                  {[
                    { lbl: 'Ride ID', val: 'RID-2024-5678', color: '#4F46E5', bold: true },
                    { lbl: 'Renter', val: 'Rahul Sharma', avatar: 'RS' },
                    { lbl: 'Pickup Time', val: '20 May 2024, 09:45 AM' },
                    { lbl: 'Pickup Location', val: 'Palika Bazaar, CP', sub: 'New Delhi, Delhi' },
                    { lbl: 'Destination', val: 'Pragati Maidan Gate 1', sub: 'New Delhi, Delhi' },
                    { lbl: 'Distance', val: '5.2 km' },
                    { lbl: 'Ride Duration', val: '18 mins' }
                  ].map(r => (
                    <div className="vd-info-row" key={r.lbl}>
                      <span className="vd-info-lbl">{r.lbl}</span>
                      {r.avatar ? (
                        <div className="vd-renter-left">
                          <div className="vd-avatar" style={{ width: 18, height: 18, fontSize: 8 }}>{r.avatar}</div>
                          <span style={{ fontWeight: 700, fontSize: 12.5 }}>{r.val}</span>
                        </div>
                      ) : (
                        <span className="vd-info-val" style={{ color: r.color, fontWeight: r.bold ? 700 : 600 }}>
                          {r.val}
                          {r.sub && <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500, textAlign: 'right', marginTop: 1 }}>{r.sub}</div>}
                        </span>
                      )}
                    </div>
                  ))}
                  <button className="vd-card-btn">View Ride Details</button>
                </div>
              </div>

              {/* Column 2: Leaflet Map */}
              <div className="vd-map-card">
                {/* Loader */}
                {!leafletLoaded && (
                  <div className="vd-map-loading">Loading interactive Leaflet Map...</div>
                )}
                
                {/* Map Div */}
                <div id="detail-leaflet-map" className="vd-map-box" />

                {/* Manual Leaflet controls overlay */}
                <div className="vd-map-ctrls">
                  <div className="vd-map-zoom-btn" onClick={handleZoomIn}>+</div>
                  <div className="vd-map-zoom-btn" onClick={handleZoomOut}>-</div>
                  <div className="vd-map-zoom-btn" style={{ fontSize: 13 }} onClick={() => mapInstance.current?.setView([28.6304, 77.2177], 14)}><ILocate/></div>
                </div>

                <div className="vd-map-layers-btn">
                  <ILayers/>
                </div>
              </div>

              {/* Column 3: Vehicle Actions & Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Actions Box */}
                <div className="vd-card">
                  <div className="vd-card-hdr">
                    <div className="vd-card-hdr-left"><ILock /> Vehicle Actions</div>
                  </div>
                  <div className="vd-card-body" style={{ paddingBottom: 14 }}>
                    <div className="vd-action-grid">
                      <div className="vd-act-btn lock"><ILock/><span className="vd-act-btn-lbl">Lock</span></div>
                      <div className="vd-act-btn unlock"><IUnlock/><span className="vd-act-btn-lbl">Unlock</span></div>
                      <div className="vd-act-btn lightson"><ISun/><span className="vd-act-btn-lbl">Lights On</span></div>
                      <div className="vd-act-btn lightsoff"><IMoon/><span className="vd-act-btn-lbl">Lights Off</span></div>
                      <div className="vd-act-btn horn"><IVolume/><span className="vd-act-btn-lbl">Horn</span></div>
                      <div className="vd-act-btn locate" onClick={() => mapInstance.current?.setView([28.6304, 77.2177], 15)}><ILocate/><span className="vd-act-btn-lbl">Locate</span></div>
                      <div className="vd-act-btn restart"><IPower/><span className="vd-act-btn-lbl">Restart</span></div>
                      <div className="vd-act-btn immobilize"><IShield/><span className="vd-act-btn-lbl">Immobilize</span></div>
                    </div>
                    <a href="#" className="vd-act-more-link">More Actions ...</a>
                  </div>
                </div>

                {/* Info & Renter Box */}
                <div className="vd-card" style={{ flex: 1 }}>
                  <div className="vd-card-hdr">
                    <div className="vd-card-hdr-left"><IFileText /> Vehicle Information</div>
                  </div>
                  <div className="vd-card-body">
                    {[
                      { lbl: 'Vehicle Type', val: 'Electric Scooter' },
                      { lbl: 'VIN', val: 'EV12KA12340001', copy: true },
                      { lbl: 'Motor ID', val: 'MTR-450X-78123' },
                      { lbl: 'Firmware Version', val: 'v3.2.1' },
                      { lbl: 'Registration Date', val: '15 Apr 2024' },
                      { lbl: 'Insurance Valid Till', val: '14 Apr 2025' }
                    ].map(r => (
                      <div className="vd-info-row" key={r.lbl}>
                        <span className="vd-info-lbl">{r.lbl}</span>
                        <span className="vd-info-val">
                          {r.val}
                          {r.copy && <span className="vd-copy-ic" onClick={() => copyToClipboard(r.val)}><ICopy/></span>}
                        </span>
                      </div>
                    ))}
                    
                    {/* Assigned Renter */}
                    <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 10, marginTop: 4 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>Assigned Renter</div>
                      <div className="vd-renter-box">
                        <div className="vd-renter-left">
                          <div className="vd-renter-avatar">RS</div>
                          <div>
                            <div className="vd-renter-name">Rahul Sharma</div>
                            <div className="vd-renter-phone">+91 98765 43210</div>
                          </div>
                        </div>
                        <div className="vd-renter-actions">
                          <button className="vd-renter-btn"><ICall/></button>
                          <button className="vd-renter-btn"><IChat/></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Row 2 Layout (4 Columns) */}
            <div className="vd-grid-2">
              
              {/* Column 1: Battery Details */}
              <div className="vd-card">
                <div className="vd-card-hdr">
                  <div className="vd-card-hdr-left"><IScooter s={14}/> Battery Details</div>
                </div>
                <div className="vd-card-body">
                  <div className="vd-bat-bar-container">
                    <div className="vd-bat-hdr-row">
                      <span className="vd-bat-ic-wrap"><IScooter s={12}/> Battery SoC</span>
                      <span>78%</span>
                    </div>
                    <div className="vd-bat-bar-bg">
                      <div className="vd-bat-bar-fill" style={{ width: '78%' }} />
                    </div>
                  </div>
                  {[
                    { lbl: 'Range', val: '58 km' },
                    { lbl: 'Temperature', val: '32°C' },
                    { lbl: 'Battery Health', val: 'Good', badge: true }
                  ].map(r => (
                    <div className="vd-info-row" key={r.lbl}>
                      <span className="vd-info-lbl">{r.lbl}</span>
                      {r.badge ? (
                        <span className="vd-active-badge">Good</span>
                      ) : (
                        <span className="vd-info-val">{r.val}</span>
                      )}
                    </div>
                  ))}
                  <a href="#" className="vd-card-link">View Battery Analytics</a>
                </div>
              </div>

              {/* Column 2: Last Known Location */}
              <div className="vd-card">
                <div className="vd-card-hdr">
                  <div className="vd-card-hdr-left"><ILocate/> Last Known Location</div>
                </div>
                <div className="vd-card-body">
                  {[
                    { lbl: 'Location', val: 'Palika Bazaar, Connaught Place', sub: 'New Delhi, Delhi - 110001' },
                    { lbl: 'Time', val: '20 May 2024, 10:15 AM' },
                    { lbl: 'Coordinates', val: '28.6315, 77.2167' }
                  ].map(r => (
                    <div className="vd-info-row" key={r.lbl}>
                      <span className="vd-info-lbl" style={{ alignSelf: 'flex-start' }}>{r.lbl}</span>
                      <span className="vd-info-val" style={{ display: 'block' }}>
                        {r.val}
                        {r.sub && <div style={{ fontSize: 10.5, color: '#9CA3AF', fontWeight: 500, marginTop: 1 }}>{r.sub}</div>}
                      </span>
                    </div>
                  ))}
                  <button className="vd-card-btn" style={{ marginTop: 'auto' }}><ILocate/> Locate Vehicle</button>
                </div>
              </div>

              {/* Column 3: Today's Summary */}
              <div className="vd-card">
                <div className="vd-card-hdr">
                  <div className="vd-card-hdr-left"><ICheck/> Today's Summary</div>
                </div>
                <div className="vd-card-body">
                  <div className="vd-summary-grid">
                    <div className="vd-summary-box">
                      <span className="vd-summary-lbl">Total Distance</span>
                      <span className="vd-summary-val" style={{ color: '#4F46E5' }}>24.5 km</span>
                    </div>
                    <div className="vd-summary-box">
                      <span className="vd-summary-lbl">Total Ride Time</span>
                      <span className="vd-summary-val">2h 45m</span>
                    </div>
                  </div>
                  {[
                    { lbl: 'Total Rides', val: '6' },
                    { lbl: 'Top Speed', val: '48 km/h' }
                  ].map(r => (
                    <div className="vd-info-row" key={r.lbl}>
                      <span className="vd-info-lbl">{r.lbl}</span>
                      <span className="vd-info-val">{r.val}</span>
                    </div>
                  ))}
                  <a href="#" className="vd-card-link">View Full Analytics</a>
                </div>
              </div>

              {/* Column 4: Recent Activity */}
              <div className="vd-card">
                <div className="vd-card-hdr">
                  <div className="vd-card-hdr-left"><ICalendar /> Recent Activity</div>
                  <a href="#" style={{ fontSize: 11.5, color: '#4F46E5', fontWeight: 700, textDecoration: 'none' }}>View All</a>
                </div>
                <div className="vd-card-body">
                  <div className="vd-timeline">
                    {[
                      { tit: 'Ride Started', time: '09:45 AM', type: 'green' },
                      { tit: 'Entered Karol Bagh Zone', time: '09:50 AM', type: 'blue' },
                      { tit: 'Low Battery Alert (25%)', time: '10:02 AM', type: 'amber' },
                      { tit: 'Exited Karol Bagh Zone', time: '10:05 AM', type: 'orange' },
                      { tit: 'Reached Destination', time: '10:08 AM', type: 'green' }
                    ].map((t, idx) => (
                      <div className={`vd-tl-item ${t.type}`} key={idx}>
                        <div>
                          <div className="vd-tl-lbl">{t.tit}</div>
                          <div className="vd-tl-time">{t.time}</div>
                        </div>
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
