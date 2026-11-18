"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import AlertMessage from "./AlertMessage";
import { ContactMessage, EMAIL_PATTERN, LIMITS } from "../lib/contact";

const MESSAGE_ERRORS: Record<string, string> = {
  required: "Don't forget to write a message.",
  minLength: `A little more detail, please: at least ${LIMITS.messageMin} characters.`,
  maxLength: `Let's keep it under ${LIMITS.messageMax} characters to start.`,
};

export const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessage>();

  const [outcome, setOutcome] = useState<"sent" | "failed">();

  // The form gives way to the thank-you note, so focus moves there with it.
  const thanksRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (outcome === "sent") thanksRef.current?.focus();
  }, [outcome]);

  const send = async (data: ContactMessage) => {
    setOutcome(undefined);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setOutcome(res.ok ? "sent" : "failed");
    } catch {
      setOutcome("failed");
    }
  };

  if (outcome === "sent") {
    return (
      <div>
        <h2
          ref={thanksRef}
          tabIndex={-1}
          className="font-headline text-3xl outline-none"
        >
          Thanks for reaching out.
        </h2>
        <p className="mt-4 max-w-[44ch] text-lg leading-relaxed">
          Your message is on its way. Expect a reply within a few days.
        </p>
      </div>
    );
  }

  const messageError = errors.message
    ? (MESSAGE_ERRORS[errors.message.type] ?? MESSAGE_ERRORS.required)
    : undefined;

  return (
    <form onSubmit={handleSubmit(send)} noValidate className="space-y-6">
      <div>
        <label htmlFor="contact-name" className="field-label">
          Your name
        </label>
        <input
          id="contact-name"
          autoComplete="name"
          className="field-input"
          aria-required="true"
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          {...register("name", { required: true, maxLength: LIMITS.name })}
        />
        {errors.name && (
          <AlertMessage
            id="contact-name-error"
            message="Please enter your name."
          />
        )}
      </div>
      <div>
        <label htmlFor="contact-email" className="field-label">
          Your email address
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          className="field-input"
          aria-required="true"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          {...register("email", {
            required: true,
            maxLength: LIMITS.email,
            pattern: EMAIL_PATTERN,
          })}
        />
        {errors.email && (
          <AlertMessage
            id="contact-email-error"
            message="Please enter a valid email address."
          />
        )}
      </div>
      <div>
        <label htmlFor="contact-subject" className="field-label">
          Topic
        </label>
        <select
          id="contact-subject"
          className="field-input field-select"
          aria-required="true"
          aria-invalid={errors.subject ? "true" : "false"}
          aria-describedby={
            errors.subject ? "contact-subject-error" : undefined
          }
          {...register("subject", { required: true })}
        >
          <option value="">Choose a topic</option>
          <option value="project">I have a project</option>
          <option value="question">I have a question</option>
        </select>
        {errors.subject && (
          <AlertMessage
            id="contact-subject-error"
            message="Please choose a topic."
          />
        )}
      </div>
      <div>
        <label htmlFor="contact-message" className="field-label">
          Message
        </label>
        <textarea
          id="contact-message"
          className="field-input min-h-48"
          aria-required="true"
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={
            messageError ? "contact-message-error" : "contact-message-hint"
          }
          {...register("message", {
            required: true,
            minLength: LIMITS.messageMin,
            maxLength: LIMITS.messageMax,
          })}
        />
        {messageError ? (
          <AlertMessage id="contact-message-error" message={messageError} />
        ) : (
          <p id="contact-message-hint" className="mt-2 text-sm text-muted">
            At least {LIMITS.messageMin} characters.
          </p>
        )}
      </div>
      {outcome === "failed" && (
        <AlertMessage
          announce
          message="The message couldn't be sent. Please try again."
        />
      )}
      <button type="submit" disabled={isSubmitting} className="cta-button">
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
};
