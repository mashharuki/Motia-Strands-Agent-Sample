import { useState } from 'react';
import { showToast } from '../components/Toast';
import { api } from '../lib/api';
import type { Page, Ticket } from '../types';

interface TicketDetailPageProps {
  ticket: Ticket | undefined;
  onNavigate: (page: Page) => void;
  onToggleAI: (ticketId: string) => void;
  onRefresh: () => void;
}

export function TicketDetailPage({ ticket, onNavigate, onToggleAI, onRefresh }: TicketDetailPageProps) {
  const [triageAssignee, setTriageAssignee] = useState('support-jp-team');
  const [triagePriority, setTriagePriority] = useState('critical');
  const [escalateReason, setEscalateReason] = useState('');
  const [triageLoading, setTriageLoading] = useState(false);
  const [escalateLoading, setEscalateLoading] = useState(false);

  if (!ticket) {
    return (
      <div className="page active" style={{ display: 'block' }}>
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--label-tertiary)' }}>
          <div style={{ fontSize: 18, marginBottom: 8 }}>Ticket not found</div>
          <button className="btn-primary" style={{ width: 'auto', padding: '0 24px' }} onClick={() => onNavigate('tickets')}>
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  const handleTriage = async () => {
    setTriageLoading(true);
    try {
      await api.triageTicket({
        ticketId: ticket.ticketId,
        assignee: triageAssignee,
        priority: triagePriority,
      });
      showToast(`Ticket ${ticket.ticketId} triaged successfully`, 'success');
      onRefresh();
    } catch (err) {
      showToast(`Triage failed: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    } finally {
      setTriageLoading(false);
    }
  };

  const handleEscalate = async () => {
    if (!escalateReason.trim()) return;
    setEscalateLoading(true);
    try {
      await api.escalateTicket({
        ticketId: ticket.ticketId,
        reason: escalateReason.trim(),
      });
      showToast(`Ticket ${ticket.ticketId} escalated`, 'success');
      setEscalateReason('');
      onRefresh();
    } catch (err) {
      showToast(`Escalation failed: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    } finally {
      setEscalateLoading(false);
    }
  };

  return (
    <div className="page active" style={{ display: 'block' }}>
      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-card">
            <div className="detail-header">
              <div className="detail-breadcrumb">
                <button onClick={() => onNavigate('tickets')} style={{ cursor: 'pointer', color: 'var(--accent)' }}>
                  Tickets
                </button>
                {' / '}
                <span>{ticket.ticketId}</span>
              </div>
              <div className="detail-id-row">
                <span className="detail-id">{ticket.ticketId}</span>
                <span className={`status-badge badge-${statusClass(ticket.status)}`}>
                  {statusLabel(ticket.status)}
                </span>
                <span className="priority-indicator" style={{ marginLeft: 4 }}>
                  <div className={`priority-dot dot-${ticket.priority}`} />
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </span>
              </div>
              <h1 className="detail-title">{ticket.title}</h1>
              <div className="detail-meta">
                <div className="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                  Created {formatRelativeTime(ticket.createdAt)}
                </div>
                <div className="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  {ticket.customerEmail}
                </div>
              </div>
            </div>

            <div className="detail-description">
              <h3>Description</h3>
              <p>{ticket.description}</p>
            </div>

            <div className="timeline">
              <h3>Activity</h3>
              <div className="timeline-list">
                {ticket.escalation && (
                  <div className="timeline-item">
                    <div className="timeline-dot" style={{ background: 'var(--status-escalated)' }} />
                    <span className="timeline-actor">System</span>
                    <span className="timeline-action"> &mdash; escalated: {ticket.escalation.reason}</span>
                    <div className="timeline-time">{formatRelativeTime(ticket.escalation.escalatedAt)}</div>
                  </div>
                )}
                {ticket.triageResult && (
                  <div className="timeline-item">
                    <div className="timeline-dot" style={{ background: 'var(--accent)' }} />
                    <span className="timeline-actor">Auto-triage</span>
                    <span className="timeline-action">
                      {' '}&mdash; assigned to {ticket.triageResult.assignee}, priority set to {ticket.triageResult.priority}
                    </span>
                    <div className="timeline-time">
                      {ticket.triageResult.reasoning}
                    </div>
                  </div>
                )}
                <div className="timeline-item">
                  <div className="timeline-dot" style={{ background: 'var(--status-open)' }} />
                  <span className="timeline-actor">System</span>
                  <span className="timeline-action"> &mdash; ticket created</span>
                  <div className="timeline-time">{formatRelativeTime(ticket.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="action-card">
            <h3>Ticket Info</h3>
            <div className="info-list">
              <div className="info-row">
                <span className="info-label">Status</span>
                <span className={`status-badge badge-${statusClass(ticket.status)}`} style={{ height: 22, fontSize: 10 }}>
                  {statusLabel(ticket.status)}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Priority</span>
                <span className="info-value" style={{ color: priorityColor(ticket.priority) }}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Assignee</span>
                <span className="info-value">{ticket.assignee || 'Unassigned'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Customer</span>
                <span className="info-value" style={{ fontSize: 12 }}>{ticket.customerEmail}</span>
              </div>
            </div>
          </div>

          <div className="action-card">
            <h3>Triage</h3>
            <div className="form-group">
              <label className="form-label">Assignee</label>
              <select
                className="form-input"
                value={triageAssignee}
                onChange={e => setTriageAssignee(e.target.value)}
              >
                <option value="support-jp-team">support-jp-team</option>
                <option value="senior-support">senior-support</option>
                <option value="support-pool">support-pool</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-input"
                value={triagePriority}
                onChange={e => setTriagePriority(e.target.value)}
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <button
              className="btn-primary"
              onClick={handleTriage}
              disabled={triageLoading}
            >
              {triageLoading ? 'Processing...' : 'Update Triage'}
            </button>
          </div>

          <div className="action-card">
            <h3>Escalate</h3>
            <div className="form-group">
              <label className="form-label">Reason</label>
              <textarea
                className="form-textarea"
                placeholder="Describe the escalation reason..."
                value={escalateReason}
                onChange={e => setEscalateReason(e.target.value)}
              />
            </div>
            <button
              className="btn-secondary"
              onClick={handleEscalate}
              disabled={escalateLoading || !escalateReason.trim()}
            >
              {escalateLoading ? 'Processing...' : 'Escalate to Engineering'}
            </button>
          </div>

          <button
            className="btn-primary"
            style={{ width: '100%', background: 'linear-gradient(135deg,#0969DA,#6E40C9)' }}
            onClick={() => onToggleAI(ticket.ticketId)}
          >
            Ask AI about this ticket
          </button>
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

function priorityColor(p: string) {
  switch (p) {
    case 'critical': return 'var(--critical)';
    case 'high': return 'var(--high)';
    case 'medium': return 'var(--medium)';
    case 'low': return 'var(--low)';
    default: return 'var(--label-primary)';
  }
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
