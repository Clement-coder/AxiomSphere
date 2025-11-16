'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, getRules, addRule, updateRule, deleteRule } from '@/lib/storage';

import { IconInput } from '@/components/icon-input';
import { ModalBase } from '@/components/modal-base';
import { AlertBox } from '@/components/alert-box';
import { ButtonWithIcon } from '@/components/button-with-icon';
import { Plus, Trash2, CheckCircle, AlertCircle, Settings, Zap } from 'lucide-react';
import { validationRules } from '@/lib/validation';

export default function ExecutionPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [rules, setRules] = useState<any[]>([]);
  const [newRule, setNewRule] = useState({ name: '', condition: '', action: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successes, setSuccesses] = useState<Record<string, string>>({});
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
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
    setRules(getRules());
  }, [router]);

  const validateRule = () => {
    const newErrors: Record<string, string> = {};
    const newSuccesses: Record<string, string> = {};

    const nameValidation = validationRules.ruleName.validate(newRule.name);
    if (!nameValidation.valid) {
      newErrors.name = nameValidation.error || '';
    } else {
      newSuccesses.name = 'Rule name valid';
    }

    const conditionValidation = validationRules.ruleCondition.validate(newRule.condition);
    if (!conditionValidation.valid) {
      newErrors.condition = conditionValidation.error || '';
    } else {
      newSuccesses.condition = 'Condition valid';
    }

    const actionValidation = validationRules.ruleAction.validate(newRule.action);
    if (!actionValidation.valid) {
      newErrors.action = actionValidation.error || '';
    } else {
      newSuccesses.action = 'Action valid';
    }

    setErrors(newErrors);
    setSuccesses(newSuccesses);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRule()) return;

    const rule = {
      id: Math.random().toString(36).substr(2, 9),
      ...newRule,
      enabled: true,
    };

    addRule(rule);
    setRules([...rules, rule]);
    setNewRule({ name: '', condition: '', action: '' });
    setErrors({});
    setSuccesses({});
    setAlert({
      show: true,
      type: 'success',
      title: 'Automation Rule Created',
      message: `Rule "${rule.name}" will now execute based on your conditions. Session key execution enabled.`,
    });
  };

  const handleToggleRule = (id: string, enabled: boolean) => {
    updateRule(id, { enabled: !enabled });
    setRules(rules.map(r => (r.id === id ? { ...r, enabled: !enabled } : r)));
  };

  const confirmDelete = () => {
    if (ruleToDelete) {
      deleteRule(ruleToDelete);
      const deletedRule = rules.find(r => r.id === ruleToDelete);
      setRules(rules.filter(r => r.id !== ruleToDelete));
      setAlert({
        show: true,
        type: 'success',
        title: 'Automation Rule Deleted',
        message: `Rule "${deletedRule?.name}" has been permanently removed.`,
      });
    }
    setShowConfirmDelete(false);
    setRuleToDelete(null);
  };

  if (!user) return null;

  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Autonomous Execution</h1>
          <p className="text-muted-foreground">
            Configure automation rules that define how your agents behave and execute actions using session keys
          </p>
        </div>

        {/* Session Key Status */}
        <div className="glass border-glow rounded-lg p-6 glow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1 flex items-center gap-2">
                <Zap size={20} className="text-primary" />
                Session Key Status
              </h3>
              <p className="text-sm text-muted-foreground font-mono">sk_live_...4x2k</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-green-400">Connected & Active</span>
            </div>
          </div>
        </div>

        {/* Create New Rule */}
        <div className="glass border-glow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus size={20} className="text-primary" />
            Create Automation Rule
          </h3>
          <form onSubmit={handleAddRule} className="space-y-4">
            <IconInput
              icon={Settings}
              label="Rule Name"
              placeholder="e.g., High Volume Alert"
              value={newRule.name}
              onChange={(v) => setNewRule({ ...newRule, name: v })}
              error={errors.name}
              success={successes.name}
            />
            <IconInput
              icon={AlertCircle}
              label="Condition"
              placeholder="e.g., price > 50000 OR volume_24h > 1000000"
              value={newRule.condition}
              onChange={(v) => setNewRule({ ...newRule, condition: v })}
              error={errors.condition}
              success={successes.condition}
            />
            <IconInput
              icon={Zap}
              label="Action"
              placeholder="e.g., notify_telegram, execute_trade, or trigger_webhook"
              value={newRule.action}
              onChange={(v) => setNewRule({ ...newRule, action: v })}
              error={errors.action}
              success={successes.action}
            />
            <ButtonWithIcon
              icon={Plus}
              label="Create Rule"
              type="submit"
              fullWidth
            />
          </form>
        </div>

        {/* Rules List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Active Rules ({rules.length})</h3>
          {rules.length === 0 ? (
            <div className="glass border-glow rounded-lg p-8 text-center">
              <AlertCircle size={32} className="text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No automation rules yet. Create one to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map(rule => (
                <div key={rule.id} className="glass border-glow rounded-lg p-4 flex items-center justify-between group hover:border-primary/50 transition-all">
                  <div className="flex items-center gap-4 flex-1">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rule.enabled}
                        onChange={(e) => handleToggleRule(rule.id, rule.enabled)}
                        className="w-5 h-5 rounded bg-input border border-primary/50 cursor-pointer accent-primary"
                      />
                    </label>
                    <div className="flex-1">
                      <h4 className="font-semibold">{rule.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-mono">IF</span> {rule.condition} <span className="font-mono">THEN</span> {rule.action}
                      </p>
                      <span className={`text-xs mt-2 inline-block px-2 py-1 rounded ${
                        rule.enabled
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  <ButtonWithIcon
                    icon={Trash2}
                    label="Delete"
                    onClick={() => {
                      setRuleToDelete(rule.id);
                      setShowConfirmDelete(true);
                    }}
                    variant="danger"
                    size="sm"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ModalBase
        isOpen={showConfirmDelete}
        title="Delete Automation Rule?"
        description="This rule will be permanently removed and can no longer trigger autonomous executions. This action cannot be undone."
        icon={Trash2}
        confirmLabel="Delete Rule"
        cancelLabel="Keep Rule"
        isDangerous
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmDelete(false)}
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
