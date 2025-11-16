'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getLogs, addLog, clearLogs } from '@/lib/storage';

import { ModalBase } from '@/components/modal-base';
import { AlertBox } from '@/components/alert-box';
import { ButtonWithIcon } from '@/components/button-with-icon';
import { Eraser, Eye, CheckCircle, AlertCircle, TrendingUp, Clock, DollarSign, FileText, Filter, Bot } from 'lucide-react';

export default function MonitoringPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [alert, setAlert] = useState<{
    show: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/');
      return;
    }
    setUser(currentUser);
    const allLogs = getLogs();
    setLogs(allLogs);
    applyFilter(allLogs, 'all');
  }, [router]);

  const applyFilter = (logsToFilter: any[], filterType: string) => {
    if (filterType === 'completed') {
      setFilteredLogs(logsToFilter.filter(l => l.status === 'completed'));
    } else if (filterType === 'pending') {
      setFilteredLogs(logsToFilter.filter(l => l.status === 'pending'));
    } else {
      setFilteredLogs(logsToFilter);
    }
  };

  const handleFilterChange = (f: string) => {
    setFilter(f);
    applyFilter(logs, f);
  };

  const handleClearLogs = () => {
    clearLogs();
    setLogs([]);
    setFilteredLogs([]);
    setAlert({
      show: true,
      type: 'success',
      title: 'All Logs Cleared',
      message: 'All transaction logs have been permanently removed from your account.',
    });
    setShowConfirmClear(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ['pending', 'completed'] as const;
      const newLog = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        agentId: String(Math.floor(Math.random() * 6) + 1),
        amount: Number((Math.random() * 0.01).toFixed(4)),
        description: 'USDC Micropayment Transfer',
        status: statuses[Math.floor(Math.random() * statuses.length)],
      };
      addLog(newLog);
      setLogs(prev => [newLog, ...prev]);
      setFilteredLogs(prev => {
        if (filter === 'all' || filter === newLog.status) {
          return [newLog, ...prev];
        }
        return prev;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [filter]);

  if (!user) return null;

  const totalValue = logs.reduce((sum, log) => sum + log.amount, 0);
  const completedCount = logs.filter(l => l.status === 'completed').length;

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">USDC Micropayment Monitoring</h1>
          <p className="text-muted-foreground">
            Track all autonomous agent transactions and USDC micropayments triggered by your automation rules
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass border-glow rounded-lg p-6 glow">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-primary" />
              <span className="text-sm text-muted-foreground">Total Value Transferred</span>
            </div>
            <div className="text-2xl font-bold text-primary">${totalValue.toFixed(4)} USDC</div>
          </div>
          <div className="glass border-glow rounded-lg p-6 glow">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-accent" />
              <span className="text-sm text-muted-foreground">Total Transactions</span>
            </div>
            <div className="text-2xl font-bold text-accent">{logs.length}</div>
          </div>
          <div className="glass border-glow rounded-lg p-6 glow">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{completedCount}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2 items-center">
            <Filter size={16} className="text-muted-foreground" />
            {['all', 'pending', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => handleFilterChange(f)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-primary/20 border border-primary/50 text-primary'
                    : 'bg-muted/20 border border-muted/50 hover:bg-muted/30'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <ButtonWithIcon
            icon={Eraser}
            label="Clear All Logs"
            onClick={() => setShowConfirmClear(true)}
            variant="danger"
            disabled={logs.length === 0}
          />
        </div>

        {/* Logs Table */}
        <div className="glass border-glow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border/50">
              <thead className="bg-muted/20">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Clock size={14} /> <span>Timestamp</span>
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Bot size={14} /> <span>Agent</span>
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} /> <span>Amount (USDC)</span>
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} /> <span>Status</span>
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <FileText size={14} /> <span>Description</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      <AlertCircle size={20} className="mx-auto mb-2 opacity-50" />
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-primary/10 transition-colors">
                      <td className="px-4 py-3 text-xs whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono text-xs text-primary whitespace-nowrap">Agent #{log.agentId}</td>
                      <td className="px-4 py-3 text-primary font-semibold whitespace-nowrap">${log.amount.toFixed(4)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1 ${
                            log.status === 'completed'
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}
                        >
                          {log.status === 'completed' ? (
                            <>
                              <CheckCircle size={12} /> Completed
                            </>
                          ) : (
                            <>
                              <AlertCircle size={12} /> Pending
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{log.description}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ModalBase
        isOpen={showConfirmClear}
        title="Clear All Transaction Logs?"
        description="This will permanently delete all USDC micropayment logs from your account. This action cannot be undone. Your agent deployment history will be preserved."
        icon={Eraser}
        confirmLabel="Clear Logs"
        cancelLabel="Cancel"
        isDangerous
        onConfirm={handleClearLogs}
        onCancel={() => setShowConfirmClear(false)}
      />

      {alert.show && (
        <AlertBox
          title={alert.title}
          description={alert.message}
          type={alert.type}
          icon={alert.type === 'success' ? CheckCircle : AlertCircle}
          onDismiss={() => setAlert({ ...alert, show: false })}
        />
      )}
    </>
  );
}
