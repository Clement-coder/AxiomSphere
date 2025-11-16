'use client';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  icon?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  buttons?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

export function AlertModal({
  isOpen,
  title,
  message,
  icon,
  type = 'info',
  onClose,
  buttons = [],
}: AlertModalProps) {
  if (!isOpen) return null;

  const bgColor = {
    success: 'bg-green-950/50 border-green-700/50',
    error: 'bg-red-950/50 border-red-700/50',
    warning: 'bg-yellow-950/50 border-yellow-700/50',
    info: 'bg-primary/20 border-primary/50',
  }[type];

  const textColor = {
    success: 'text-green-300',
    error: 'text-red-300',
    warning: 'text-yellow-300',
    info: 'text-primary',
  }[type];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 fade-in">
      <div className={`${bgColor} border rounded-lg p-6 max-w-md w-full mx-4 slide-up shadow-2xl`}>
        <div className="flex items-start gap-4">
          {icon && <span className="text-2xl flex-shrink-0">{icon}</span>}
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-sm text-foreground/80 mb-4">{message}</p>
            {buttons.length > 0 && (
              <div className="flex gap-2 justify-end">
                {buttons.map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      btn.onClick();
                      onClose?.();
                    }}
                    className={`px-4 py-2 rounded text-sm font-medium transition-all duration-200 ${
                      btn.variant === 'danger'
                        ? 'bg-destructive/20 border border-destructive/50 hover:bg-destructive/30 text-destructive'
                        : btn.variant === 'secondary'
                          ? 'bg-muted/20 border border-muted/50 hover:bg-muted/30'
                          : 'bg-primary/20 border border-primary/50 hover:bg-primary/30 text-primary'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}
            {buttons.length === 0 && onClose && (
              <button
                onClick={onClose}
                className="ml-auto px-4 py-2 rounded text-sm font-medium bg-primary/20 border border-primary/50 hover:bg-primary/30 text-primary transition-all duration-200"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
