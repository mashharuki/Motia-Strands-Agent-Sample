import type { Page } from "../types";

interface TopBarProps {
  currentPage: Page;
  onToggleAI: () => void;
}

const PAGE_TITLES: Record<Page, string> = {
  dashboard: "Dashboard",
  tickets: "Tickets",
  detail: "Ticket Detail",
  create: "New Ticket",
  ai: "AI Assistant",
};

export function TopBar({ currentPage, onToggleAI }: TopBarProps) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="breadcrumb">
          <span>Strands Support</span>
          <span>/</span>
          <span className="breadcrumb-current">{PAGE_TITLES[currentPage]}</span>
        </div>
      </div>
      <div className="topbar-right">
        <button className="topbar-btn" title="Search">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        <button
          className="topbar-btn"
          title="Notifications"
          style={{ position: "relative" }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 6,
              height: 6,
              background: "var(--critical)",
              borderRadius: "50%",
              border: "1.5px solid var(--surface)",
            }}
          />
        </button>
        <button
          className="topbar-btn ai-toggle-btn"
          onClick={onToggleAI}
          title="AI Assistant (⌘K)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93L12 22" />
            <path d="M12 2a4 4 0 0 0-4 4c0 1.95 1.4 3.58 3.25 3.93" />
            <path d="M8.56 13A7.97 7.97 0 0 0 4 20" />
            <path d="M15.44 13A7.97 7.97 0 0 1 20 20" />
          </svg>
        </button>
      </div>
    </div>
  );
}
