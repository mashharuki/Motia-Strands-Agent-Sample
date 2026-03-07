import { useState, useMemo } from 'react';
import type { Ticket, Page } from '../types';

interface TicketListPageProps {
  tickets: Ticket[];
  onNavigate: (page: Page, ticketId?: string) => void;
}

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 } as const;

export function TicketListPage({ tickets, onNavigate }: TicketListPageProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    let list = [...tickets];
    if (filter !== 'all') {
      list = list.filter(t => t.priority === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.ticketId.toLowerCase().includes(q) ||
        t.customerEmail.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    return list;
  }, [tickets, filter, search]);

  return (
    <div className="page active" style={{ display: 'block' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div className="page-title">Tickets</div>
        <button
          className="btn-submit"
          style={{ minWidth: 'auto', padding: '0 20px', height: 36, fontSize: 12 }}
          onClick={() => onNavigate('create')}
        >
          + New Ticket
        </button>
      </div>
      <div className="page-subtitle">{filtered.length} tickets across all priorities</div>

      <div className="filter-bar">
        <div className="search-input">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-sep" />
        <div className="pill-group">
          {['all', 'critical', 'high', 'medium', 'low'].map(f => (
            <button
              key={f}
              className={`pill ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="ticket-table">
        <div className="table-header">
          <span>Priority</span>
          <span>ID</span>
          <span>Title</span>
          <span>Customer</span>
          <span>Status</span>
          <span>Assignee</span>
          <span></span>
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--label-tertiary)', fontSize: 14 }}>
            No tickets found
          </div>
        )}

        {filtered.map(ticket => (
          <div
            key={ticket.ticketId}
            className={`table-row ${ticket.priority === 'critical' ? 'critical-row' : ''}`}
            onClick={() => onNavigate('detail', ticket.ticketId)}
          >
            <div className="priority-indicator">
              <div className={`priority-dot dot-${ticket.priority}`} />
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </div>
            <div className="ticket-id">{ticket.ticketId}</div>
            <div className="ticket-title-cell">{ticket.title}</div>
            <div className="ticket-email">{ticket.customerEmail}</div>
            <span className={`status-badge badge-${statusClass(ticket.status)}`}>
              {statusLabel(ticket.status)}
            </span>
            <div className="assignee-cell">
              <div className="assignee-avatar">
                {ticket.assignee ? initials(ticket.assignee) : '--'}
              </div>
              <span style={ticket.assignee ? undefined : { color: 'var(--label-tertiary)' }}>
                {ticket.assignee || 'Unassigned'}
              </span>
            </div>
            <div className="row-actions">
              <button onClick={e => { e.stopPropagation(); }}>&middot;&middot;&middot;</button>
            </div>
          </div>
        ))}

        <div className="table-footer">
          <span>Showing {filtered.length} ticket{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}

function statusClass(s: string) {
  switch (s) {
    case 'open': return 'open';
    case 'in-progress': return 'progress';
    case 'resolved': return 'resolved';
    case 'closed': return 'closed';
    case 'escalated': return 'escalated';
    default: return 'open';
  }
}

function statusLabel(s: string) {
  switch (s) {
    case 'open': return 'Open';
    case 'in-progress': return 'In Progress';
    case 'resolved': return 'Resolved';
    case 'closed': return 'Closed';
    case 'escalated': return 'Escalated';
    default: return s;
  }
}

function initials(name: string) {
  return name
    .split(/[-\s]/)
    .map(w => w[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);
}
