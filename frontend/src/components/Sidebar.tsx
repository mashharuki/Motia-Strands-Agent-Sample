import type { Page } from "../types";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onToggleAI: () => void;
  ticketCount: number;
}

export function Sidebar({
  currentPage,
  onNavigate,
  onToggleAI,
  ticketCount,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">S</div>
        <div>
          <div className="sidebar-title">Strands</div>
          <div className="sidebar-subtitle">Support Operations</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Overview</div>
        <button
          className={`nav-item ${currentPage === "dashboard" ? "active" : ""}`}
          onClick={() => onNavigate("dashboard")}
        >
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
          Dashboard
        </button>

        <div className="nav-section-label">Management</div>
        <button
          className={`nav-item ${currentPage === "tickets" ? "active" : ""}`}
          onClick={() => onNavigate("tickets")}
        >
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Tickets
          {ticketCount > 0 && <span className="nav-badge">{ticketCount}</span>}
        </button>
        <button
          className={`nav-item ${currentPage === "create" ? "active" : ""}`}
          onClick={() => onNavigate("create")}
        >
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          New Ticket
        </button>

        <div className="nav-section-label">Intelligence</div>
        <button
          className={`nav-item ${currentPage === "ai" ? "active" : ""}`}
          onClick={() => {
            onNavigate("ai");
            onToggleAI();
          }}
        >
          <svg
            className="nav-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a4 4 0 0 1 4 4c0 1.95-1.4 3.58-3.25 3.93L12 22" />
            <path d="M12 2a4 4 0 0 0-4 4c0 1.95 1.4 3.58 3.25 3.93" />
            <path d="M8.56 13A7.97 7.97 0 0 0 4 20" />
            <path d="M15.44 13A7.97 7.97 0 0 1 20 20" />
          </svg>
          AI Assistant
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-avatar">TY</div>
        <div>
          <div className="sidebar-user-name">Takeshi Y.</div>
          <div className="sidebar-user-role">Support Lead</div>
        </div>
      </div>
    </aside>
  );
}
