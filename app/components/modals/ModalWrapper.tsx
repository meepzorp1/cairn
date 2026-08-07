"use client";

import {
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  panelClassName?: string;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  className = "",
  panelClassName = "",
  showCloseButton = true,
  closeOnBackdrop = true,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const handleBackdropClick = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    if (!closeOnBackdrop) return;

    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      role="presentation"
      onMouseDown={handleBackdropClick}
      className={`fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm ${className}`}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={
          description ? "modal-description" : undefined
        }
        tabIndex={-1}
        className={`relative max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-sc-panel p-6 text-sc-text shadow-2xl outline-none ${panelClassName}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/20 text-sc-muted transition hover:border-white/20 hover:text-sc-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sc-sun"
          >
            <X className="size-5" />
          </button>
        )}

        {(title || description) && (
          <header className="mb-6 pr-12">
            {title && (
              <h2
                id="modal-title"
                className="text-2xl font-bold tracking-tight"
              >
                {title}
              </h2>
            )}

            {description && (
              <p
                id="modal-description"
                className="mt-2 text-sm leading-6 text-sc-muted"
              >
                {description}
              </p>
            )}
          </header>
        )}

        {children}
      </div>
    </div>,
    document.body,
  );
}