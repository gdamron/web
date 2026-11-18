// The contact form's message and its limits, shared by the form and the
// route that sends it, so both hold a message to the same rules.
export const SUBJECTS = ["project", "question"] as const;

export type ContactMessage = {
  name: string;
  email: string;
  subject: (typeof SUBJECTS)[number];
  message: string;
};

export const LIMITS = {
  name: 100,
  email: 254,
  messageMin: 50,
  messageMax: 2500,
};

export const EMAIL_PATTERN = /^[^\s@<>"]+@[^\s@<>"]+\.[a-zA-Z]{2,}$/;

// Line breaks have no place in a name or address, and could be used to forge
// mail headers.
const oneLine = (value: unknown) =>
  typeof value === "string" ? value.replace(/[\r\n]+/g, " ").trim() : "";

// A well-formed message from untrusted input, or undefined.
export const parseContactMessage = (
  input: unknown,
): ContactMessage | undefined => {
  if (typeof input !== "object" || input === null) return undefined;
  const fields = input as Record<string, unknown>;
  const name = oneLine(fields.name);
  const email = oneLine(fields.email);
  const message =
    typeof fields.message === "string" ? fields.message.trim() : "";
  const subject = SUBJECTS.find((known) => known === fields.subject);

  if (!name || name.length > LIMITS.name) return undefined;
  if (email.length > LIMITS.email || !EMAIL_PATTERN.test(email)) {
    return undefined;
  }
  if (!subject) return undefined;
  if (
    message.length < LIMITS.messageMin ||
    message.length > LIMITS.messageMax
  ) {
    return undefined;
  }
  return { name, email, subject, message };
};
