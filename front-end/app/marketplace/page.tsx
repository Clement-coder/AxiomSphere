'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getAgents, getDeployedAgents, addDeployedAgent, removeDeployedAgent, updateUser } from '@/lib/storage';

import { ModalBase } from '@/components/modal-base';
import { AlertBox } from '@/components/alert-box';
import { ButtonWithIcon } from '@/components/button-with-icon';
import { Rocket, AlertCircle, CheckCircle, Bot, TrendingUp, DollarSign, Shield, Zap, Code, Settings, MinusCircle } from 'lucide-react';

const agentIcons: { [key: string]: JSX.Element } = {
  'trading-bot': <TrendingUp className="h-12 w-12 text-blue-400" />,
  'defi-strategist': <DollarSign className="h-12 w-12 text-green-400" />,
  'security-auditor': <Shield className="h-12 w-12 text-red-400" />,
  'data-analyst': <Zap className="h-12 w-12 text-purple-400" />,
  'custom-agent': <Code className="h-12 w-12 text-yellow-400" />,
  'default': <Bot className="h-12 w-12 text-gray-400" />,
};

export default function MarketplacePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [deployed, setDeployed] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [showDeployConfirmation, setShowDeployConfirmation] = useState(false);
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
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
    setDeployed(getDeployedAgents());
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
    setShowDeployConfirmation(true);
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
      price: selectedAgent.price, // Store price for withdrawal
    };

    addDeployedAgent(newAgent);
    const updatedUser = { ...user, balance: user.balance - selectedAgent.price };
    updateUser(updatedUser);
    setUser(updatedUser);
    setDeployed([...deployed, newAgent]);

    setAlert({
      show: true,
      type: 'success',
      title: 'Agent Successfully Deployed',
      message: `${selectedAgent.name} is now running with autonomous execution enabled. Session key initialized.`,
    });

    setShowDeployConfirmation(false);
    setSelectedAgent(null);
  };

  const handleWithdraw = (agent: any) => {
    setSelectedAgent(agent);
    setShowWithdrawConfirmation(true);
  };

  const confirmWithdraw = () => {
    if (!selectedAgent) return;

    deleteDeployedAgent(selectedAgent.id);
    const updatedUser = { ...user, balance: user.balance + selectedAgent.price }; // Refund
    updateUser(updatedUser);
    setUser(updatedUser);
    setDeployed(deployed.filter(a => a.id !== selectedAgent.id));

    setAlert({
      show: true,
      type: 'success',
      title: 'Agent Withdrawn',
      message: `${selectedAgent.name} has been successfully withdrawn. $${selectedAgent.price.toFixed(2)} USDC refunded.`,
    });

    setShowWithdrawConfirmation(false);
    setSelectedAgent(null);
  };

  if (!user) return null;

  const agent = selectedAgent; // For modal context

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
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {agentIcons[agent.type] || agentIcons['default']}
              </div>
              <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 flex-grow">{agent.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="text-primary font-bold">{agent.price.toFixed(2)} USDC</span>
                {deployed.some(a => a.agentId === agent.id) ? (
                  <ButtonWithIcon
                    icon={MinusCircle}
                    label="Withdraw"
                    onClick={() => handleWithdraw(deployed.find(a => a.agentId === agent.id))}
                    size="sm"
                    variant="destructive"
                  />
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
        isOpen={showDeployConfirmation}
        title="Deploy Agent?"
        description={`You are about to deploy ${agent?.name || 'this agent'} for ${agent?.price ? agent.price.toFixed(2) : 'N/A'} USDC. This will initialize a session key for autonomous execution.`}
        icon={Rocket}
        confirmLabel="Deploy Agent"
        cancelLabel="Cancel"
        onConfirm={confirmDeploy}
        onCancel={() => setShowDeployConfirmation(false)}
      />

      <ModalBase
        isOpen={showWithdrawConfirmation}
        title="Withdraw Agent?"
        description={`Are you sure you want to withdraw ${agent?.name || 'this agent'}? You will be refunded $${agent?.price ? agent.price.toFixed(2) : 'N/A'} USDC.`}
        icon={MinusCircle}
        confirmLabel="Withdraw Agent"
        cancelLabel="Cancel"
        onConfirm={confirmWithdraw}
        onCancel={() => setShowWithdrawConfirmation(false)}
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
