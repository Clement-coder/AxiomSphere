'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getDeployedAgents, getLogs } from '@/lib/storage';


export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [deployedAgents, setDeployedAgents] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/');
      return;
    }
    setUser(currentUser);
    setDeployedAgents(getDeployedAgents());
    setRecentLogs(getLogs().slice(-5).reverse());
  }, [router]);

  if (!user) return null;

  return (
    
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Monitor your autonomous agents and execution status</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass border-glow rounded-lg p-6 glow">
            <div className="text-sm text-muted-foreground mb-2">Account Balance</div>
            <div className="text-2xl font-bold text-primary">${user.balance.toFixed(2)}</div>
          </div>
          <div className="glass border-glow rounded-lg p-6 glow">
            <div className="text-sm text-muted-foreground mb-2">Active Agents</div>
            <div className="text-2xl font-bold text-accent">{deployedAgents.filter(a => a.status === 'active').length}</div>
          </div>
          <div className="glass border-glow rounded-lg p-6 glow">
            <div className="text-sm text-muted-foreground mb-2">Total Transactions</div>
            <div className="text-2xl font-bold text-primary">{recentLogs.length}</div>
          </div>
          <div className="glass border-glow rounded-lg p-6 glow">
            <div className="text-sm text-muted-foreground mb-2">Session Status</div>
            <div className="text-sm font-medium">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Active Agents */}
        <div>
          <h2 className="text-xl font-bold mb-4">Active Agents</h2>
          {deployedAgents.length === 0 ? (
            <div className="glass border-glow rounded-lg p-8 text-center">
              <p className="text-muted-foreground">No agents deployed yet</p>
              <a href="/marketplace" className="inline-block mt-4 px-4 py-2 bg-primary/20 border border-primary/50 rounded text-sm font-medium text-primary hover:bg-primary/30 transition-colors">
                Browse Marketplace
              </a>
            </div>
          ) : (
            <div className="grid gap-4">
              {deployedAgents.map(agent => (
                <div key={agent.id} className="glass border-glow rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{agent.icon}</span>
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-xs text-muted-foreground">Deployed {new Date(agent.deployedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      agent.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
          {recentLogs.length === 0 ? (
            <div className="glass border-glow rounded-lg p-8 text-center text-muted-foreground">
              No transactions yet
            </div>
          ) : (
            <div className="glass border-glow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="px-4 py-3 text-left font-semibold">Time</th>
                      <th className="px-4 py-3 text-left font-semibold">Amount</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map(log => (
                      <tr key={log.id} className="border-b border-border/50 hover:bg-primary/10 transition-colors">
                        <td className="px-4 py-3">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        <td className="px-4 py-3 text-primary">${log.amount.toFixed(4)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded ${
                            log.status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{log.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    
  );
}
