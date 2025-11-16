'use client';

import { type LucideIcon } from 'lucide-react';

interface IconInputProps {
  icon?: LucideIcon;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  success?: string;
  disabled?: boolean;
}

export function IconInput({
  icon: Icon,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  label,
  success,
  disabled = false,
}: IconInputProps) {
  const hasError = !!error;
  const hasSuccess = !!success && !error;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold mb-2 text-foreground">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200">
            <Icon
              size={18}
              className={`${
                hasError
                  ? 'text-destructive'
                  : hasSuccess
                    ? 'text-green-500'
                    : 'text-primary/60 group-focus-within:text-primary'
              }`}
            />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} py-2.5 bg-input border rounded text-foreground placeholder:text-muted-foreground focus:outline-none transition-all duration-200 ${
            hasError
              ? 'border-destructive/50 focus:border-destructive focus:ring-destructive/20 focus:ring-2'
              : hasSuccess
                ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500/20 focus:ring-2'
                : 'border-primary/30 focus:border-primary focus:ring-primary/20 focus:ring-2'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>
      {error && (
        <div className="flex items-center gap-2 mt-2 text-destructive text-xs">
          <span>•</span>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 mt-2 text-green-500 text-xs">
          <span>•</span>
          <span>{success}</span>
        </div>
      )}
    </div>
  );
}
