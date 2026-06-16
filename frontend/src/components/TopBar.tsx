"use client";
import Image from 'next/image';

const CSS = `
.ev-tb{height:68px;background:#fff;border-bottom:1px solid #E5E7EB;display:flex;align-items:center;padding:0 22px;gap:12px;position:sticky;top:0;z-index:90;flex-shrink:0}
.ev-tb-hamburger{width:34px;height:34px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4.5px;cursor:pointer;flex-shrink:0}
.ev-tb-hamburger span{display:block;width:18px;height:2px;background:#6B7280;border-radius:2px}
.ev-tb-user{display:flex;align-items:center;gap:9px}
.ev-tb-av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#6366F1,#8B5CF6);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;overflow:hidden;position:relative}
.ev-tb-av img{width:100%;height:100%;object-fit:cover}
.ev-tb-hello{font-size:13.5px;font-weight:700;color:#111827}
.ev-tb-role{font-size:11px;color:#9CA3AF}
.ev-tb-spacer{flex:1}
.ev-tb-zone{display:flex;align-items:center;gap:6px;padding:6px 12px;border:1px solid #E5E7EB;border-radius:8px;cursor:pointer;background:#fff}
.ev-tb-zone-t{font-size:12.5px;font-weight:500;color:#374151}
.ev-tb-bell{position:relative;width:36px;height:36px;background:#fff;border:1px solid #E5E7EB;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#6B7280;cursor:pointer;flex-shrink:0}
.ev-tb-bell-dot{position:absolute;top:-4px;right:-4px;width:16px;height:16px;background:#EF4444;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:#fff;border:2px solid #fff}
.ev-tb-search-wrap{display:flex;align-items:center;border:1px solid #E5E7EB;border-radius:8px;padding:8px 12px;gap:8px;background:#FFF;width:460px;transition:border-color 0.15s;margin-left:24px}
.ev-tb-search-wrap:focus-within{border-color:#2a195c;box-shadow:0 0 0 1px #2a195c}
.ev-tb-search-inp{border:none;outline:none;font-size:12.5px;color:#1E293B;width:100%;font-family:inherit}
.ev-tb-search-inp::placeholder{color:#94A3B8}
.ev-tb-search-kb{border:1px solid #E2E8F0;border-radius:4px;padding:2px 4px;font-size:9.5px;color:#64748B;font-weight:700;background:#F8FAFC;white-space:nowrap;display:flex;align-items:center;justify-content:center;gap:2px}
.ev-tb-profile{display:flex;align-items:center;gap:10px;padding-left:12px;cursor:pointer}
`;

const IBell = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IPin = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IChevD = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showHand?: boolean;
  hideLeftAvatar?: boolean;
  leftAvatarText?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  notificationCount?: number;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  hideZone?: boolean;
  onToggle?: () => void;
}

export default function TopBar({
  title = "Hello, Akash",
  subtitle = "Zone Admin",
  showHand = true,
  hideLeftAvatar = false,
  leftAvatarText = "AV",
  showSearch = false,
  searchPlaceholder = "Search...",
  notificationCount = 1,
  userName,
  userRole,
  userAvatar,
  hideZone = false,
  onToggle,
}: TopBarProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="ev-tb">
        {/* Hamburger */}
        <div className="ev-tb-hamburger" onClick={() => onToggle?.()}>
          <span />
          <span />
          <span />
        </div>

        {/* User greeting / Page title */}
        <div className="ev-tb-user">
          {!hideLeftAvatar && (
            <div className="ev-tb-av">
              {leftAvatarText}
            </div>
          )}
          <div>
            <div className="ev-tb-hello">
              {title} {showHand && "👋"}
            </div>
            <div className="ev-tb-role">{subtitle}</div>
          </div>
        </div>

        {/* Optional Search Bar */}
        {showSearch && (
          <div className="ev-tb-search-wrap">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="ev-tb-search-inp"
              placeholder={searchPlaceholder}
            />
            <div className="ev-tb-search-kb">
              <span>⌘</span>
              <span>K</span>
            </div>
          </div>
        )}

        <div className="ev-tb-spacer" />

        {/* Zone selector */}
        {!hideZone && (
          <div className="ev-tb-zone">
            <span style={{ color: "#2a195c" }}>
              <IPin />
            </span>
            <span className="ev-tb-zone-t">Connaught Place Zone</span>
            <span style={{ color: "#9CA3AF" }}>
              <IChevD />
            </span>
          </div>
        )}

        {/* Bell */}
        <button className="ev-tb-bell">
          <IBell />
          {notificationCount > 0 && (
            <span className="ev-tb-bell-dot">{notificationCount}</span>
          )}
        </button>

        {/* Optional Right User Profile Slot */}
        {userName && (
          <div className="ev-tb-profile">
            <div className="ev-tb-av" style={{ background: '#F59E0B' }}>
              {userAvatar ? (
                <Image
                  src={userAvatar}
                  alt={userName}
                  width={34}
                  height={34}
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                userName.split(' ').map(n => n[0]).join('')
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="ev-tb-hello" style={{ fontSize: '12.5px', lineHeight: 1.2 }}>{userName}</span>
              <span className="ev-tb-role" style={{ fontSize: '10.5px', marginTop: '1px' }}>{userRole}</span>
            </div>
            <span style={{ color: "#9CA3AF", marginLeft: '4px' }}>
              <IChevD />
            </span>
          </div>
        )}
      </header>
    </>
  );
}
