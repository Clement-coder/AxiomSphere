'use client';

import { type LucideIcon, X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalBaseProps {
  isOpen: boolean;
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export function ModalBase({
  isOpen,
  title,
  description,
  icon: Icon,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false,
  isLoading = false,
}: ModalBaseProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-card border border-primary/30 rounded-lg shadow-2xl w-full max-w-md mx-4 animate-in zoom-in-95 fade-in duration-300">
        {/* Header with icon */}
        <div className="flex flex-col items-center pt-6 pb-4 border-b border-border/50">
          {Icon && (
            <Icon size={32} className="text-primary mb-3" />
          )}
          <h2 className="text-lg font-bold text-center">{title}</h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {description && (
            <p className="text-sm text-foreground/80">{description}</p>
          )}
          {children}
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 p-6 border-t border-border/50">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded font-medium text-sm border transition-all duration-200 hover:bg-muted/20 disabled:opacity-50 disabled:cursor-not-allowed bg-muted/10 border-muted/50 text-foreground"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded font-medium text-sm border transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDangerous
                ? 'bg-destructive/20 border-destructive/50 text-destructive hover:bg-destructive/30'
                : 'bg-primary/20 border-primary/50 text-primary hover:bg-primary/30'
            }`}
          >
            {isLoading ? 'Loading...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
