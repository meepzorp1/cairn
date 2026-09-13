"use client";

import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { Check, X } from "lucide-react";

type EarlyAccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EarlyAccessModal({
  isOpen,
  onClose,
}: EarlyAccessModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    onClose();

    window.setTimeout(() => {
      setEmail("");
      setIsSubmitted(false);
      setIsSubmitting(false);
      setSubmitError("");
    }, 200);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, handleClose]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to submit your request.",
        );
      }

      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-100 flex items-center justify-center px-4 transition-all duration-200 ${
        isOpen
          ? "visible bg-cairn-outer/75 opacity-100 backdrop-blur-sm"
          : "invisible bg-cairn-outer/0 opacity-0"
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="early-access-title"
        aria-describedby="early-access-description"
        className={`relative w-full max-w-md rounded-2xl border border-cairn-border bg-cairn-bg p-6 shadow-2xl transition-all duration-200 sm:p-8 ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-3 scale-[0.98] opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close early access form"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-cairn-muted transition-colors hover:bg-cairn-card/70 hover:text-cairn-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cairn-gold"
        >
          <X
            aria-hidden="true"
            className="h-5 w-5"
          />
        </button>

        {isSubmitted ? (
          <SuccessMessage onClose={handleClose} />
        ) : (
          <>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-cairn-gold">
              Cairn
            </p>

            <h2
              id="early-access-title"
              className="pr-10 font-display text-3xl font-medium text-cairn-text sm:text-4xl"
            >
              Request early access
            </h2>

            <p
              id="early-access-description"
              className="mt-3 text-sm leading-6 text-cairn-muted sm:text-base"
            >
              Send us your email and we&apos;ll let you know when
              Cairn is ready.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="early-access-email"
                  className="mb-2 block text-sm font-medium text-cairn-text"
                >
                  Email address
                </label>

                <input
                  ref={inputRef}
                  id="early-access-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);

                    if (submitError) {
                      setSubmitError("");
                    }
                  }}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-cairn-border bg-cairn-outer/70 px-4 text-base text-cairn-text outline-none transition placeholder:text-cairn-muted/60 focus:border-cairn-gold focus:ring-2 focus:ring-cairn-gold/30 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {submitError && (
                <p
                  role="alert"
                  className="rounded-lg border border-cairn-danger/25 bg-cairn-danger-soft px-3 py-2 text-sm text-cairn-danger"
                >
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-cairn-gold px-5 font-semibold text-cairn-outer transition-colors hover:bg-cairn-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cairn-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cairn-bg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Sending..."
                  : "Request early access"}
              </button>
            </form>

            <p className="mt-4 text-xs leading-5 text-cairn-muted">
              No spam. Only launch updates and useful Santa Cruz
              stuff.
            </p>
          </>
        )}
      </section>
    </div>
  );
}

type SuccessMessageProps = {
  onClose: () => void;
};

function SuccessMessage({
  onClose,
}: SuccessMessageProps) {
  return (
    <div className="py-4 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cairn-gold-soft text-cairn-gold">
        <Check
          aria-hidden="true"
          className="h-7 w-7"
        />
      </div>

      <h2 className="mt-5 font-display text-3xl font-medium text-cairn-text">
        Request sent
      </h2>

      <p className="mt-3 text-sm leading-6 text-cairn-muted">
        Your email was sent successfully. We&apos;ll let you know
        when Lost Boys V2 is ready.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-cairn-border px-5 text-sm font-semibold text-cairn-text transition-colors hover:bg-cairn-card/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cairn-gold"
      >
        Done
      </button>
    </div>
  );
}