'use client';

import { type LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface ButtonWithIconProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
  isLoading?: boolean;
  children?: ReactNode;
}

export function ButtonWithIcon({
  icon: Icon,
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  type = 'button',
  isLoading = false,
}: ButtonWithIconProps) {
  const sizeClass = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size];

  const variantClass = {
    primary: 'bg-primary/20 border-primary/50 text-primary hover:bg-primary/30',
    secondary: 'bg-secondary/20 border-secondary/50 text-secondary hover:bg-secondary/30',
    danger: 'bg-destructive/20 border-destructive/50 text-destructive hover:bg-destructive/30',
    muted: 'bg-muted/20 border-muted/50 text-muted-foreground hover:bg-muted/30',
  }[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 border rounded font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClass} ${variantClass} ${
        fullWidth ? 'w-full' : ''
      }`}
    >
      <Icon size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />
      <span>{isLoading ? 'Loading...' : label}</span>
    </button>
  );
}
