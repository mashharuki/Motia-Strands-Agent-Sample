import { useMemo } from 'react';
import type { Ticket } from '../types';

interface DashboardPageProps {
  tickets: Ticket[];
}

export function DashboardPage({ tickets }: DashboardPageProps) {
  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'open').length;
    const critical = tickets.filter(t => t.priority === 'critical' && t.status !== 'closed' && t.status !== 'resolved').length;
    const resolved = tickets.filter(t => t.status === 'resolved').length;
    return { total, open, critical, resolved };
  }, [tickets]);

  const priorityCounts = useMemo(() => {
    const active = tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved');
    return {
      low: active.filter(t => t.priority === 'low').length,
      medium: active.filter(t => t.priority === 'medium').length,
      high: active.filter(t => t.priority === 'high').length,
      critical: active.filter(t => t.priority === 'critical').length,
      total: active.length,
    };
  }, [tickets]);

  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [tickets]);

  const donutData = useMemo(() => {
    const total = priorityCounts.total || 1;
    const circumference = 2 * Math.PI * 54;
    const segments = [
      { count: priorityCounts.low, color: '#2DA44E' },
      { count: priorityCounts.medium, color: '#D4A30E' },
      { count: priorityCounts.high, color: '#E8850C' },
      { count: priorityCounts.critical, color: '#E63B2E' },
    ];
    let offset = 0;
    return segments.map(s => {
      const len = (s.count / total) * circumference;
      const seg = { ...s, dasharray: `${len} ${circumference}`, dashoffset: -offset };
      offset += len;
      return seg;
    });
  }, [priorityCounts]);

  return (
    <div className="page active" style={{ display: 'block' }}>
      <div className="page-title">Dashboard</div>
      <div className="page-subtitle">Support operations overview</div>

      <div className="stats-grid stagger">
        <div className="stat-card">
          <div className="stat-label">Total Tickets</div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-trend" style={{ color: 'var(--label-tertiary)' }}>All time</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Open</div>
          <div className="stat-value">{stats.open}</div>
          <div className="stat-trend" style={{ color: 'var(--label-tertiary)' }}>Awaiting action</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Critical Active</div>
          <div className="stat-value" style={{ color: 'var(--critical)' }}>{stats.critical}</div>
          <div className="stat-trend trend-up">
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 2L10 7H2L6 2Z" fill="currentColor"/></svg>
            Needs attention
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Resolved</div>
          <div className="stat-value" style={{ color: 'var(--low)' }}>{stats.resolved}</div>
          <div className="stat-trend trend-down">
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 10L2 5H10L6 10Z" fill="currentColor"/></svg>
            Completed
          </div>
        </div>
      </div>

      <div className="dashboard-row stagger">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Priority Distribution</div>
          </div>
          <div className="panel-body">
            <div className="donut-container">
              <svg className="donut-svg" width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="14"/>
                {donutData.map((seg, i) => (
                  <circle
                    key={i}
                    cx="70" cy="70" r="54"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="14"
                    strokeDasharray={seg.dasharray}
                    strokeDashoffset={seg.dashoffset}
                    transform="rotate(-90 70 70)"
                    style={{ transition: 'stroke-dasharray 800ms var(--ease-out)' }}
                  />
                ))}
                <text x="70" y="66" textAnchor="middle" fontFamily="Outfit,sans-serif" fontSize="26" fontWeight="700" fill="#1A1A1A">
                  {priorityCounts.total}
                </text>
                <text x="70" y="82" textAnchor="middle" fontFamily="DM Sans,sans-serif" fontSize="11" fill="#71706E">
                  active
                </text>
              </svg>
              <div className="donut-legend">
                <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--low)' }} /><span className="legend-label">Low</span><span className="legend-count">{priorityCounts.low}</span></div>
                <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--medium)' }} /><span className="legend-label">Medium</span><span className="legend-count">{priorityCounts.medium}</span></div>
                <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--high)' }} /><span className="legend-label">High</span><span className="legend-count">{priorityCounts.high}</span></div>
                <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--critical)' }} /><span className="legend-label">Critical</span><span className="legend-count">{priorityCounts.critical}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Recent Activity</div>
          </div>
          <div className="panel-body">
            {recentTickets.length === 0 && (
              <div style={{ color: 'var(--label-tertiary)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                No tickets yet
              </div>
            )}
            {recentTickets.map(t => (
              <div className="activity-item" key={t.ticketId}>
                <div
                  className="activity-dot"
                  style={{ background: priorityColor(t.priority) }}
                />
                <div>
                  <div className="activity-text">
                    <strong>{t.ticketId}</strong> {t.title}
                  </div>
                  <div className="activity-time">{formatRelativeTime(t.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function priorityColor(p: string) {
  switch (p) {
    case 'critical': return 'var(--critical)';
    case 'high': return 'var(--high)';
    case 'medium': return 'var(--medium)';
    case 'low': return 'var(--low)';
    default: return 'var(--label-tertiary)';
  }
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
