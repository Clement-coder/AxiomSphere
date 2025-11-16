export interface User {
  id: string;
  email: string;
  password: string;
  balance: number;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

export interface DeployedAgent {
  id: string;
  agentId: string;
  name: string;
  deployedAt: string;
  status: 'active' | 'paused' | 'stopped';
  config: Record<string, any>;
}

export interface AutomationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
}

export interface MicropaymentLog {
  id: string;
  timestamp: string;
  agentId: string;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
}

// User Management
export const storeUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const deleteUser = () => {
  localStorage.removeItem('user');
};

export const updateUser = (updates: Partial<User>) => {
  const user = getUser();
  if (user) {
    storeUser({ ...user, ...updates });
  }
};

// Agents Management
export const storeAgents = (agents: Agent[]) => {
  localStorage.setItem('agents', JSON.stringify(agents));
};

export const getAgents = (): Agent[] => {
  const agents = localStorage.getItem('agents');
  return agents ? JSON.parse(agents) : [];
};

// Deployed Agents Management
export const storeDeployedAgents = (agents: DeployedAgent[]) => {
  localStorage.setItem('deployedAgents', JSON.stringify(agents));
};

export const getDeployedAgents = (): DeployedAgent[] => {
  const agents = localStorage.getItem('deployedAgents');
  return agents ? JSON.parse(agents) : [];
};

export const addDeployedAgent = (agent: DeployedAgent) => {
  const agents = getDeployedAgents();
  storeDeployedAgents([...agents, agent]);
};

export const updateDeployedAgent = (id: string, updates: Partial<DeployedAgent>) => {
  const agents = getDeployedAgents();
  storeDeployedAgents(
    agents.map(a => a.id === id ? { ...a, ...updates } : a)
  );
};

export const deleteDeployedAgent = (id: string) => {
  const agents = getDeployedAgents();
  storeDeployedAgents(agents.filter(a => a.id !== id));
};

// Automation Rules Management
export const storeRules = (rules: AutomationRule[]) => {
  localStorage.setItem('rules', JSON.stringify(rules));
};

export const getRules = (): AutomationRule[] => {
  const rules = localStorage.getItem('rules');
  return rules ? JSON.parse(rules) : [];
};

export const addRule = (rule: AutomationRule) => {
  const rules = getRules();
  storeRules([...rules, rule]);
};

export const updateRule = (id: string, updates: Partial<AutomationRule>) => {
  const rules = getRules();
  storeRules(
    rules.map(r => r.id === id ? { ...r, ...updates } : r)
  );
};

export const deleteRule = (id: string) => {
  const rules = getRules();
  storeRules(rules.filter(r => r.id !== id));
};

// Micropayment Logs Management
export const storeLogs = (logs: MicropaymentLog[]) => {
  localStorage.setItem('logs', JSON.stringify(logs));
};

export const getLogs = (): MicropaymentLog[] => {
  const logs = localStorage.getItem('logs');
  return logs ? JSON.parse(logs) : [];
};

export const addLog = (log: MicropaymentLog) => {
  const logs = getLogs();
  storeLogs([...logs, log]);
};

export const clearLogs = () => {
  localStorage.removeItem('logs');
};

// Initialize default agents
export const initializeDefaultAgents = () => {
  if (getAgents().length === 0) {
    storeAgents([
      {
        id: '1',
        name: 'Trading Bot',
        description: 'Autonomous trading agent with ML-powered strategies',
        price: 49.99,
        icon: '📈',
      },
      {
        id: '2',
        name: 'Data Analyst',
        description: 'Real-time data analysis and insights generation',
        price: 39.99,
        icon: '📊',
      },
      {
        id: '3',
        name: 'Security Guard',
        description: 'Network monitoring and threat detection agent',
        price: 59.99,
        icon: '🔐',
      },
      {
        id: '4',
        name: 'Validator',
        description: 'Smart contract validation and optimization',
        price: 29.99,
        icon: '✓',
      },
      {
        id: '5',
        name: 'Market Watcher',
        description: 'Real-time market sentiment and trend analysis',
        price: 44.99,
        icon: '👁️',
      },
      {
        id: '6',
        name: 'Protocol Manager',
        description: 'Automated protocol deployment and management',
        price: 79.99,
        icon: '⚙️',
      },
    ]);
  }
};
