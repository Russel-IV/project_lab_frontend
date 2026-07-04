import { X } from 'lucide-react';

interface ItemInfoMessageProps {
  title: string;
  message: string;
  onClose: () => void;
  className?: string;
}

/**
 * ItemInfoMessage
 *
 * Friendly fallback shown in the detail panel when the stay fails to load
 * (API/network error) or can't be found (e.g. a stale/invalid id). Mirrors
 * ItemInfo's panel chrome so swapping between states doesn't jump around,
 * and always offers a way back to the search results.
 */
export function ItemInfoMessage({
  title,
  message,
  onClose,
  className = '',
}: ItemInfoMessageProps) {
  return (
    <div
      className={`relative w-full h-full rounded-2xl border border-border bg-card shadow-xl flex flex-col items-center justify-center gap-4 p-8 text-center ${className}`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close stay details"
        className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-frui-white border border-neutral-200 shadow-md hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
      >
        <X className="w-5 h-5 text-frui-blue" />
      </button>

      <div className="max-w-xs flex flex-col items-center gap-3">
        <h3 className="font-semibold text-lg text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {message}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 bg-frui-orange hover:bg-frui-orange/90 active:scale-[0.98] text-white font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm select-none text-sm cursor-pointer border-0"
        >
          Back to search results
        </button>
      </div>
    </div>
  );
}
