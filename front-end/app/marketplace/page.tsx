'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getAgents, getDeployedAgents, addDeployedAgent, updateUser } from '@/lib/storage';

import { ModalBase } from '@/components/modal-base';
import { AlertBox } from '@/components/alert-box';
import { ButtonWithIcon } from '@/components/button-with-icon';
import { Rocket, AlertCircle, CheckCircle } from 'lucide-react';

export default function MarketplacePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [deployed, setDeployed] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
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
    setAgents(getAgents());
    setDeployed(getDeployedAgents().map(a => a.agentId));
  }, [router]);

  const handleDeploy = (agent: any) => {
    if (user.balance < agent.price) {
      setAlert({
        show: true,
        type: 'error',
        title: 'Insufficient USDC Balance',
        message: `You need $${agent.price.toFixed(2)} USDC to deploy this agent. Current balance: $${user.balance.toFixed(2)}.`,
      });
      return;
    }
    setSelectedAgent(agent);
    setShowConfirmation(true);
  };

  const confirmDeploy = () => {
    if (!selectedAgent) return;

    const newAgent = {
      id: Math.random().toString(36).substr(2, 9),
      agentId: selectedAgent.id,
      name: selectedAgent.name,
      deployedAt: new Date().toISOString(),
      status: 'active' as const,
      config: {},
    };

    addDeployedAgent(newAgent);
    const updatedUser = { ...user, balance: user.balance - selectedAgent.price };
    updateUser(updatedUser);
    setUser(updatedUser);
    setDeployed([...deployed, selectedAgent.id]);

    setAlert({
      show: true,
      type: 'success',
      title: 'Agent Successfully Deployed',
      message: `${selectedAgent.name} is now running with autonomous execution enabled. Session key initialized.`,
    });

    setShowConfirmation(false);
    setSelectedAgent(null);
  };

  if (!user) return null;

  const agent = selectedAgent;

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Agent Marketplace</h1>
          <p className="text-muted-foreground">
            Deploy autonomous agents that can execute tasks using session keys and USDC micropayments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <div
              key={agent.id}
              className="glass border-glow rounded-lg p-6 glow hover:border-primary/60 transition-all duration-300 hover:scale-105 group flex flex-col h-full"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{agent.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">{agent.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="text-primary font-bold">{agent.price.toFixed(2)} USDC</span>
                {deployed.includes(agent.id) ? (
                  <span className="px-3 py-1.5 text-xs font-medium bg-green-500/20 border border-green-500/50 text-green-300 rounded">
                    Active
                  </span>
                ) : (
                  <ButtonWithIcon
                    icon={Rocket}
                    label="Deploy"
                    onClick={() => handleDeploy(agent)}
                    size="sm"
                    variant={user.balance >= agent.price ? 'primary' : 'muted'}
                    disabled={user.balance < agent.price}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalBase
        isOpen={showConfirmation}
        title="Deploy Agent?"
        description={`You are about to deploy ${agent?.name} for ${agent?.price.toFixed(2)} USDC. This will initialize a session key for autonomous execution.`}
        icon={Rocket}
        confirmLabel="Deploy Agent"
        cancelLabel="Cancel"
        onConfirm={confirmDeploy}
        onCancel={() => setShowConfirmation(false)}
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
