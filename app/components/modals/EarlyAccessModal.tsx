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
          ? "visible bg-slate-950/75 opacity-100 backdrop-blur-sm"
          : "invisible bg-slate-950/0 opacity-0"
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
        className={`relative w-full max-w-md rounded-2xl border border-white/15 bg-slate-900 p-6 shadow-2xl transition-all duration-200 sm:p-8 ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-3 scale-[0.98] opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close early access form"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
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
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
              Lost Boys V2
            </p>

            <h2
              id="early-access-title"
              className="pr-10 text-2xl font-bold text-white sm:text-3xl"
            >
              Request early access
            </h2>

            <p
              id="early-access-description"
              className="mt-3 text-sm leading-6 text-slate-300 sm:text-base"
            >
              Send us your email and we&apos;ll let you know when
              Lost Boys V2 is ready.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
              <div>
                <label
                  htmlFor="early-access-email"
                  className="mb-2 block text-sm font-medium text-white"
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
                  className="h-12 w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {submitError && (
                <p
                  role="alert"
                  className="rounded-lg border border-rose-300/25 bg-rose-300/10 px-3 py-2 text-sm text-rose-200"
                >
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-amber-300 px-5 font-semibold text-slate-950 transition-colors hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Sending..."
                  : "Request early access"}
              </button>
            </form>

            <p className="mt-4 text-xs leading-5 text-slate-400">
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
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-400/15 text-sky-300">
        <Check
          aria-hidden="true"
          className="h-7 w-7"
        />
      </div>

      <h2 className="mt-5 text-2xl font-bold text-white">
        Request sent
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        Your email was sent successfully. We&apos;ll let you know
        when Lost Boys V2 is ready.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        Done
      </button>
    </div>
  );
}