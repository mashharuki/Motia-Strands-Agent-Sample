import { useState } from 'react';
import { showToast } from '../components/Toast';
import { api } from '../lib/api';
import type { Page } from '../types';

interface CreateTicketPageProps {
  onNavigate: (page: Page) => void;
  onRefresh: () => void;
}

export function CreateTicketPage({ onNavigate, onRefresh }: CreateTicketPageProps) {
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!email.trim()) e.email = 'Email is required';
    if (!description.trim()) e.description = 'Description is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.createTicket({
        title: title.trim(),
        description: description.trim(),
        priority,
        customerEmail: email.trim(),
      });
      showToast('Ticket created successfully', 'success');
      onRefresh();
      onNavigate('tickets');
    } catch (err) {
      showToast(`Failed to create ticket: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const priorities = ['low', 'medium', 'high', 'critical'] as const;

  return (
    <div className="page active" style={{ display: 'block' }}>
      <div className="create-container">
        <div className="create-card">
          <h2>Create New Ticket</h2>
          <p className="subtitle">Fill in the details below to submit a support ticket</p>

          <div className="create-form">
            <div className="form-group">
              <label className="form-label">
                Title <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                type="text"
                placeholder="Brief summary of the issue"
                value={title}
                onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: '' })); }}
              />
              {errors.title && <div className="field-error">{errors.title}</div>}
            </div>

            <div className="field-row">
              <div className="form-group">
                <label className="form-label">
                  Customer Email <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <input
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  type="email"
                  placeholder="customer@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>
              <div className="form-group">
                <label className="form-label">
                  Priority <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <div className="priority-selector">
                  {priorities.map(p => (
                    <button
                      key={p}
                      type="button"
                      className={`priority-card ${priority === p ? `selected sel-${p}` : ''}`}
                      onClick={() => setPriority(p)}
                    >
                      <div className="p-check">
                        <svg width="8" height="8" viewBox="0 0 8 8">
                          <path d="M1 4L3 6L7 2" stroke="#fff" strokeWidth="1.5" fill="none"/>
                        </svg>
                      </div>
                      <div className="p-dot" style={{ background: `var(--${p})` }} />
                      <div className="p-label">{p.charAt(0).toUpperCase() + p.slice(1)}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Description <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <textarea
                className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                style={{ minHeight: 140 }}
                placeholder="Describe the issue in detail. Include steps to reproduce, expected behavior, and any error messages..."
                value={description}
                onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: '' })); }}
              />
              {errors.description && <div className="field-error">{errors.description}</div>}
              <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--label-tertiary)', marginTop: 4 }}>
                {description.length} / 2000
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-cancel" onClick={() => onNavigate('tickets')}>Cancel</button>
              <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Creating...' : 'Create Ticket'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
