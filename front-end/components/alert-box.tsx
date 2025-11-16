'use client';

import { type LucideIcon, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AlertBoxProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onDismiss?: () => void;
  dismissible?: boolean;
  duration?: number; // New prop for auto-dismiss duration
}

export function AlertBox({
  icon: Icon,
  title,
  description,
  type,
  onDismiss,
  dismissible = true,
  duration = 5000, // Default to 5 seconds
}: AlertBoxProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const colors = {
    success: {
      bg: 'bg-green-950/40',
      border: 'border-green-700/50',
      icon: 'text-green-400',
      title: 'text-green-300',
      text: 'text-green-200/80',
    },
    error: {
      bg: 'bg-red-950/40',
      border: 'border-red-700/50',
      icon: 'text-red-400',
      title: 'text-red-300',
      text: 'text-red-200/80',
    },
    warning: {
      bg: 'bg-yellow-950/40',
      border: 'border-yellow-700/50',
      icon: 'text-yellow-400',
      title: 'text-yellow-300',
      text: 'text-yellow-200/80',
    },
    info: {
      bg: 'bg-primary/20',
      border: 'border-primary/50',
      icon: 'text-primary',
      title: 'text-primary',
      text: 'text-foreground/80',
    },
  }[type];

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 w-full max-w-sm ${colors.bg} border ${colors.border} rounded-lg p-4 flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      {Icon && <Icon size={20} className={`flex-shrink-0 mt-0.5 ${colors.icon}`} />}
      <div className="flex-1">
        <h4 className={`font-bold text-sm mb-1 ${colors.title}`}>{title}</h4>
        <p className={`text-sm ${colors.text}`}>{description}</p>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
