'use client';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 fade-in">
      <div className="glass border-glow rounded-lg p-6 max-w-md w-full mx-4 slide-up shadow-2xl">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-foreground/80 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded text-sm font-medium bg-muted/20 border border-muted/50 hover:bg-muted/30 transition-all duration-200 active:scale-95"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded text-sm font-medium transition-all duration-200 active:scale-95 ${
              isDangerous
                ? 'bg-destructive/20 border border-destructive/50 hover:bg-destructive/30 text-destructive'
                : 'bg-primary/20 border border-primary/50 hover:bg-primary/30 text-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
