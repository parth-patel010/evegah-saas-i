"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { api } from '@/lib/api';

const CSS = `
.re-shell { display: flex; min-height: 100vh; background: #F3F4F9; font-family: 'Inter', sans-serif; }
.re-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.re-page { flex: 1; padding: 20px 22px 70px; display: flex; flex-direction: column; gap: 20px; }

/* Header title */
.re-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 4px; }
.re-h1 { font-size: 22px; font-weight: 800; color: #111827; margin: 0 0 4px; letter-spacing: -0.02em; }
.re-sub { font-size: 13px; color: #6B7280; margin: 0; font-weight: 400; }

/* Header Action Buttons */
.re-actions { display: flex; align-items: center; gap: 10px; }
.re-btn { display: flex; align-items: center; gap: 7px; padding: 10px 18px; background: #fff; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all .15s; }
.re-btn:hover { border-color: #2a195c; color: #2a195c; }
.re-btn-primary { background: #2a195c; color: #fff; border-color: #2a195c; }
.re-btn-primary:hover { background: #1E1044; border-color: #1E1044; color: #fff; }

/* Stat Cards Grid (5 Cards) */
.re-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
.re-sc { background: #fff; border: 1px solid #E5E7EB; border-radius: 12px; padding: 15px 16px 13px; box-shadow: 0 1px 3px rgba(0,0,0,.04); }
.re-sc-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2px; }
.re-sc-ic { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.re-sc-tit { font-size: 11.5px; font-weight: 500; color: #6B7280; }
.re-sc-per { font-size: 10.5px; color: #9CA3AF; margin-top: 1px; }
.re-sc-val { font-size: 24px; font-weight: 800; color: #111827; line-height: 1; margin: 6px 0; }

.ic-purple { background: #F3E8FF; color: #6D28D9; }
.ic-green { background: #DCFCE7; color: #16A34A; }
.ic-orange { background: #FFEDD5; color: #C2410C; }
.ic-blue { background: #DBEAFE; color: #1D4ED8; }

/* Directory Container Card */
.re-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,.02); overflow: hidden; display: flex; flex-direction: column; }

/* Filter Controls Row */
.re-filters-bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: #fff; border-bottom: 1px solid #E2E8F0; gap: 16px; }
.re-filters-left { display: flex; align-items: center; gap: 12px; flex: 1; }
.re-search-wrapper { position: relative; display: flex; align-items: center; width: 100%; max-width: 320px; }
.re-search-ic { position: absolute; left: 12px; color: #94A3B8; display: flex; align-items: center; }
.re-input-search { width: 100%; padding: 8px 12px 8px 36px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 12.5px; outline: none; color: #1E293B; background: #fff; font-weight: 500; }
.re-input-search:focus { border-color: #2a195c; }

/* Data Table layout */
.re-table-wrap { overflow-x: auto; width: 100%; }
.re-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 12.5px; }
.re-table th { font-size: 11px; font-weight: 600; color: #9CA3AF; text-transform: uppercase; letter-spacing: .06em; padding: 12px 18px; border-bottom: 1px solid #E5E7EB; background: #FAFBFD; white-space: nowrap; }
.re-table td { padding: 12px 18px; color: #111827; border-bottom: 1px solid #F3F4F6; vertical-align: middle; white-space: nowrap; }
.re-table tr:last-child td { border-bottom: none; }
.re-table tr:hover td { background: #FAFBFC; }

/* Rider Avatar */
.re-rider-cell { display: flex; align-items: center; gap: 10px; }
.re-avatar { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; background: #EEF2FF; flex-shrink: 0; }

/* Monospace text elements */
.re-code { font-family: 'SFMono-Regular', Consolas, Menlo, monospace; font-size: 11px; color: #475569; background: #F1F5F9; padding: 2px 6px; border-radius: 4px; font-weight: 600; }

/* Colored Status pills */
.re-sbadge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; white-space: nowrap; }
.s-active { background: #DCFCE7; color: #15803D; }
.s-retain { background: #FFEDD5; color: #C2410C; }
.s-return { background: #DBEAFE; color: #1D4ED8; }
.s-extend { background: #F3E8FF; color: #6D28D9; }

/* Action Buttons Container */
.re-action-cell { display: flex; align-items: center; justify-content: center; gap: 6px; }
.re-action-btn { width: 28px; height: 28px; border: 1px solid #E5E7EB; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #2a195c; background: #fff; cursor: pointer; transition: all .15s; }
.re-action-btn:hover { border-color: #2a195c; background: #F5F3FF; }
.re-dots-btn { width: 28px; height: 28px; border: none; background: transparent; display: flex; align-items: center; justify-content: center; color: #94A3B8; cursor: pointer; font-size: 14px; font-weight: bold; }
.re-dots-btn:hover { color: #2a195c; }

/* Pagination footer */
.re-card-ft { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-top: 1px solid #E5E7EB; background: #fff; }
.re-card-ft-lbl { font-size: 12px; color: #9CA3AF; }
.re-pg { display: flex; align-items: center; gap: 4px; }
.re-pgb { width: 28px; height: 28px; border: 1px solid #E5E7EB; border-radius: 6px; background: #fff; font-size: 12px; font-weight: 500; color: #6B7280; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .12s; }
.re-pgb:hover:not(:disabled) { border-color: #2a195c; color: #2a195c; }
.re-pgb:disabled { opacity: 0.5; cursor: not-allowed; }
.re-pgb.cur { background: #2a195c; color: #fff; border-color: #2a195c; font-weight: 600; }

/* Copyright footer */
.re-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid #E2E8F0; font-size: 11.5px; color: #94A3B8; margin-top: 20px; }
`;

interface Renter {
  rider_name: string;
  mobile: string;
  vehicle_id: string;
  battery_id: string;
  package_name: string;
  rental_start_date: string;
  return_date: string | null;
  status: 'Active Ride' | 'Retain Ride' | 'Return' | 'Extend';
  rent: string;
  deposit: string;
  total: string;
  avatar_url: string | null;
}

export default function RentersPage() {
  const [renters, setRenters] = useState<Renter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });

  // Fetch Renters from API on filters/page change
  useEffect(() => {
    setLoading(true);
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: '10',
      search: search,
      status: statusFilter
    });

    api.get(`/renters?${queryParams.toString()}`)
      .then((res: any) => {
        if (res.status === 'success' && res.data) {
          setRenters(res.data);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      })
      .catch((err) => {
        console.error('Error loading renters:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search, statusFilter, page]);

  // Format Helper to render Rupees without decimals
  const formatCurrency = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Format Date Helper (Split into bold date and small time)
  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return { date: '-', time: '' };
    const d = new Date(dateStr);
    const date = d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }); // e.g. 24 May, 2025
    const time = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }); // e.g. 09:15 AM
    return { date, time };
  };

  // Status Badge Class Helper
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active Ride': return 's-active';
      case 'Retain Ride': return 's-retain';
      case 'Return': return 's-return';
      case 'Extend': return 's-extend';
      default: return '';
    }
  };

  // Status Badge Text Helper (map DB status 'Return' -> 'Returned')
  const getStatusLabel = (status: string) => {
    if (status === 'Return') return 'Returned';
    if (status === 'Extend') return 'Extended';
    return status;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="re-shell">
        <Sidebar activePath="/renters" />
        <div className="re-main">
          <TopBar title="Renter" subtitle="Dashboard > Renter" />

          <div className="re-page">
            {/* Header Area */}
            <div className="re-title-row">
              <div>
                <h1 className="re-h1">Renter</h1>
                <p className="re-sub">Manage rider subscriptions, rentals, and payments</p>
              </div>
            </div>

            {/* Stat Counters Grid (5 Cards matching screenshot) */}
            <div className="re-stats">
              <div className="re-sc">
                <div className="re-sc-top">
                  <div>
                    <div className="re-sc-tit">Total Rides</div>
                    <div className="re-sc-per">All rides</div>
                  </div>
                  <div className="re-sc-ic ic-purple">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="3"/><circle cx="5" cy="5" r="3"/><circle cx="19" cy="5" r="3"/><line x1="5" y1="5" x2="12" y2="12"/><line x1="19" y1="5" x2="12" y2="12"/></svg>
                  </div>
                </div>
                <div className="re-sc-val">1,248</div>
              </div>

              <div className="re-sc">
                <div className="re-sc-top">
                  <div>
                    <div className="re-sc-tit">Active Rides</div>
                    <div className="re-sc-per">In progress</div>
                  </div>
                  <div className="re-sc-ic ic-green">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  </div>
                </div>
                <div className="re-sc-val">582</div>
              </div>

              <div className="re-sc">
                <div className="re-sc-top">
                  <div>
                    <div className="re-sc-tit">Retain Rides</div>
                    <div className="re-sc-per">Retained</div>
                  </div>
                  <div className="re-sc-ic ic-orange">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  </div>
                </div>
                <div className="re-sc-val">243</div>
              </div>

              <div className="re-sc">
                <div className="re-sc-top">
                  <div>
                    <div className="re-sc-tit">Returned</div>
                    <div className="re-sc-per">Completed</div>
                  </div>
                  <div className="re-sc-ic ic-blue">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                </div>
                <div className="re-sc-val">389</div>
              </div>

              <div className="re-sc">
                <div className="re-sc-top">
                  <div>
                    <div className="re-sc-tit">Extended</div>
                    <div className="re-sc-per">Extended</div>
                  </div>
                  <div className="re-sc-ic ic-purple">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                  </div>
                </div>
                <div className="re-sc-val">34</div>
              </div>
            </div>

            {/* Directory Card */}
            <div className="re-card">
              {/* Filters Panel */}
              <div className="re-filters-bar">
                <div className="re-filters-left">
                  <div className="re-search-wrapper">
                    <span className="re-search-ic">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search by rider name, mobile, vehicle ID..."
                      className="re-input-search"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>

                  <button className="re-btn">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                    Filters
                  </button>

                  <select
                    className="re-select"
                    style={{ minWidth: '130px' }}
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">All Statuses</option>
                    <option value="Active Ride">Active Ride</option>
                    <option value="Retain Ride">Retain Ride</option>
                    <option value="Return">Returned</option>
                    <option value="Extend">Extended</option>
                  </select>
                </div>

                <div className="re-actions">
                  <button className="re-btn">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export
                  </button>
                  <button className="re-btn re-btn-primary">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Renter
                  </button>
                </div>
              </div>

              {/* Table Wrapper */}
              <div className="re-table-wrap">
                {loading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading renters dataset...</div>
                ) : renters.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>No renters matching filter parameters found.</div>
                ) : (
                  <table className="re-table">
                    <thead>
                      <tr>
                        <th>Rider Name</th>
                        <th>Mobile</th>
                        <th>Vehicle ID</th>
                        <th>Battery ID</th>
                        <th>Package</th>
                        <th>Rental Start Date</th>
                        <th>Return Date</th>
                        <th>Status</th>
                        <th>Rent</th>
                        <th>Deposit</th>
                        <th>Total</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renters.map((r, idx) => {
                        const start = formatDateTime(r.rental_start_date);
                        const end = formatDateTime(r.return_date);

                        return (
                          <tr key={idx}>
                            <td>
                              <div className="re-rider-cell">
                                <img 
                                  src={r.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                                  alt="" 
                                  className="re-avatar" 
                                />
                                <span style={{ fontWeight: 600 }}>{r.rider_name}</span>
                              </div>
                            </td>
                            <td style={{ color: '#64748B' }}>{r.mobile}</td>
                            <td><span className="re-code">{r.vehicle_id}</span></td>
                            <td><span className="re-code">{r.battery_id}</span></td>
                            <td style={{ fontWeight: 500 }}>{r.package_name}</td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{start.date}</div>
                              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>{start.time}</div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600 }}>{end.date}</div>
                              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>{end.time}</div>
                            </td>
                            <td>
                              <span className={`re-sbadge ${getStatusClass(r.status)}`}>
                                {getStatusLabel(r.status)}
                              </span>
                            </td>
                            <td style={{ fontWeight: 600 }}>{formatCurrency(r.rent)}</td>
                            <td style={{ fontWeight: 600, color: '#64748B' }}>{formatCurrency(r.deposit)}</td>
                            <td style={{ fontWeight: 800, color: '#2a195c' }}>{formatCurrency(r.total)}</td>
                            <td>
                              <div className="re-action-cell">
                                <Link href="/renters/profile?id=RID-2024-000578" className="re-action-btn" title="View details">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </Link>
                                <button className="re-action-btn" title="Edit details">
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button className="re-dots-btn" title="More options">⋮</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination footer */}
              <div className="re-card-ft">
                <span className="re-card-ft-lbl">
                  Showing {(page - 1) * pagination.limit + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} entries
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <select 
                    className="re-select" 
                    style={{ minWidth: '100px', padding: '6px 8px', fontSize: '12px' }}
                    value={pagination.limit}
                    disabled
                  >
                    <option value="10">10 per page</option>
                  </select>
                  <div className="re-pg">
                    <button 
                      className="re-pgb" 
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`re-pgb ${p === page ? 'cur' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                    <button 
                      className="re-pgb" 
                      disabled={page === pagination.totalPages}
                      onClick={() => setPage(p => p + 1)}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright & version footer */}
            <div className="re-footer">
              <span>© 2025 Evegah Technologies</span>
              <span>Version 2.4.0</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
