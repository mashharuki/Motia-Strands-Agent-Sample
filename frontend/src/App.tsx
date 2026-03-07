import { useCallback, useEffect, useState } from 'react';
import { AIPanel } from './components/AIPanel';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/Toast';
import { TopBar } from './components/TopBar';
import './css/App.css';
import { api } from './lib/api';
import { AIPage } from './pages/AIPage';
import { CreateTicketPage } from './pages/CreateTicketPage';
import { DashboardPage } from './pages/DashboardPage';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { TicketListPage } from './pages/TicketListPage';
import type { Page, Ticket } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | undefined>();
  const [aiOpen, setAiOpen] = useState(false);
  const [aiContextTicketId, setAiContextTicketId] = useState<string | undefined>();

  const fetchTickets = useCallback(async () => {
    try {
      const data = await api.getTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch {
      // API may not be running yet
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleNavigate = useCallback((page: Page, ticketId?: string) => {
    setCurrentPage(page);
    if (ticketId) setSelectedTicketId(ticketId);
  }, []);

  const toggleAI = useCallback(() => {
    setAiOpen(prev => !prev);
  }, []);

  const openAIWithContext = useCallback((ticketId: string) => {
    setAiContextTicketId(ticketId);
    setAiOpen(true);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && aiOpen) setAiOpen(false);
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setAiOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [aiOpen]);

  const selectedTicket = tickets.find(t => t.ticketId === selectedTicketId);
  const openTicketCount = tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length;

  return (
    <div className="app">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onToggleAI={toggleAI}
        ticketCount={openTicketCount}
      />
      <div className="main">
        <TopBar currentPage={currentPage} onToggleAI={toggleAI} />
        <div className="page-content">
          {currentPage === 'dashboard' && <DashboardPage tickets={tickets} />}
          {currentPage === 'tickets' && <TicketListPage tickets={tickets} onNavigate={handleNavigate} />}
          {currentPage === 'detail' && (
            <TicketDetailPage
              ticket={selectedTicket}
              onNavigate={handleNavigate}
              onToggleAI={openAIWithContext}
              onRefresh={fetchTickets}
            />
          )}
          {currentPage === 'create' && (
            <CreateTicketPage onNavigate={handleNavigate} onRefresh={fetchTickets} />
          )}
          {currentPage === 'ai' && <AIPage onToggleAI={toggleAI} />}
        </div>
      </div>

      <AIPanel
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        contextTicketId={aiContextTicketId}
      />
      <ToastContainer />
    </div>
  );
}

export default App;
