import { Resend } from "resend";
import { parseContactMessage } from "../../lib/contact";

// The largest request worth reading: a full-length message with room to spare.
const MAX_BODY_BYTES = 16 * 1024;

const failure = (status: number) => Response.json({ ok: false }, { status });

export const POST = async (req: Request) => {
  const { EMAIL_TOKEN, EMAIL_FROM, EMAIL_TO } = process.env;
  if (!EMAIL_TOKEN || !EMAIL_FROM || !EMAIL_TO) {
    console.error("Contact email is not configured");
    return failure(500);
  }

  let input: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return failure(413);
    input = JSON.parse(text);
  } catch {
    return failure(400);
  }

  const message = parseContactMessage(input);
  if (!message) return failure(400);

  const { error } = await new Resend(EMAIL_TOKEN).emails.send({
    from: EMAIL_FROM,
    to: [EMAIL_TO],
    reply_to: message.email,
    subject: `[Contact Form] ${message.subject}`,
    text: `name: ${message.name}\n\nemail: ${message.email}\n\nmessage: ${message.message}`,
  });

  if (error) {
    console.error(error);
    return failure(502);
  }

  return Response.json({ ok: true });
};
