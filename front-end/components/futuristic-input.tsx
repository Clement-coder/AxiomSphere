'use client';

interface FuturisticInputProps {
  icon?: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}

export function FuturisticInput({
  icon,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  label,
}: FuturisticInputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-2 text-primary">{label}</label>}
      <div className="relative group">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-primary/60 group-focus-within:text-primary transition-colors">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-10' : 'px-4'} py-2.5 bg-input border border-primary/30 rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors duration-200 ${
            error ? 'border-destructive/50' : ''
          }`}
        />
      </div>
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
}
