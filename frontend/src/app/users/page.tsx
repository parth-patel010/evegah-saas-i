"use client";
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.usr-shell { display: flex; min-height: 100vh; background: #F8F9FF; font-family: 'Inter', sans-serif; }
.usr-main { margin-left: 230px; display: flex; flex-direction: column; min-height: 100vh; width: calc(100% - 230px); }
.usr-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; flex: 1; }

/* Breadcrumb */
.usr-bc { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748B; font-weight: 500; }
.usr-bc a { color: #8B5CF6; text-decoration: none; font-weight: 600; transition: color .15s; }
.usr-bc a:hover { color: #6D28D9; }
.usr-bc-sep { color: #D8B4FE; font-weight: 600; }
.usr-bc-cur { color: #0F172A; font-weight: 700; }

/* Title row */
.usr-title-row { display: flex; align-items: flex-start; justify-content: space-between; margin-top: -4px; }
.usr-h1 { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0; }
.usr-sub { font-size: 13.5px; color: #64748B; margin-top: 4px; font-weight: 500; }

/* KPI Stats cards */
.usr-stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 4px; }
.usr-stat-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.usr-stat-ic { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ic-purple { background: #FAF5FF; color: #7C3AED; }
.ic-green { background: #ECFDF5; color: #10B981; }
.ic-orange { background: #FFF7ED; color: #F97316; }
.ic-blue { background: #EFF6FF; color: #3B82F6; }

.usr-stat-info { flex: 1; display: flex; flex-direction: column; }
.usr-stat-lbl { font-size: 11.5px; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.usr-stat-val { font-size: 22px; font-weight: 800; color: #0F172A; line-height: 1.2; margin-top: 2px; }
.usr-growth { display: flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 700; margin-top: 4px; }
.usr-growth.up { color: #16A34A; }
.usr-growth.down { color: #EF4444; }
.usr-growth.neutral { color: #64748B; }

/* Tab Switcher Row */
.usr-tab-row { display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #E2E8F0; margin-top: 10px; margin-bottom: 4px; }
.usr-tabs { display: flex; gap: 28px; }
.usr-tab-btn { padding: 12px 8px; font-size: 14px; font-weight: 700; color: #64748B; border: none; background: none; cursor: pointer; transition: all .15s; border-bottom: 3px solid transparent; margin-bottom: -1.5px; }
.usr-tab-btn:hover { color: #2a195c; }
.usr-tab-btn.active { color: #2a195c; border-bottom-color: #2a195c; }

/* Primary Button */
.usr-btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; background: #2a195c; color: #fff; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .15s; }
.usr-btn-primary:hover { background: #4338CA; }

/* Filters Panel */
.usr-filter-card { background: #fff; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px 16px; box-shadow: 0 1px 3px rgba(0,0,0,.02); }
.usr-filter-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr auto; gap: 12px; align-items: center; }
.usr-search-wrap { position: relative; display: flex; align-items: center; }
.usr-search-input { width: 100%; padding: 8px 12px 8px 34px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; outline: none; transition: border-color .15s; }
.usr-search-input:focus { border-color: #2a195c; }
.usr-search-icon { position: absolute; left: 12px; color: #94A3B8; display: flex; align-items: center; }
.usr-select { padding: 8px 12px; border: 1.5px solid #E2E8F0; border-radius: 8px; font-size: 13px; outline: none; background: #fff; color: #374151; cursor: pointer; font-weight: 500; }
.usr-select:focus { border-color: #2a195c; }
.usr-reset-btn { font-size: 12.5px; font-weight: 700; color: #EF4444; background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 4px; }
.usr-reset-btn:hover { text-decoration: underline; }

/* Table styling */
.usr-tcard { background: #fff; border: 1px solid #E2E8F0; border-radius: 14px; box-shadow: 0 1px 3px rgba(0,0,0,.02); overflow: hidden; }
.usr-dt { width: 100%; border-collapse: collapse; }
.usr-dt th { font-size: 11px; font-weight: 700; color: #94A3B8; text-transform: uppercase; letter-spacing: .05em; text-align: left; padding: 12px 18px; background: #FAFBFD; border-bottom: 1.5px solid #E2E8F0; }
.usr-dt td { padding: 12px 18px; font-size: 13px; color: #334155; border-bottom: 1px solid #F1F5F9; vertical-align: middle; }
.usr-dt tr:last-child td { border-bottom: none; }
.usr-dt tr:hover td { background: #FAFBFD; }

.usr-profile-cell { display: flex; align-items: center; gap: 10px; }
.usr-avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.usr-avatar.purple { background: #F5F3FF; color: #7C3AED; border: 1px solid #E9D5FF; }
.usr-avatar.green { background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0; }
.usr-avatar.orange { background: #FFF7ED; color: #D97706; border: 1px solid #FFEDD5; }
.usr-avatar.blue { background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; }
.usr-avatar.pink { background: #FDF2F8; color: #DB2777; border: 1px solid #FBCFE8; }

.usr-badge { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 6px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; border: 1px solid transparent; }
.badge-active { background: #DCFCE7; color: #15803D; border-color: #BBF7D0; }
.badge-inactive { background: #FEE2E2; color: #991B1B; border-color: #FCA5A5; }

/* Custom Role badges */
.role-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 700; border: 1px solid transparent; }
.role-badge.purple { background: #F5F3FF; color: #7E22CE; border-color: #E9D5FF; }
.role-badge.blue { background: #EFF6FF; color: #1D4ED8; border-color: #BFDBFE; }
.role-badge.orange { background: #FFF7ED; color: #C2410C; border-color: #FFEDD5; }
.role-badge.teal { background: #F0FDFA; color: #0F766E; border-color: #CCFBF1; }
.role-badge.indigo { background: #EEF2FF; color: #4338CA; border-color: #E0E7FF; }

/* Action Buttons */
.usr-act-btn { width: 30px; height: 30px; border: 1.5px solid #E2E8F0; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; color: #64748B; background: #fff; cursor: pointer; transition: all .15s; }
.usr-act-btn:hover { border-color: #2a195c; color: #2a195c; background: #F8FAFC; }
.usr-act-btn-group { display: flex; gap: 6px; }

/* Pagination footer */
.usr-tcard-ft { display: flex; align-items: center; justify-content: space-between; padding: 12px 18px; border-top: 1.5px solid #E2E8F0; background: #FAFBFD; }
.usr-tcard-ft-lbl { font-size: 12px; color: #64748B; font-weight: 500; }
.usr-pg { display: flex; align-items: center; gap: 4px; }
.usr-pgb { width: 28px; height: 28px; border: 1.5px solid #E2E8F0; border-radius: 8px; background: #fff; font-size: 12px; font-weight: 600; color: #64748B; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; }
.usr-pgb:hover:not(:disabled) { border-color: #2a195c; color: #2a195c; }
.usr-pgb.cur { background: #2a195c; color: #fff; border-color: #2a195c; }
.usr-pgb:disabled { opacity: 0.5; cursor: not-allowed; }
.usr-pg-select { padding: 4px 8px; border: 1.5px solid #E2E8F0; border-radius: 6px; font-size: 12px; outline: none; font-weight: 500; background: #fff; height: 28px; cursor: pointer; }

/* Roles section header */
.usr-roles-hdr { display: flex; justify-content: space-between; align-items: center; margin-top: 32px; margin-bottom: 16px; }
.usr-roles-tit { font-size: 16px; font-weight: 800; color: #0F172A; margin: 0; }
`;

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  zone: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

interface Role {
  name: string;
  description: string;
  usersCount: number;
  lastUpdated: string;
}

const INITIAL_USERS: User[] = [
  { id: 'USR-001', name: 'Akash Verma', email: 'akash.verma@evegah.com', mobile: '+91 98765 43210', role: 'Zone Admin', zone: 'Connaught Place Zone', status: 'Active', lastLogin: '20 May 2024, 10:30 AM' },
  { id: 'USR-002', name: 'Rohit Sharma', email: 'rohit.sharma@evegah.com', mobile: '+91 87654 32109', role: 'Operations Manager', zone: 'Connaught Place Zone', status: 'Active', lastLogin: '20 May 2024, 09:15 AM' },
  { id: 'USR-003', name: 'Neha Pahuja', email: 'neha.pahuja@evegah.com', mobile: '+91 96543 21098', role: 'Franchise Manager', zone: 'Connaught Place Zone', status: 'Active', lastLogin: '19 May 2024, 06:45 PM' },
  { id: 'USR-004', name: 'Sandeep Kumar', email: 'sandeep.kumar@evegah.com', mobile: '+91 91234 56789', role: 'Battery Technician', zone: 'Multiple Zones', status: 'Active', lastLogin: '19 May 2024, 04:20 PM' },
  { id: 'USR-005', name: 'Pooja Mehta', email: 'pooja.mehta@evegah.com', mobile: '+91 99887 77665', role: 'Support Executive', zone: 'Connaught Place Zone', status: 'Inactive', lastLogin: '10 May 2024, 11:10 AM' }
];

const INITIAL_ROLES: Role[] = [
  { name: 'Zone Admin', description: 'Full access to all zone operations, users, riders, batteries and reports.', usersCount: 12, lastUpdated: '15 May 2024' },
  { name: 'Operations Manager', description: 'Manage daily operations, assignments, and rider activities.', usersCount: 18, lastUpdated: '12 May 2024' },
  { name: 'Franchise Manager', description: 'Manage franchise onboarding, performance and operations.', usersCount: 9, lastUpdated: '10 May 2024' },
  { name: 'Battery Technician', description: 'Access to battery swap, inventory and maintenance operations.', usersCount: 37, lastUpdated: '08 May 2024' },
  { name: 'Support Executive', description: 'Handle rider support tickets and communication.', usersCount: 22, lastUpdated: '05 May 2024' }
];

export default function UsersPage({ defaultTab = 0 }: { defaultTab?: number } = {}) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<'users' | 'roles'>(defaultTab === 1 ? 'roles' : 'users');
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedZone, setSelectedZone] = useState('All Zones');

  // Filter logic
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.mobile.includes(searchQuery) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = selectedRole === 'All Roles' || u.role === selectedRole;
      const matchesStatus = selectedStatus === 'All Status' || u.status === selectedStatus;
      const matchesZone = selectedZone === 'All Zones' || u.zone.includes(selectedZone);

      return matchesSearch && matchesRole && matchesStatus && matchesZone;
    });
  }, [users, searchQuery, selectedRole, selectedStatus, selectedZone]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRole('All Roles');
    setSelectedStatus('All Status');
    setSelectedZone('All Zones');
  };

  // Avatar helper
  const getAvatarConfig = (id: string, initials: string) => {
    if (id === 'USR-001') return { cls: 'purple', text: initials };
    if (id === 'USR-002') return { cls: 'green', text: initials };
    if (id === 'USR-003') return { cls: 'orange', text: initials };
    if (id === 'USR-004') return { cls: 'blue', text: initials };
    return { cls: 'pink', text: initials };
  };

  // Role style helper
  const getRoleStyleClass = (role: string) => {
    if (role === 'Zone Admin') return 'purple';
    if (role === 'Operations Manager') return 'blue';
    if (role === 'Franchise Manager') return 'orange';
    if (role === 'Battery Technician') return 'teal';
    return 'indigo';
  };

  const handleEditUser = (id: string) => {
    router.push(`/users/add?edit=${id}`);
  };

  const handleViewUser = (id: string) => {
    router.push(`/users/detail?id=${id}`);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm(`Are you sure you want to delete user ${id}?`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleScrollToSection = (section: 'users' | 'roles') => {
    setActiveSection(section);
    const element = document.getElementById(section === 'users' ? 'users-section' : 'roles-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="usr-shell">
        <Sidebar activePath="/users" />
        
        <div className="usr-main">
          
          <TopBar 
            title="Hello, Akash" 
            subtitle="Zone Admin" 
            notificationCount={3}
            showSearch={false}
            hideZone={false}
          />
          
          <div className="usr-body">
            
            {/* Breadcrumb */}
            <div className="usr-bc">
              <a href="#">Settings</a>
              <span className="usr-bc-sep">&gt;</span>
              <a href="#">Users &amp; Roles</a>
              <span className="usr-bc-sep">&gt;</span>
              <span className="usr-bc-cur">Users</span>
            </div>

            {/* Title Section */}
            <div className="usr-title-row">
              <div>
                <h1 className="usr-h1">User &amp; Role Management</h1>
                <p className="usr-sub">Manage platform users and roles, permissions and access</p>
              </div>
            </div>

            {/* KPI Stats cards */}
            <div className="usr-stats-row">
              <div className="usr-stat-card">
                <div className="usr-stat-ic ic-purple">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="usr-stat-info">
                  <span className="usr-stat-lbl">Total Users</span>
                  <span className="usr-stat-val">128</span>
                  <div className="usr-growth up">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
                    <span>12.5% vs last 30 days</span>
                  </div>
                </div>
              </div>

              <div className="usr-stat-card">
                <div className="usr-stat-ic ic-green">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <polyline points="16 11 18 13 22 9" />
                  </svg>
                </div>
                <div className="usr-stat-info">
                  <span className="usr-stat-lbl">Active Users</span>
                  <span className="usr-stat-val">112</span>
                  <div className="usr-growth up">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15"/></svg>
                    <span>10.3% vs last 30 days</span>
                  </div>
                </div>
              </div>

              <div className="usr-stat-card">
                <div className="usr-stat-ic ic-orange">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div className="usr-stat-info">
                  <span className="usr-stat-lbl">Inactive Users</span>
                  <span className="usr-stat-val">16</span>
                  <div className="usr-growth down">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
                    <span>5.6% vs last 30 days</span>
                  </div>
                </div>
              </div>

              <div className="usr-stat-card">
                <div className="usr-stat-ic ic-blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="usr-stat-info">
                  <span className="usr-stat-lbl">Total Roles</span>
                  <span className="usr-stat-val">9</span>
                  <div className="usr-growth neutral">
                    <span>No change vs last 30 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Swi & Actions */}
            <div className="usr-tab-row">
              <div className="usr-tabs">
                <button 
                  className={`usr-tab-btn ${activeSection === 'users' ? 'active' : ''}`}
                  onClick={() => handleScrollToSection('users')}
                >
                  Users
                </button>
                <button 
                  className={`usr-tab-btn ${activeSection === 'roles' ? 'active' : ''}`}
                  onClick={() => handleScrollToSection('roles')}
                >
                  Roles
                </button>
              </div>
              <div>
                <button className="usr-btn-primary" onClick={() => router.push('/users/add')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>Add User</span>
                </button>
              </div>
            </div>

            {/* Users section table */}
            <div id="users-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px', scrollMarginTop: '100px' }}>
              
              {/* Users filters */}
              <div className="usr-filter-card">
                <div className="usr-filter-grid">
                  <div className="usr-search-wrap">
                    <span className="usr-search-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </span>
                    <input 
                      type="text" 
                      placeholder="Search by name, email or mobile" 
                      className="usr-search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select className="usr-select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                    <option value="All Roles">All Roles</option>
                    {roles.map(r => (
                      <option key={r.name} value={r.name}>{r.name}</option>
                    ))}
                  </select>
                  <select className="usr-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                    <option value="All Status">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <select className="usr-select" value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
                    <option value="All Zones">All Zones</option>
                    <option value="Connaught Place Zone">Connaught Place Zone</option>
                    <option value="Multiple Zones">Multiple Zones</option>
                  </select>
                  <div>
                    {(searchQuery || selectedRole !== 'All Roles' || selectedStatus !== 'All Status' || selectedZone !== 'All Zones') && (
                      <button className="usr-reset-btn" onClick={resetFilters}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.56-.56"/></svg>
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Users table */}
              <div className="usr-tcard">
                <table className="usr-dt">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Zone / Scope</th>
                      <th>Mobile / Email</th>
                      <th>Status</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#94A3B8' }}>
                          No users match the active filters.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(u => {
                        const initials = u.name.split(' ').map(n=>n[0]).join('').toUpperCase();
                        const av = getAvatarConfig(u.id, initials);
                        const rCls = getRoleStyleClass(u.role);
                        return (
                          <tr key={u.id}>
                            <td>
                              <div className="usr-profile-cell">
                                <div className={`usr-avatar ${av.cls}`}>{av.text}</div>
                                <div>
                                  <div style={{ fontWeight: '700', color: '#0F172A' }}>{u.name}</div>
                                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1.5px' }}>ID: {u.id}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`role-badge ${rCls}`}>{u.role}</span>
                            </td>
                            <td style={{ fontWeight: '500' }}>{u.zone}</td>
                            <td>
                              <div style={{ fontWeight: '600', color: '#334155' }}>{u.mobile}</div>
                              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2.5px' }}>{u.email}</div>
                            </td>
                            <td>
                              <span className={`usr-badge ${u.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                                {u.status}
                              </span>
                            </td>
                            <td style={{ fontSize: '12.5px', color: '#334155', fontWeight: '500' }}>{u.lastLogin}</td>
                            <td>
                              <div className="usr-act-btn-group">
                                <button className="usr-act-btn" title="View details" onClick={() => handleViewUser(u.id)}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                </button>
                                <button className="usr-act-btn" title="Edit details" onClick={() => handleEditUser(u.id)}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button className="usr-act-btn" title="Delete account" onClick={() => handleDeleteUser(u.id)}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

                {/* Table pagination */}
                <div className="usr-tcard-ft">
                  <div className="usr-tcard-ft-lbl">Showing 1 to {filteredUsers.length} of 128 users</div>
                  <div className="usr-pg">
                    <button className="usr-pgb" disabled>&lt;</button>
                    <button className="usr-pgb cur">1</button>
                    <button className="usr-pgb">2</button>
                    <button className="usr-pgb">3</button>
                    <span style={{ color: '#94A3B8', fontSize: '11px', margin: '0 4px', fontWeight: 'bold' }}>...</span>
                    <button className="usr-pgb">26</button>
                    <button className="usr-pgb">&gt;</button>
                    <button className="usr-pgb">&gt;&gt;</button>
                    <select className="usr-pg-select" defaultValue="5 / page">
                      <option>5 / page</option>
                      <option>10 / page</option>
                      <option>20 / page</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Roles section header */}
            <div id="roles-section" className="usr-roles-hdr" style={{ scrollMarginTop: '100px' }}>
              <h2 className="usr-roles-tit">Roles</h2>
              <button className="usr-btn-primary" onClick={() => alert('Create Custom Role functionality...')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add Role</span>
              </button>
            </div>

            {/* Roles Table card */}
            <div className="usr-tcard" style={{ marginBottom: '40px' }}>
              <table className="usr-dt">
                <thead>
                  <tr>
                    <th>Role Name</th>
                    <th style={{ width: '45%' }}>Description</th>
                    <th>Users</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map(r => (
                    <tr key={r.name}>
                      <td style={{ fontWeight: '700', color: '#0F172A' }}>{r.name}</td>
                      <td style={{ color: '#475569', fontWeight: '500' }}>{r.description}</td>
                      <td style={{ fontWeight: '700', color: '#2a195c' }}>{r.usersCount}</td>
                      <td style={{ fontWeight: '500', color: '#334155' }}>{r.lastUpdated}</td>
                      <td>
                        <div className="usr-act-btn-group">
                          <button className="usr-act-btn" title="View details" onClick={() => router.push(`/users/detail?id=USR-002&tab=Permissions`)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          </button>
                          <button className="usr-act-btn" title="Edit details" onClick={() => alert(`Editing permissions for: ${r.name}`)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button className="usr-act-btn" title="Delete role" onClick={() => { if(confirm(`Delete role ${r.name}?`)) setRoles(prev=>prev.filter(x=>x.name!==r.name)) }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Roles table pagination footer */}
              <div className="usr-tcard-ft">
                <div className="usr-tcard-ft-lbl">Showing 1 to {roles.length} of 9 roles</div>
                <div className="usr-pg">
                  <button className="usr-pgb" disabled>&lt;</button>
                  <button className="usr-pgb cur">1</button>
                  <button className="usr-pgb">2</button>
                  <span style={{ color: '#94A3B8', fontSize: '11px', margin: '0 4px', fontWeight: 'bold' }}>...</span>
                  <button className="usr-pgb">&gt;</button>
                  <select className="usr-pg-select" defaultValue="5 / page">
                    <option>5 / page</option>
                    <option>10 / page</option>
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
