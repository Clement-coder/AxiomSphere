'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, updateUser, deleteUser } from '@/lib/storage';

import { IconInput } from '@/components/icon-input';
import { ModalBase } from '@/components/modal-base';
import { AlertBox } from '@/components/alert-box';
import { ButtonWithIcon } from '@/components/button-with-icon';
import { Mail, Save, Trash2, CheckCircle, AlertCircle, LogOut, Lock, Bell, PlugZap, CreditCard , Zap, Code} from 'lucide-react';
import { validationRules } from '@/lib/validation';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successes, setSuccesses] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDoubleConfirm, setShowDoubleConfirm] = useState(false);
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
    setEmail(currentUser.email);
  }, [router]);

  const handleUpdateProfile = () => {
    const emailValidation = validationRules.email.validate(email);
    if (!emailValidation.valid) {
      setErrors({ email: emailValidation.error || '' });
      return;
    }

    updateUser({ email });
    setErrors({});
    setSuccesses({ email: 'Email updated successfully' });
    setAlert({
      show: true,
      type: 'success',
      title: 'Profile Updated',
      message: 'Your account email has been successfully updated.',
    });

    setTimeout(() => {
      setSuccesses({});
    }, 3000);
  };

  const handleDeleteAccount = () => {
    deleteUser();
    setAlert({
      show: true,
      type: 'success',
      title: 'Account Permanently Deleted',
      message: 'Your account and all associated data have been removed.',
    });
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  if (!user) return null;

  return (
    <>
      <div className="space-y-8 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences for your autonomous agent deployment
          </p>
        </div>

        {/* Profile Section */}
        <div className="glass border-glow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Mail size={20} className="text-primary" />
            Profile Settings
          </h3>
          <div className="space-y-4">
            <IconInput
              icon={Mail}
              label="Email Address"
              value={email}
              onChange={setEmail}
              error={errors.email}
              success={successes.email}
            />
            <ButtonWithIcon
              icon={Save}
              label="Save Changes"
              onClick={handleUpdateProfile}
            />
          </div>
        </div>

        {/* Security Settings */}
        <div className="glass border-glow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lock size={20} className="text-primary" />
            Security Settings
          </h3>
          <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
            <ButtonWithIcon
              icon={CreditCard}
              label="Change Password"
              onClick={() => setAlert({ show: true, type: 'success', title: 'Feature Coming Soon', message: 'Password change functionality is under development.' })}
            />
            <ButtonWithIcon
              icon={Zap}
              label="Enable Two-Factor Authentication"
              onClick={() => setAlert({ show: true, type: 'success', title: 'Feature Coming Soon', message: 'Two-Factor Authentication is under development.' })}
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass border-glow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell size={20} className="text-primary" />
            Notification Settings
          </h3>
          <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
            <ButtonWithIcon
              icon={Mail}
              label="Email Notifications"
              onClick={() => setAlert({ show: true, type: 'success', title: 'Feature Coming Soon', message: 'Email notification preferences are under development.' })}
            />
            <ButtonWithIcon
              icon={AlertCircle}
              label="In-App Notifications"
              onClick={() => setAlert({ show: true, type: 'success', title: 'Feature Coming Soon', message: 'In-app notification preferences are under development.' })}
            />
          </div>
        </div>

        {/* Integration Settings */}
        <div className="glass border-glow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PlugZap size={20} className="text-primary" />
            Integration Settings
          </h3>
          <div className="space-y-4">
            <ButtonWithIcon
              icon={Code}
              label="Connect to API"
              onClick={() => setAlert({ show: true, type: 'success', title: 'Feature Coming Soon', message: 'API integration settings are under development.' })}
            />
          </div>
        </div>

        {/* Account Status Section */}
        <div className="glass border-glow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Account Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/10 rounded border border-border/50">
              <div>
                <p className="text-sm font-medium">Active Agents</p>
                <p className="text-xs text-muted-foreground">Deployed and running</p>
              </div>
              <span className="text-lg font-bold text-primary">0</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/10 rounded border border-border/50">
              <div>
                <p className="text-sm font-medium">Account Balance</p>
                <p className="text-xs text-muted-foreground">Available USDC</p>
              </div>
              <span className="text-lg font-bold text-primary">${user.balance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="glass border-glow rounded-lg p-6 border-destructive/30 bg-destructive/5">
          <h3 className="text-lg font-semibold mb-2 text-destructive flex items-center gap-2">
            <AlertCircle size={20} />
            Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Irreversible actions. Proceed with caution.</p>
          <ButtonWithIcon
            icon={Trash2}
            label="Delete Account"
            onClick={() => setShowDeleteConfirm(true)}
            variant="danger"
          />
        </div>
      </div>

      <ModalBase
        isOpen={showDeleteConfirm}
        title="Delete Your Account?"
        description="This will permanently delete your account, all agents, all automation rules, and all transaction history. This action cannot be undone. Please click again to confirm."
        icon={AlertCircle}
        confirmLabel="Proceed to Confirmation"
        cancelLabel="Cancel"
        isDangerous
        onConfirm={() => {
          setShowDeleteConfirm(false);
          setShowDoubleConfirm(true);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <ModalBase
        isOpen={showDoubleConfirm}
        title="Permanently Delete Account?"
        description="This is your final confirmation. Your account and all associated data will be permanently deleted and cannot be recovered. Type DELETE to confirm."
        icon={Trash2}
        confirmLabel="Permanently Delete Account"
        cancelLabel="Keep Account"
        isDangerous
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDoubleConfirm(false)}
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
