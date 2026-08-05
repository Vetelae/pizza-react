import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const focusableElementSelector = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  pendingLabel,
  isPending,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      cancelButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousBodyOverflow;
      previouslyFocusedElementRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!isPending) {
          event.preventDefault();
          onCancel();
        }
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          focusableElementSelector
        ) ?? []
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (
        event.shiftKey &&
        (activeElement === firstElement ||
          !dialogRef.current?.contains(activeElement))
      ) {
        event.preventDefault();
        lastElement?.focus();
      } else if (
        !event.shiftKey &&
        (activeElement === lastElement ||
          !dialogRef.current?.contains(activeElement))
      ) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isPending, onCancel]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-3 py-4 backdrop-blur-[1px] sm:px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isPending) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="w-full max-w-md overflow-hidden rounded-md border border-gray-700 bg-gray-800 shadow-2xl"
      >
        <div className="flex gap-4 px-5 py-5 sm:px-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-950/70 text-red-300">
            <FiAlertTriangle size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 id={titleId} className="text-lg font-bold text-white">
              {title}
            </h2>
            <p id={descriptionId} className="mt-2 text-sm leading-6 text-gray-300">
              {description}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-700 bg-gray-900/60 px-5 py-4 sm:px-6">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="h-10 rounded border border-gray-600 px-4 text-sm font-semibold text-gray-200 transition hover:bg-gray-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="h-10 rounded bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
