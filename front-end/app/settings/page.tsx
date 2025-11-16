'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, updateUser, deleteUser } from '@/lib/storage';

import { IconInput } from '@/components/icon-input';
import { ModalBase } from '@/components/modal-base';
import { AlertBox } from '@/components/alert-box';
import { ButtonWithIcon } from '@/components/button-with-icon';
import { Mail, Save, Trash2, CheckCircle, AlertCircle, LogOut, Lock, Bell, PlugZap, CreditCard , Zap, Code, KeyRound, ToggleLeft, ToggleRight, User as UserIcon, Upload } from 'lucide-react';
import { validationRules } from '@/lib/validation';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [inAppNotificationsEnabled, setInAppNotificationsEnabled] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

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
    // Simulate fetching actual settings
    setTwoFactorEnabled(false);
    setEmailNotificationsEnabled(true);
    setInAppNotificationsEnabled(true);
    setApiConnected(false);
  }, [router]);

    const handleUpdateProfile = () => {
    const emailValidation = validationRules.email.validate(email);
    const usernameValidation = validationRules.username.validate(username);
    
    const newErrors: Record<string, string> = {};
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error || '';
    }
    if (!usernameValidation.valid) {
      newErrors.username = usernameValidation.error || '';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateUser({ email, username }); // Update user with new username
    setErrors({});
    setSuccesses({ email: 'Email updated successfully', username: 'Username updated successfully' });
    setAlert({
      show: true,
      type: 'success',
      title: 'Profile Updated',
      message: 'Your account profile has been successfully updated.',
    });

    setTimeout(() => {
      setSuccesses({});
    }, 3000);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmNewPassword) {
      setErrors({ confirmNewPassword: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters.' });
      return;
    }
    // Simulate password change
    setAlert({
      show: true,
      type: 'success',
      title: 'Password Changed',
      message: 'Your password has been successfully updated.',
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setErrors({});
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
          <div className="space-y-4">
            <h4 className="font-medium text-muted-foreground">Change Password</h4>
            <IconInput
              icon={KeyRound}
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <IconInput
              icon={KeyRound}
              label="New Password"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              error={errors.newPassword}
            />
            <IconInput
              icon={KeyRound}
              label="Confirm New Password"
              type="password"
              value={confirmNewPassword}
              onChange={setConfirmNewPassword}
              error={errors.confirmNewPassword}
            />
            <ButtonWithIcon
              icon={Save}
              label="Change Password"
              onClick={handleChangePassword}
            />

            <div className="flex items-center justify-between p-3 bg-muted/10 rounded border border-border/50">
              <div className="flex items-center gap-2">
                <Zap size={20} className="text-primary" />
                <p className="text-sm font-medium">Two-Factor Authentication</p>
              </div>
              <button onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}>
                {twoFactorEnabled ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} className="text-muted-foreground" />}
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass border-glow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell size={20} className="text-primary" />
            Notification Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/10 rounded border border-border/50">
              <div className="flex items-center gap-2">
                <Mail size={20} className="text-primary" />
                <p className="text-sm font-medium">Email Notifications</p>
              </div>
              <button onClick={() => setEmailNotificationsEnabled(!emailNotificationsEnabled)}>
                {emailNotificationsEnabled ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} className="text-muted-foreground" />}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/10 rounded border border-border/50">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} className="text-primary" />
                <p className="text-sm font-medium">In-App Notifications</p>
              </div>
              <button onClick={() => setInAppNotificationsEnabled(!inAppNotificationsEnabled)}>
                {inAppNotificationsEnabled ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} className="text-muted-foreground" />}
              </button>
            </div>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="glass border-glow rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PlugZap size={20} className="text-primary" />
            Integration Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/10 rounded border border-border/50">
              <div className="flex items-center gap-2">
                <Code size={20} className="text-primary" />
                <p className="text-sm font-medium">Connect to API</p>
              </div>
              <button onClick={() => setApiConnected(!apiConnected)}>
                {apiConnected ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} className="text-muted-foreground" />}
              </button>
            </div>
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
