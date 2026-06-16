"use client";
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import Link from 'next/link';
import { api } from '@/lib/api';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

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
.zl-summary-ic.green { background: #ECFDF5; color: #10B981; }
.zl-summary-ic.red { background: #FEE2E2; color: #EF4444; }
.zl-summary-ic.purple { background: #F5F3FF; color: #7C3AED; }
.zl-summary-ic.orange { background: #FFF7ED; color: #F97316; }
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
.zs-kpi-ic { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.zs-kpi-ic.purple { background: #FAF5FF; color: #7C3AED; }
.zs-kpi-ic.green { background: #ECFDF5; color: #059669; }
.zs-kpi-ic.blue { background: #EFF6FF; color: #2563EB; }
.zs-kpi-ic.orange { background: #FFF7ED; color: #D97706; }
.zs-kpi-ic.red { background: #FDF2F8; color: #DB2777; }
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
.zs-alert-ic.red { background: #FEE2E2; color: #EF4444; }
.zs-alert-ic.orange { background: #FFF7ED; color: #EA580C; }
.zs-alert-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.zs-alert-txt { font-size: 12px; color: #334155; font-weight: 600; line-height: 1.45; }
.zs-alert-time { font-size: 10.5px; color: #94A3B8; font-weight: 500; }
`;

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
  const initialTab = searchParams.get('tab') || 'Zone Map';

  const [dbZones, setDbZones] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    api.get('/zones')
      .then(res => {
        if (active && res && res.data) {
          setDbZones(res.data);
        }
      })
      .catch(err => {
        console.error('Error fetching zones:', err);
      });
    return () => {
      active = false;
    };
  }, []);

  const zonesList = useMemo(() => {
    if (dbZones.length === 0) {
      return ZONES;
    }
    
    return dbZones.map((dbz, index) => {
      const matchedStatic = ZONES.find(sz => sz.code.toLowerCase() === dbz.code.toLowerCase() || sz.name.toLowerCase() === dbz.name.toLowerCase());
      const pts = Array.isArray(dbz.points) ? dbz.points : JSON.parse(dbz.points || '[]');
      
      let svgPath = '';
      let markerPos = { cx: 250, cy: 230 };
      let coordinates: string[] = [];
      let areaKm2 = 0;
      
      if (matchedStatic) {
        svgPath = matchedStatic.svgPath;
        markerPos = matchedStatic.markerPos;
        coordinates = matchedStatic.coordinates;
        areaKm2 = matchedStatic.areaKm2;
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
        coordinates
      } as ZoneData;
    });
  }, [dbZones]);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedZoneId, setSelectedZoneId] = useState('1');
  const [subtab, setSubtab] = useState('Geo Fence');

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
              <a href="#">Dashboard</a>
              <span className="zm-bc-sep">&gt;</span>
              <a href="#">Operations</a>
              <span className="zm-bc-sep">&gt;</span>
              <span className="zm-bc-cur">Zone Management</span>
            </div>

            {/* Header Title & Top Buttons Row */}
            <div className="zm-title-row">
              <div>
                <h1 className="zm-h1">Zone Management</h1>
                <p className="zm-sub">Create, manage and monitor all operational zones.</p>
              </div>
              <div className="zm-actions">
                {activeTab === 'Geo Fence Logs' && (
                  <button className="zm-btn" onClick={() => alert('Exporting Logs...')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export Logs
                  </button>
                )}
                {activeTab === 'Zone Statistics' && (
                  <>
                    <button className="zm-btn" onClick={() => alert('Exporting Reports...')}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Export Report
                    </button>
                    <button className="zm-btn zm-btn-primary" onClick={() => router.push('/zones/new')}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add New Zone
                    </button>
                  </>
                )}
                {activeTab === 'Zone List' && (
                  <>
                    <button className="zm-btn" onClick={() => alert('Importing Zones...')}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Import Zones
                    </button>
                    <button className="zm-btn zm-btn-green" onClick={() => router.push('/zones/new')}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add New Zone
                    </button>
                  </>
                )}
                {activeTab === 'Zone Map' && (
                  <>
                    <button className="zm-btn" onClick={() => alert('Importing Zones...')}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Import Zones
                    </button>
                    <button className="zm-btn zm-btn-primary" onClick={() => router.push('/zones/new')}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add New Zone
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Tab switch */}
            <div className="zm-tabs-card">
              <div className="zm-tabs-list">
                {['Zone Map', 'Zone List', 'Geo Fence Logs', 'Zone Statistics'].map((tab) => (
                  <button
                    key={tab}
                    className={`zm-tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* 1. ZONE MAP TAB */}
            {activeTab === 'Zone Map' && (
              <>
                <div className="zm-map-grid">
                  {/* Left: Map viewport */}
                  <div className="zm-map-container">
                    {/* Floating Toolbar Draw options */}
                    <div className="zm-draw-toolbar">
                      <button className="zm-draw-btn active" title="Select Tool">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <polygon points="3 11 22 2 13 21 11 13 3 11" />
                        </svg>
                      </button>
                      <button className="zm-draw-btn" title="Draw Polygon" onClick={() => router.push('/zones/new')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <polygon points="12 2 22 8.5 22 19.5 12 22 2 19.5 2 8.5" />
                        </svg>
                      </button>
                      <button className="zm-draw-btn" title="Draw Circle" onClick={() => router.push('/zones/new')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </button>
                      <button className="zm-draw-btn" title="Edit Zone" onClick={() => router.push('/zones/new')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button className="zm-draw-btn" title="Move Map">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <polyline points="5 9 2 12 5 15" /><polyline points="9 5 12 2 15 5" />
                          <polyline points="15 19 12 22 9 19" /><polyline points="19 9 22 12 19 15" />
                          <line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" />
                        </svg>
                      </button>
                      <button className="zm-draw-btn" title="Delete Point" onClick={() => alert('Delete point tool active...')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>

                    {/* Floating Search panel */}
                    <div className="zm-search-panel">
                      <button className="zm-search-back-btn" onClick={() => setZoneSearch('')}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                        </svg>
                      </button>
                      <input type="text" className="zm-search-input" placeholder="Search location" value={zoneSearch} onChange={(e) => setZoneSearch(e.target.value)} />
                      <span className="zm-search-ic">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </span>
                    </div>

                    {/* Floating layers menu */}
                    <div className="zm-layer-toolbar">
                      <button className="zm-layer-btn" onClick={() => alert('Layers option toggled')}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <polygon points="12 2 2 7 12 12 22 7 12 2" /><polygon points="2 17 12 22 22 17 2 17" /><polygon points="2 12 12 17 22 12 2 12" />
                        </svg>
                        Layers
                      </button>
                      <button className="zm-layer-btn" onClick={() => alert('Traffic density overlays loaded')}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        Traffic
                      </button>
                    </div>

                    {/* Floating Zoom controls */}
                    <div className="zm-control-toolbar">
                      <button className="zm-control-btn" onClick={() => alert('Zoom In')}>+</button>
                      <button className="zm-control-btn" onClick={() => alert('Zoom Out')}>-</button>
                      <button className="zm-control-btn" onClick={() => alert('Grid overlay loaded')}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
                          <line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" />
                        </svg>
                      </button>
                      <button className="zm-control-btn" onClick={() => alert('Centering to current location')}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>

                    {/* SVG Map Drawing - Delhi streets */}
                    <svg className="zm-map-svg" viewBox="0 0 500 480">
                      <rect x="0" y="0" width="500" height="480" fill="#EBF0F5" />
                      
                      {/* Grid Blocks */}
                      <g fill="#DEE4EB" stroke="#DFE5EC" strokeWidth="1">
                        <rect x="10" y="10" width="80" height="50" rx="3" />
                        <rect x="100" y="10" width="100" height="50" rx="3" />
                        <rect x="210" y="10" width="120" height="50" rx="3" />
                        <rect x="340" y="10" width="150" height="50" rx="3" />
                        <rect x="15" y="70" width="60" height="80" rx="3" />
                        <rect x="85" y="70" width="60" height="80" rx="3" />
                        <rect x="15" y="160" width="60" height="80" rx="3" />
                        <rect x="85" y="160" width="60" height="80" rx="3" />
                        <rect x="160" y="70" width="100" height="40" rx="3" />
                        <rect x="270" y="70" width="120" height="50" rx="3" />
                        <rect x="160" y="120" width="70" height="40" rx="3" />
                        <rect x="15" y="250" width="115" height="110" rx="3" />
                        <rect x="15" y="370" width="125" height="90" rx="3" />
                        <rect x="370" y="220" width="115" height="110" rx="3" />
                        <rect x="360" y="340" width="125" height="120" rx="3" />
                      </g>

                      {/* Main Roads */}
                      <g fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="250" y1="0" x2="250" y2="480" />
                        <line x1="0" y1="230" x2="500" y2="230" />
                        <circle cx="250" cy="230" r="100" />
                        <circle cx="250" cy="230" r="60" />
                        <line x1="0" y1="65" x2="500" y2="65" />
                        <line x1="0" y1="155" x2="500" y2="155" />
                        <line x1="0" y1="0" x2="500" y2="480" />
                        <line x1="500" y1="0" x2="0" y2="480" />
                      </g>

                      {/* Inner road markings line */}
                      <g fill="none" stroke="#E2E8F0" strokeWidth="1.2" strokeDasharray="3 3">
                        <line x1="250" y1="0" x2="250" y2="480" />
                        <line x1="0" y1="230" x2="500" y2="230" />
                        <circle cx="250" cy="230" r="100" />
                        <circle cx="250" cy="230" r="60" />
                      </g>

                      {/* Area Text Labels */}
                      <g fill="#94A3B8" fontSize="10" fontWeight="700" textAnchor="middle">
                        <text x="110" y="35" transform="rotate(-5 110 35)">Karol Bagh</text>
                        <text x="310" y="85">Pahar Ganj</text>
                        <text x="70" y="270">Rajendra Place</text>
                        <text x="430" y="260">Pragati Maidan</text>
                        <text x="360" y="440">India Gate</text>
                        <text x="180" y="390">Patel Chowk</text>
                        <text x="250" y="335">Shastri Bhawan</text>
                      </g>

                      {/* Selected Geofence Polygon Overlay */}
                      {selectedZone && (
                        <path
                          d={selectedZone.svgPath}
                          fill={selectedZone.color}
                          fillOpacity="0.12"
                          stroke={selectedZone.color}
                          strokeWidth="2.5"
                          strokeDasharray="4 2"
                        />
                      )}

                      {/* Map Markers for active zones */}
                      {zonesList.map(z => {
                        const isSelected = z.id === selectedZoneId;
                        return (
                          <g key={z.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedZoneId(z.id)}>
                            <circle cx={z.markerPos.cx} cy={z.markerPos.cy} r={isSelected ? 10 : 6} fill={z.color} fillOpacity="0.3" />
                            <circle cx={z.markerPos.cx} cy={z.markerPos.cy} r={isSelected ? 5 : 3.5} fill={z.color} />
                            
                            {isSelected && (
                              <g>
                                <rect x={z.markerPos.cx - 50} y={z.markerPos.cy - 36} width="100" height="22" rx="4" fill="#2a195c" />
                                <text x={z.markerPos.cx} y={z.markerPos.cy - 22} fill="#FFFFFF" fontSize="9.5" fontWeight="800" textAnchor="middle">{z.name}</text>
                                <polygon points={`${z.markerPos.cx - 4},${z.markerPos.cy - 14} ${z.markerPos.cx + 4},${z.markerPos.cy - 14} ${z.markerPos.cx},${z.markerPos.cy - 9}`} fill="#2a195c" />
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Right: Zones Sidebar list */}
                  <div className="zm-list-sidebar">
                    <span className="zm-sidebar-title">All Zones ({filteredSidebarZones.length})</span>
                    
                    <div className="zm-sidebar-search">
                      <div className="zm-sidebar-search-wrap">
                        <span className="zm-sidebar-search-ic">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                        </span>
                        <input
                          type="text"
                          className="zm-sidebar-input"
                          placeholder="Search zone"
                          value={zoneSearch}
                          onChange={(e) => setZoneSearch(e.target.value)}
                        />
                      </div>
                      <button className="zm-sidebar-filter" onClick={() => alert('Filter applied')}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                          <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                          <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                          <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
                        </svg>
                      </button>
                    </div>

                    <div className="zm-items-list">
                      {filteredSidebarZones.length === 0 ? (
                        <span style={{ fontSize: '12px', color: '#64748B', textAlign: 'center', padding: '20px' }}>No zones found</span>
                      ) : (
                        filteredSidebarZones.map((z) => (
                          <div
                            key={z.id}
                            className={`zm-item-card ${selectedZoneId === z.id ? 'active' : ''}`}
                            onClick={() => setSelectedZoneId(z.id)}
                          >
                            <div className="zm-item-hdr">
                              <span className="zm-item-title">
                                <span className="zm-item-dot" style={{ background: z.color }} />
                                {z.name}
                              </span>
                              <span className={`status-pill ${z.status === 'active' ? 'pill-active' : 'pill-inactive'}`}>
                                {z.status === 'active' ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className="zm-item-stats">
                              <span className="zm-item-stat-el">
                                <strong>{z.vehicles}</strong> Vehicles
                              </span>
                              <span className="zm-item-stat-el">
                                <strong>{z.renters}</strong> Renters
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Pagination */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                      <button className="zm-sidebar-filter" style={{ width: '28px', height: '28px' }} disabled>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                      </button>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="zm-control-btn" style={{ width: '26px', height: '26px', fontSize: '11px', background: '#2a195c', color: '#fff', borderColor: '#2a195c' }}>1</button>
                        <button className="zm-control-btn" style={{ width: '26px', height: '26px', fontSize: '11px' }}>2</button>
                      </div>
                      <button className="zm-sidebar-filter" style={{ width: '28px', height: '28px' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom detail stats sheet */}
                <div className="zm-bottom-cards">
                  <div className="zm-detail-card">
                    <div className="zm-detail-hdr">
                      <span className="zm-detail-tit">Zone Details</span>
                      <button className="zm-detail-edit-btn" onClick={() => router.push('/zones/new')}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1E293B' }}>{selectedZone.name}</span>
                      <span className={`status-pill ${selectedZone.status === 'active' ? 'pill-active' : 'pill-inactive'}`}>
                        {selectedZone.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="zm-detail-grid">
                      <div className="zm-detail-subcard">
                        <span className="zm-detail-sublbl">Total Vehicles</span>
                        <div className="zm-detail-subval">{selectedZone.vehicles}</div>
                      </div>
                      <div className="zm-detail-subcard">
                        <span className="zm-detail-sublbl">Total Renters</span>
                        <div className="zm-detail-subval">{selectedZone.renters}</div>
                      </div>
                      <div className="zm-detail-subcard">
                        <span className="zm-detail-sublbl">Zone Area</span>
                        <div className="zm-detail-subval">{selectedZone.areaKm2} km²</div>
                      </div>
                    </div>

                    <div className="zm-detail-meta">
                      <span>Created On: <span className="zm-detail-metaval">{selectedZone.createdOn}</span></span>
                      <span>Created By: <span className="zm-detail-metaval">{selectedZone.manager}</span></span>
                    </div>
                  </div>

                  {/* Right coordinates detail card */}
                  <div className="zm-detail-card">
                    <div className="zm-subtabs-row">
                      <button className={`zm-subtab ${subtab === 'Geo Fence' ? 'active' : ''}`} onClick={() => setSubtab('Geo Fence')}>Geo Fence</button>
                      <button className={`zm-subtab ${subtab === 'Zone Statistics' ? 'active' : ''}`} onClick={() => setSubtab('Zone Statistics')}>Zone Statistics</button>
                    </div>

                    {subtab === 'Geo Fence' && (
                      <div className="zm-geofence-grid">
                        <div className="zm-gf-left">
                          <div className="zm-gf-param">
                            <span className="zm-gf-param-lbl">Zone Type</span>
                            <span className="zm-badge-polygon">Polygon</span>
                          </div>
                          <div className="zm-gf-param">
                            <span className="zm-gf-param-lbl">Total Points</span>
                            <span className="zm-gf-param-val">{selectedZone.coordinates.length}</span>
                          </div>
                          <div className="zm-gf-param">
                            <span className="zm-gf-param-lbl">Last Updated</span>
                            <span className="zm-gf-param-val">20 May 2024, 09:15 AM</span>
                          </div>
                          <button className="zm-btn btn-violet" style={{ marginTop: '10px', padding: '8px 12px', fontSize: '12.5px' }} onClick={() => router.push('/zones/new')}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: 4 }}>
                              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                            Edit Geo Fence
                          </button>
                        </div>

                        <div className="zm-gf-right">
                          <div className="zm-gf-coords-title">
                            <span>Geo Fence Coordinates ({selectedZone.coordinates.length} Points)</span>
                            <button
                              className="zm-btn"
                              style={{ padding: '3px 8px', fontSize: '11px', color: '#2a195c', borderColor: '#DDD6FE' }}
                              onClick={handleCopyCoords}
                            >
                              Copy All
                            </button>
                          </div>
                          <div className="zm-coords-grid">
                            {selectedZone.coordinates.map((c, i) => (
                              <div key={i} className="zm-coord-row">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: '#2a195c' }}>
                                  <circle cx="12" cy="12" r="10" />
                                </svg>
                                <span>{c}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {subtab === 'Zone Statistics' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px 0' }}>
                        <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '500' }}>Active Statistics for {selectedZone.name}</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>Swap Rate / day</div>
                            <div style={{ fontSize: '15px', fontWeight: '800', color: '#1E293B', marginTop: '4px' }}>18.4 swaps</div>
                          </div>
                          <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>Avg. Ride Duration</div>
                            <div style={{ fontSize: '15px', fontWeight: '800', color: '#1E293B', marginTop: '4px' }}>42.5 mins</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* 2. ZONE LIST TAB */}
            {activeTab === 'Zone List' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Search & Filters */}
                <div className="zl-filter-card">
                  <div className="zl-filter-grid">
                    <div className="zl-search-wrap">
                      <span className="zl-search-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </span>
                      <input 
                        type="text" 
                        placeholder="Search zone" 
                        className="zl-search-input"
                        value={listSearch}
                        onChange={(e) => setListSearch(e.target.value)}
                      />
                    </div>
                    
                    <select className="zl-select" value={listStatus} onChange={(e) => setListStatus(e.target.value)}>
                      <option value="All">Status: All</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>

                    <button className="zm-btn" onClick={() => alert('More filters applied')}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                        <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                        <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
                      </svg>
                      More Filters
                    </button>
                  </div>
                </div>

                {/* Zones List table */}
                <div className="zm-tbl-card">
                  <div style={{ padding: '16px 18px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>All Zones ({filteredListZones.length})</h2>
                      <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>Manage all operational zones and their details.</p>
                    </div>
                  </div>
                  <div className="zm-tbl-wrap">
                    <table className="zm-tbl">
                      <thead>
                        <tr>
                          <th>Zone Name</th>
                          <th>Zone Code</th>
                          <th>Manager</th>
                          <th>Vehicles</th>
                          <th>Renters</th>
                          <th>Zone Area</th>
                          <th>Status</th>
                          <th>Created On</th>
                          <th style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredListZones.length === 0 ? (
                          <tr>
                            <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>No zones found match search criteria.</td>
                          </tr>
                        ) : (
                          filteredListZones.map((z) => (
                            <tr key={z.id}>
                              <td style={{ fontWeight: '700', color: '#1E293B' }}>
                                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: z.color, marginRight: '8px' }} />
                                {z.name}
                                <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8', fontWeight: '500', marginTop: '2px', marginLeft: '16px' }}>New Delhi, Delhi</span>
                              </td>
                              <td><code>{z.code}</code></td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <div className="zm-tbl-avatar">{z.manager.split(' ').map(n=>n[0]).join('')}</div>
                                  <span style={{ fontWeight: 600 }}>{z.manager}</span>
                                </div>
                              </td>
                              <td style={{ fontWeight: 600 }}>{z.vehicles} Vehicles</td>
                              <td style={{ fontWeight: 600 }}>{z.renters} Renters</td>
                              <td style={{ fontWeight: 600 }}>{z.areaKm2} km²</td>
                              <td>
                                <span className={`status-pill ${z.status === 'active' ? 'pill-active' : 'pill-inactive'}`}>
                                  {z.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td style={{ color: '#64748B' }}>{z.createdOn}</td>
                              <td style={{ textAlign: 'center' }}>
                                <button className="zm-tbl-act-btn" title="View on Map" onClick={() => { setSelectedZoneId(z.id); setActiveTab('Zone Map'); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button className="zm-tbl-act-btn" title="Edit Zone" onClick={() => router.push('/zones/new')}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                                </button>
                                <button className="zm-tbl-act-btn" title="Delete/More" onClick={() => alert(`Settings for ${z.name}`)}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', background: '#FAFBFD', borderTop: '1.5px solid #E2E8F0' }}>
                    <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Showing 1 to {filteredListZones.length} of {filteredListZones.length} zones</span>
                    <div className="bi-pg">
                      <button className="bi-pgb" disabled>&lt;</button>
                      <button className="bi-pgb cur">1</button>
                      <button className="bi-pgb" disabled>&gt;</button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 3. GEO FENCE LOGS TAB */}
            {activeTab === 'Geo Fence Logs' && (
              <div className="zl-split-layout">
                
                {/* Left Side Column */}
                <div className="zl-left-col">
                  
                  {/* Filters row */}
                  <div className="zl-filter-card">
                    <div className="zl-filter-grid">
                      <div className="zl-search-wrap">
                        <span className="zl-search-icon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        </span>
                        <input type="text" className="zl-search-input" value="20 May 2024 - 20 May 2024" readOnly style={{ cursor: 'pointer' }} />
                      </div>
                      
                      <select className="zl-select" value={logFilterZone} onChange={(e) => setLogFilterZone(e.target.value)}>
                        <option value="All Zones">All Zones</option>
                        <option value="Connaught Place">Connaught Place</option>
                        <option value="Karol Bagh">Karol Bagh</option>
                        <option value="Paharganj">Paharganj</option>
                        <option value="Rajendra Place">Rajendra Place</option>
                        <option value="Pragati Maidan">Pragati Maidan</option>
                      </select>

                      <select className="zl-select" value={logFilterEvent} onChange={(e) => setLogFilterEvent(e.target.value)}>
                        <option value="All Events">All Events</option>
                        <option value="Entered">Entered</option>
                        <option value="Exited">Exited</option>
                      </select>

                      <select className="zl-select" value={logFilterVehicle} onChange={(e) => setLogFilterVehicle(e.target.value)}>
                        <option value="All Vehicles">All Vehicles</option>
                        <option value="Electric Scooter">Electric Scooter</option>
                      </select>

                      <button className="zl-reset-btn" onClick={resetLogFilters}>Reset</button>
                    </div>
                  </div>

                  {/* Logs Table */}
                  <div className="zm-tbl-card">
                    <div style={{ padding: '16px 18px', borderBottom: '1px solid #E2E8F0' }}>
                      <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Geo Fence Logs ({filteredLogs.length})</h2>
                      <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>Logs of vehicles entering or exiting geofenced zones.</p>
                    </div>
                    <div className="zm-tbl-wrap">
                      <table className="zm-tbl">
                        <thead>
                          <tr>
                            <th>Date &amp; Time</th>
                            <th>Vehicle Number</th>
                            <th>Vehicle Type</th>
                            <th>Zone Name</th>
                            <th>Event Type</th>
                            <th>Location</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredLogs.length === 0 ? (
                            <tr>
                              <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>No log records match filters.</td>
                            </tr>
                          ) : (
                            filteredLogs.map((log, i) => (
                              <tr key={i}>
                                <td style={{ color: '#64748B' }}>{log.time}</td>
                                <td style={{ fontWeight: '800', color: '#1E293B' }}>{log.vehicle}</td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.2">
                                      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                                      <path d="M3 17h18l-3-11H7L3 17z"/>
                                    </svg>
                                    {log.type}
                                  </div>
                                </td>
                                <td style={{ fontWeight: '700' }}>
                                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: log.color, marginRight: '8px' }} />
                                  {log.zone}
                                </td>
                                <td>
                                  <span className={log.event === 'Entered' ? 'badge-entered' : 'badge-exited'}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                      {log.event === 'Entered' 
                                        ? <path d="M12 5v14M19 12l-7 7-7-7"/>
                                        : <path d="M12 19V5M5 12l7-7 7 7"/>}
                                    </svg>
                                    {log.event}
                                  </span>
                                </td>
                                <td>
                                  {log.location.split('New Delhi')[0]}
                                  <span style={{ display: 'block', fontSize: '11px', color: '#94A3B8', marginTop: '2px', fontWeight: '500' }}>New Delhi, Delhi</span>
                                </td>
                                <td>
                                  <span className="badge-completed">{log.status}</span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', background: '#FAFBFD', borderTop: '1.5px solid #E2E8F0' }}>
                      <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Showing 1 to {filteredLogs.length} of 128 logs</span>
                      <div className="bi-pg">
                        <button className="bi-pgb" disabled>&lt;</button>
                        <button className="bi-pgb cur">1</button>
                        <button className="bi-pgb">2</button>
                        <button className="bi-pgb">3</button>
                        <span style={{ color: '#94A3B8', padding: '0 4px' }}>...</span>
                        <button className="bi-pgb">13</button>
                        <button className="bi-pgb">&gt;</button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Side Column */}
                <div className="zl-right-col">
                  
                  {/* Zone Overview Map widget */}
                  <div className="zl-card">
                    <span className="zl-card-tit">Zone Overview</span>
                    <div className="zl-overview-map">
                      {/* Mini Map preview of selected Connaught Place polygon */}
                      <svg viewBox="150 140 220 180" style={{ width: '100%', height: '100%', background: '#E2E8F0' }}>
                        <rect x="0" y="0" width="500" height="480" fill="#EBF0F5" />
                        <line x1="250" y1="0" x2="250" y2="480" stroke="#FFF" strokeWidth="4" />
                        <line x1="0" y1="230" x2="500" y2="230" stroke="#FFF" strokeWidth="4" />
                        <circle cx="250" cy="230" r="100" fill="none" stroke="#FFF" strokeWidth="4" />
                        
                        <path
                          d="M 250,170 L 290,195 L 320,230 L 290,265 L 250,290 L 210,265 L 180,230 L 210,195 Z"
                          fill="#7C3AED"
                          fillOpacity="0.15"
                          stroke="#7C3AED"
                          strokeWidth="2.5"
                        />
                        <circle cx="250" cy="230" r="5" fill="#7C3AED" />
                        <g fill="#2a195c" fontStyle="bold">
                          <rect x="200" y="210" width="100" height="18" rx="3" fill="#2a195c" />
                          <text x="250" y="222" fill="#fff" fontSize="8" fontWeight="800" textAnchor="middle">Connaught Place</text>
                        </g>
                        
                        {/* Map controls overlay inside mini map */}
                        <g transform="translate(330, 250)" style={{ cursor: 'pointer' }}>
                          <rect x="0" y="0" width="18" height="18" rx="3" fill="#fff" stroke="#CBD5E1" strokeWidth="1"/>
                          <text x="9" y="12" fill="#475569" fontSize="11" fontWeight="700" textAnchor="middle">+</text>
                        </g>
                        <g transform="translate(330, 272)" style={{ cursor: 'pointer' }}>
                          <rect x="0" y="0" width="18" height="18" rx="3" fill="#fff" stroke="#CBD5E1" strokeWidth="1"/>
                          <text x="9" y="11" fill="#475569" fontSize="11" fontWeight="700" textAnchor="middle">-</text>
                        </g>
                        <g transform="translate(330, 294)" style={{ cursor: 'pointer' }}>
                          <rect x="0" y="0" width="18" height="18" rx="3" fill="#fff" stroke="#CBD5E1" strokeWidth="1"/>
                          <svg x="4" y="4" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="3"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                        </g>
                      </svg>
                    </div>
                  </div>

                  {/* Event Summary Widget */}
                  <div className="zl-card">
                    <div className="zl-card-tit">
                      <span>Event Summary</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>(20 May 2024)</span>
                    </div>
                    <div className="zl-summary-grid">
                      <div className="zl-summary-item">
                        <div className="zl-summary-ic green">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                        </div>
                        <div>
                          <div className="zl-summary-num">67</div>
                          <div className="zl-summary-lbl">Total Entered</div>
                        </div>
                      </div>

                      <div className="zl-summary-item">
                        <div className="zl-summary-ic red">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                        </div>
                        <div>
                          <div className="zl-summary-num">61</div>
                          <div className="zl-summary-lbl">Total Exited</div>
                        </div>
                      </div>

                      <div className="zl-summary-item">
                        <div className="zl-summary-ic purple">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                        </div>
                        <div>
                          <div className="zl-summary-num">92</div>
                          <div className="zl-summary-lbl">Inside Zone</div>
                        </div>
                      </div>

                      <div className="zl-summary-item">
                        <div className="zl-summary-ic orange">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        </div>
                        <div>
                          <div className="zl-summary-num">0</div>
                          <div className="zl-summary-lbl">Violations</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Alerts Widget */}
                  <div className="zl-card">
                    <span className="zl-card-tit">Recent Alerts</span>
                    <div className="zl-alert-timeline">
                      <div className="zl-alert-item red">
                        <span className="zl-alert-dot" />
                        <div className="zl-alert-info">
                          <div className="zl-alert-txt">Zone Violation Detected</div>
                          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>EV-12KA-9012 exited Connaught Place zone</div>
                          <div className="zl-alert-time">09:47 AM</div>
                        </div>
                      </div>

                      <div className="zl-alert-item green">
                        <span className="zl-alert-dot" />
                        <div className="zl-alert-info">
                          <div className="zl-alert-txt">Zone Entered</div>
                          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>EV-12KA-1234 entered Connaught Place zone</div>
                          <div className="zl-alert-time">10:35 AM</div>
                        </div>
                      </div>

                      <div className="zl-alert-item red">
                        <span className="zl-alert-dot" />
                        <div className="zl-alert-info">
                          <div className="zl-alert-txt">Zone Exited</div>
                          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>EV-12KA-5678 exited Karol Bagh zone</div>
                          <div className="zl-alert-time">10:18 AM</div>
                        </div>
                      </div>
                    </div>
                    <span 
                      style={{ fontSize: '12px', fontWeight: '700', color: '#8B5CF6', textAlign: 'center', cursor: 'pointer', borderTop: '1px solid #F1F5F9', paddingTop: '10px', display: 'block' }}
                      onClick={() => alert('Viewing all recent alerts...')}
                    >
                      View All Alerts &rarr;
                    </span>
                  </div>

                </div>

              </div>
            )}

            {/* 4. ZONE STATISTICS TAB */}
            {activeTab === 'Zone Statistics' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Statistics Filters row */}
                <div className="zl-filter-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div className="zl-search-wrap">
                        <span className="zl-search-icon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        </span>
                        <input type="text" className="zl-search-input" style={{ width: '220px' }} value="20 May 2024 - 20 May 2024" readOnly />
                      </div>
                      <button className="zm-btn" onClick={() => alert('Filter toggled')}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                        </svg>
                        Filter
                      </button>
                    </div>
                  </div>
                </div>

                {/* 6 KPI Cards Row */}
                <div className="zs-kpi-row">
                  
                  <div className="zs-kpi-card">
                    <div className="zs-kpi-ic purple">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                      </svg>
                    </div>
                    <div className="zs-kpi-info">
                      <span className="zs-kpi-lbl">Total Vehicles</span>
                      <span className="zs-kpi-val">24</span>
                      <div className="zs-kpi-trend up">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
                        <span>9.1% vs last 7 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="zs-kpi-card">
                    <div className="zs-kpi-ic green">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <div className="zs-kpi-info">
                      <span className="zs-kpi-lbl">Total Renters</span>
                      <span className="zs-kpi-val">312</span>
                      <div className="zs-kpi-trend up">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
                        <span>12.4% vs last 7 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="zs-kpi-card">
                    <div className="zs-kpi-ic blue">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                      </svg>
                    </div>
                    <div className="zs-kpi-info">
                      <span className="zs-kpi-lbl">Active Rentals</span>
                      <span className="zs-kpi-val">180</span>
                      <div className="zs-kpi-trend up">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
                        <span>8.3% vs last 7 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="zs-kpi-card">
                    <div className="zs-kpi-ic orange">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    </div>
                    <div className="zs-kpi-info">
                      <span className="zs-kpi-lbl">Total Revenue</span>
                      <span className="zs-kpi-val">₹1,24,560</span>
                      <div className="zs-kpi-trend up">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
                        <span>14.7% vs last 7 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="zs-kpi-card">
                    <div className="zs-kpi-ic green">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="4" y1="4" x2="21" y2="21"/>
                      </svg>
                    </div>
                    <div className="zs-kpi-info">
                      <span className="zs-kpi-lbl">Battery Swaps</span>
                      <span className="zs-kpi-val">96</span>
                      <div className="zs-kpi-trend up">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
                        <span>7.6% vs last 7 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="zs-kpi-card">
                    <div className="zs-kpi-ic red">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    </div>
                    <div className="zs-kpi-info">
                      <span className="zs-kpi-lbl">Alerts</span>
                      <span className="zs-kpi-val">8</span>
                      <div className="zs-kpi-trend down">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
                        <span>20% vs last 7 days</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 3 Graph cards Row */}
                <div className="zs-charts-grid">
                  
                  <div className="zs-chart-card">
                    <div className="zs-chart-hdr">
                      <span className="zs-chart-tit">Vehicle Utilization</span>
                      <select className="zl-select" style={{ padding: '4px 8px', fontSize: '11px', height: '26px' }}>
                        <option>Last 7 Days</option>
                      </select>
                    </div>
                    <div className="zs-chart-body">
                      {/* Vehicle Utilization Line Chart */}
                      <svg viewBox="0 0 320 180" style={{ width: '100%', height: '100%' }}>
                        <defs>
                          <linearGradient id="util-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2"/>
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0"/>
                          </linearGradient>
                        </defs>
                        <g stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3">
                          <line x1="30" y1="20" x2="300" y2="20" />
                          <line x1="30" y1="60" x2="300" y2="60" />
                          <line x1="30" y1="100" x2="300" y2="100" />
                          <line x1="30" y1="140" x2="300" y2="140" />
                        </g>
                        <g fill="#94A3B8" fontSize="9" fontWeight="600">
                          <text x="22" y="23" textAnchor="end">100%</text>
                          <text x="22" y="63" textAnchor="end">75%</text>
                          <text x="22" y="103" textAnchor="end">50%</text>
                          <text x="22" y="143" textAnchor="end">25%</text>
                        </g>
                        <path d="M 30,130 Q 75,100 120,95 T 210,80 T 300,50 L 300,140 L 30,140 Z" fill="url(#util-grad)" />
                        <path d="M 30,130 Q 75,100 120,95 T 210,80 T 300,50" fill="none" stroke="#8B5CF6" strokeWidth="2.5" />
                        <circle cx="300" cy="50" r="4.5" fill="#8B5CF6" stroke="#fff" strokeWidth="1.5" />
                        <g fill="#94A3B8" fontSize="8.5" fontWeight="700" textAnchor="middle">
                          <text x="30" y="160">14 May</text>
                          <text x="120" y="160">16 May</text>
                          <text x="210" y="160">18 May</text>
                          <text x="300" y="160">20 May</text>
                        </g>
                      </svg>
                    </div>
                  </div>

                  <div className="zs-chart-card">
                    <div className="zs-chart-hdr">
                      <span className="zs-chart-tit">Rentals Trend</span>
                      <select className="zl-select" style={{ padding: '4px 8px', fontSize: '11px', height: '26px' }}>
                        <option>Last 7 Days</option>
                      </select>
                    </div>
                    <div className="zs-chart-body">
                      {/* Rentals Trend Line Chart */}
                      <svg viewBox="0 0 320 180" style={{ width: '100%', height: '100%' }}>
                        <defs>
                          <linearGradient id="rent-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2"/>
                            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0"/>
                          </linearGradient>
                        </defs>
                        <g stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3">
                          <line x1="30" y1="20" x2="300" y2="20" />
                          <line x1="30" y1="60" x2="300" y2="60" />
                          <line x1="30" y1="100" x2="300" y2="100" />
                          <line x1="30" y1="140" x2="300" y2="140" />
                        </g>
                        <g fill="#94A3B8" fontSize="9" fontWeight="600">
                          <text x="22" y="23" textAnchor="end">250</text>
                          <text x="22" y="63" textAnchor="end">150</text>
                          <text x="22" y="103" textAnchor="end">100</text>
                          <text x="22" y="143" textAnchor="end">50</text>
                        </g>
                        <path d="M 30,130 Q 75,120 120,80 T 210,50 T 300,75 L 300,140 L 30,140 Z" fill="url(#rent-grad)" />
                        <path d="M 30,130 Q 75,120 120,80 T 210,50 T 300,75" fill="none" stroke="#2563EB" strokeWidth="2.5" />
                        <circle cx="210" cy="50" r="4.5" fill="#2563EB" stroke="#fff" strokeWidth="1.5" />
                        <g fill="#94A3B8" fontSize="8.5" fontWeight="700" textAnchor="middle">
                          <text x="30" y="160">14 May</text>
                          <text x="120" y="160">16 May</text>
                          <text x="210" y="160">18 May</text>
                          <text x="300" y="160">20 May</text>
                        </g>
                      </svg>
                    </div>
                  </div>

                  <div className="zs-chart-card">
                    <div className="zs-chart-hdr">
                      <span className="zs-chart-tit">Revenue Overview</span>
                      <select className="zl-select" style={{ padding: '4px 8px', fontSize: '11px', height: '26px' }}>
                        <option>Last 7 Days</option>
                      </select>
                    </div>
                    <div className="zs-chart-body">
                      {/* Revenue Overview Bar Chart */}
                      <svg viewBox="0 0 320 180" style={{ width: '100%', height: '100%' }}>
                        <g stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3">
                          <line x1="30" y1="20" x2="300" y2="20" />
                          <line x1="30" y1="60" x2="300" y2="60" />
                          <line x1="30" y1="100" x2="300" y2="100" />
                          <line x1="30" y1="140" x2="300" y2="140" />
                        </g>
                        <g fill="#94A3B8" fontSize="9" fontWeight="600">
                          <text x="22" y="23" textAnchor="end">40K</text>
                          <text x="22" y="63" textAnchor="end">30K</text>
                          <text x="22" y="103" textAnchor="end">20K</text>
                          <text x="22" y="143" textAnchor="end">10K</text>
                        </g>
                        <g fill="#6366F1">
                          <rect x="42" y="80" width="14" height="60" rx="3" />
                          <rect x="80" y="90" width="14" height="50" rx="3" />
                          <rect x="118" y="55" width="14" height="85" rx="3" />
                          <rect x="156" y="45" width="14" height="95" rx="3" />
                          <rect x="194" y="60" width="14" height="80" rx="3" />
                          <rect x="232" y="55" width="14" height="85" rx="3" />
                          <rect x="270" y="32" width="14" height="108" rx="3" />
                        </g>
                        <g fill="#94A3B8" fontSize="8.5" fontWeight="700" textAnchor="middle">
                          <text x="49" y="160">14 May</text>
                          <text x="125" y="160">16 May</text>
                          <text x="201" y="160">18 May</text>
                          <text x="277" y="160">20 May</text>
                        </g>
                      </svg>
                    </div>
                  </div>

                </div>

                {/* Lower Grid: Activity, Performance, Rankings */}
                <div className="zs-lower-grid">
                  
                  <div className="zm-detail-card" style={{ height: 'fit-content' }}>
                    <div className="zm-detail-hdr">
                      <span className="zm-detail-tit">Zone Activity Summary</span>
                    </div>
                    <div className="zs-summary-list">
                      <div className="zs-summary-item">
                        <span className="zs-summary-lbl">New Rentals</span>
                        <div className="zs-summary-val">
                          <span style={{ fontWeight: '800' }}>132</span>
                          <span style={{ color: '#16A34A', fontSize: '11px', display: 'flex', alignItems: 'center' }}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '1px' }}><polyline points="18 15 12 9 6 15"/></svg>
                            10.2%
                          </span>
                        </div>
                      </div>

                      <div className="zs-summary-item">
                        <span className="zs-summary-lbl">Vehicle Returns</span>
                        <div className="zs-summary-val">
                          <span style={{ fontWeight: '800' }}>118</span>
                          <span style={{ color: '#16A34A', fontSize: '11px', display: 'flex', alignItems: 'center' }}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '1px' }}><polyline points="18 15 12 9 6 15"/></svg>
                            7.8%
                          </span>
                        </div>
                      </div>

                      <div className="zs-summary-item">
                        <span className="zs-summary-lbl">Extensions</span>
                        <div className="zs-summary-val">
                          <span style={{ fontWeight: '800' }}>28</span>
                          <span style={{ color: '#16A34A', fontSize: '11px', display: 'flex', alignItems: 'center' }}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '1px' }}><polyline points="18 15 12 9 6 15"/></svg>
                            3.4%
                          </span>
                        </div>
                      </div>

                      <div className="zs-summary-item">
                        <span className="zs-summary-lbl">Cancellations</span>
                        <div className="zs-summary-val">
                          <span style={{ fontWeight: '800' }}>12</span>
                          <span style={{ color: '#EF4444', fontSize: '11px', display: 'flex', alignItems: 'center' }}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '1px' }}><polyline points="6 9 12 15 18 9"/></svg>
                            -4.0%
                          </span>
                        </div>
                      </div>

                      <div className="zs-summary-item">
                        <span className="zs-summary-lbl">Battery Swaps</span>
                        <div className="zs-summary-val">
                          <span style={{ fontWeight: '800' }}>96</span>
                          <span style={{ color: '#16A34A', fontSize: '11px', display: 'flex', alignItems: 'center' }}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '1px' }}><polyline points="18 15 12 9 6 15"/></svg>
                            7.6%
                          </span>
                        </div>
                      </div>
                    </div>
                    <span 
                      style={{ fontSize: '12.5px', fontWeight: '700', color: '#8B5CF6', textAlign: 'center', cursor: 'pointer', borderTop: '1px solid #F1F5F9', paddingTop: '10px', display: 'block' }}
                      onClick={() => alert('Opening full activity report...')}
                    >
                      View Full Activity Report &rarr;
                    </span>
                  </div>

                  <div className="zm-detail-card" style={{ height: 'fit-content' }}>
                    <div className="zm-detail-hdr">
                      <span className="zm-detail-tit">Zone Performance Overview</span>
                    </div>
                    <table className="zm-tbl" style={{ minWidth: 'auto' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '8px 10px' }}>Metric</th>
                          <th style={{ padding: '8px 10px' }}>Value</th>
                          <th style={{ padding: '8px 10px' }}>Change</th>
                          <th style={{ padding: '8px 10px', textAlign: 'center' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '8px 10px', fontWeight: '600' }}>Vehicle Utilization</td>
                          <td style={{ padding: '8px 10px' }}>74.6%</td>
                          <td style={{ padding: '8px 10px', color: '#16A34A', fontWeight: '700' }}>+9.1%</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}><span className="zs-badge-good">Good</span></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 10px', fontWeight: '600' }}>Rental Conversion Rate</td>
                          <td style={{ padding: '8px 10px' }}>68.2%</td>
                          <td style={{ padding: '8px 10px', color: '#16A34A', fontWeight: '700' }}>+6.3%</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}><span className="zs-badge-good">Good</span></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 10px', fontWeight: '600' }}>Revenue per Vehicle</td>
                          <td style={{ padding: '8px 10px' }}>₹5,190</td>
                          <td style={{ padding: '8px 10px', color: '#16A34A', fontWeight: '700' }}>+11.8%</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}><span className="zs-badge-excellent">Excellent</span></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 10px', fontWeight: '600' }}>Avg. Rental Duration</td>
                          <td style={{ padding: '8px 10px' }}>6h 24m</td>
                          <td style={{ padding: '8px 10px', color: '#16A34A', fontWeight: '700' }}>+5.2%</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}><span className="zs-badge-good">Good</span></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 10px', fontWeight: '600' }}>Customer Satisfaction</td>
                          <td style={{ padding: '8px 10px' }}>4.6 / 5</td>
                          <td style={{ padding: '8px 10px', color: '#16A34A', fontWeight: '700' }}>+2.1%</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}><span className="zs-badge-good">Good</span></td>
                        </tr>
                      </tbody>
                    </table>
                    <span 
                      style={{ fontSize: '12.5px', fontWeight: '700', color: '#8B5CF6', textAlign: 'center', cursor: 'pointer', borderTop: '1px solid #F1F5F9', paddingTop: '10px', display: 'block' }}
                      onClick={() => alert('Opening detailed performance report...')}
                    >
                      View Detailed Performance &rarr;
                    </span>
                  </div>

                  <div className="zm-detail-card" style={{ height: 'fit-content' }}>
                    <div className="zm-detail-hdr">
                      <span className="zm-detail-tit">Top Performing Zones</span>
                    </div>
                    <table className="zm-tbl" style={{ minWidth: 'auto' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '8px 10px' }}>Zone</th>
                          <th style={{ padding: '8px 10px' }}>Revenue</th>
                          <th style={{ padding: '8px 10px' }}>Rentals</th>
                          <th style={{ padding: '8px 10px' }}>Util.</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '8px 10px', fontWeight: '700' }}>Connaught Place</td>
                          <td style={{ padding: '8px 10px' }}>₹1,24,560</td>
                          <td style={{ padding: '8px 10px' }}>180</td>
                          <td style={{ padding: '8px 10px' }}>74.6%</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 10px', fontWeight: '700' }}>Karol Bagh</td>
                          <td style={{ padding: '8px 10px' }}>₹98,230</td>
                          <td style={{ padding: '8px 10px' }}>152</td>
                          <td style={{ padding: '8px 10px' }}>71.2%</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 10px', fontWeight: '700' }}>Paharganj</td>
                          <td style={{ padding: '8px 10px' }}>₹76,890</td>
                          <td style={{ padding: '8px 10px' }}>120</td>
                          <td style={{ padding: '8px 10px' }}>68.4%</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 10px', fontWeight: '700' }}>Rajendra Place</td>
                          <td style={{ padding: '8px 10px' }}>₹62,450</td>
                          <td style={{ padding: '8px 10px' }}>98</td>
                          <td style={{ padding: '8px 10px' }}>65.1%</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 10px', fontWeight: '700' }}>Pragati Maidan</td>
                          <td style={{ padding: '8px 10px' }}>₹58,340</td>
                          <td style={{ padding: '8px 10px' }}>86</td>
                          <td style={{ padding: '8px 10px' }}>61.3%</td>
                        </tr>
                      </tbody>
                    </table>
                    <span 
                      style={{ fontSize: '12.5px', fontWeight: '700', color: '#8B5CF6', textAlign: 'center', cursor: 'pointer', borderTop: '1px solid #F1F5F9', paddingTop: '10px', display: 'block' }}
                      onClick={() => setActiveTab('Zone List')}
                    >
                      View All Zones &rarr;
                    </span>
                  </div>

                </div>

                {/* Heatmap & Alerts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
                  
                  {/* Heatmap peak hours */}
                  <div className="zm-detail-card">
                    <div className="zm-detail-hdr">
                      <span className="zm-detail-tit">Peak Hours (Rentals)</span>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                        <span>Low</span>
                        <div style={{ width: '40px', height: '10px', background: 'linear-gradient(90deg, #F3E8FF, #7C3AED)', borderRadius: '2px' }} />
                        <span>High</span>
                      </div>
                    </div>
                    
                    <div className="zs-heatmap-row">
                      {PEAK_HOURS_DATA.map((d, i) => (
                        <div 
                          key={i} 
                          className="zs-heatmap-cell" 
                          style={{ 
                            '--bar-height': d.height, 
                            '--bar-opacity': String(d.opacity) 
                          } as React.CSSProperties}
                          title={`${d.val} rentals at ${d.hour}:00`}
                        />
                      ))}
                    </div>
                    <div className="zs-heatmap-hours-labels">
                      {PEAK_HOURS_DATA.map((d, i) => (
                        <span key={i}>{d.hour}</span>
                      ))}
                    </div>
                  </div>

                  {/* Statistics alerts timeline */}
                  <div className="zm-detail-card" style={{ height: 'fit-content' }}>
                    <div className="zm-detail-hdr">
                      <span className="zm-detail-tit">Zone Alerts &amp; Notifications</span>
                      <span style={{ fontSize: '11px', color: '#8B5CF6', fontWeight: 700, cursor: 'pointer' }} onClick={() => alert('Viewing all notifications...')}>View All</span>
                    </div>
                    <div className="zs-alerts-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      
                      <div className="zs-alert-item">
                        <div className="zs-alert-ic red">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        </div>
                        <div className="zs-alert-info">
                          <span className="zs-alert-txt">High vehicle demand detected near Karol Bagh area</span>
                          <span className="zs-alert-time">10 min ago</span>
                        </div>
                      </div>

                      <div className="zs-alert-item">
                        <div className="zs-alert-ic orange">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        </div>
                        <div className="zs-alert-info">
                          <span className="zs-alert-txt">2 vehicles require immediate maintenance</span>
                          <span className="zs-alert-time">45 min ago</span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            )}

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
