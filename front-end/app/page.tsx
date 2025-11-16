'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storeUser, getUser, initializeDefaultAgents } from '@/lib/storage';
import { IconInput } from '@/components/icon-input';
import { ModalBase } from '@/components/modal-base';
import { AlertBox } from '@/components/alert-box';
import { ButtonWithIcon } from '@/components/button-with-icon';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { validationRules } from '@/lib/validation';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successes, setSuccesses] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{ show: boolean; type: 'success' | 'error'; title: string; message: string }>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (getUser()) {
      router.push('/dashboard');
    }
    initializeDefaultAgents();
  }, [router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const newSuccesses: Record<string, string> = {};

    const emailValidation = validationRules.email.validate(email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error || '';
    } else {
      newSuccesses.email = 'Email format valid';
    }

    const passwordValidation = validationRules.password.validate(password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.error || '';
    } else {
      newSuccesses.password = 'Password meets security requirements';
    }

    if (mode === 'signup' && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    } else if (mode === 'signup' && password === confirmPassword && password) {
      newSuccesses.confirmPassword = 'Passwords match';
    }

    setErrors(newErrors);
    setSuccesses(newSuccesses);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password,
      balance: 1000,
    };

    storeUser(user);
    setAlert({
      show: true,
      type: 'success',
      title: `Welcome ${mode === 'signup' ? 'aboard' : 'back'}!`,
      message: `You've successfully ${mode === 'signup' ? 'created your account' : 'logged in'}. Redirecting to dashboard...`,
    });

    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-primary">⚡ Autonomous DApp</h1>
          <p className="text-muted-foreground text-sm">
            Deploy intelligent agents that execute autonomously with session keys
          </p>
        </div>

        {/* Card */}
        <div className="glass border-glow rounded-lg p-8 glow">
          {/* Mode toggle */}
          <div className="flex gap-2 mb-6 border-b border-border/50 pb-6">
            <button
              onClick={() => {
                setMode('login');
                setErrors({});
                setSuccesses({});
              }}
              className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${
                mode === 'login'
                  ? 'bg-primary/20 border border-primary/50 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrors({});
                setSuccesses({});
              }}
              className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${
                mode === 'signup'
                  ? 'bg-primary/20 border border-primary/50 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <IconInput
              icon={Mail}
              label="Email Address"
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              success={successes.email}
            />

            <IconInput
              icon={Lock}
              label="Password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              type="password"
              value={password}
              onChange={setPassword}
              error={errors.password}
              success={successes.password}
            />

            {mode === 'signup' && (
              <IconInput
                icon={Lock}
                label="Confirm Password"
                placeholder="Re-enter your password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                error={errors.confirmPassword}
                success={successes.confirmPassword}
              />
            )}

            <ButtonWithIcon
              icon={mode === 'login' ? LogIn : UserPlus}
              label={mode === 'login' ? 'Sign In' : 'Create Account'}
              type="submit"
              fullWidth
              isLoading={isLoading}
            />
          </form>

          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              Try: demo@example.com / Password123
            </p>
          </div>
        </div>
      </div>

      <ModalBase
        isOpen={alert.show}
        title={alert.title}
        description={alert.message}
        icon={alert.type === 'success' ? CheckCircle : AlertCircle}
      />
    </div>
  );
}
