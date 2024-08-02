import { Resend } from "resend";
import { FormData } from "../../components/ContactForm";

const { EMAIL_TOKEN, EMAIL_FROM, EMAIL_TO } = process.env;

if (!EMAIL_TOKEN) {
  throw new Error("EMAIL_TOKEN not found in environment");
}

if (!EMAIL_FROM) {
  throw new Error("EMAIL_FROM not found in environment");
}

if (!EMAIL_TO) {
  throw new Error("EMAIL_TO not found in environment");
}

const emailClient = new Resend(EMAIL_TOKEN);

export const POST = async (req: Request) => {
  const json = (await req.json()) as FormData;

  const { data, error } = await emailClient.emails.send({
    from: EMAIL_FROM,
    to: [EMAIL_TO],
    subject: `[Contact Form] ${json.subject}`,
    text: `name: ${json.name}\n\nemail: ${json.email}\n\nmessage: ${json.message}`,
  });

  if (error) {
    console.error(error);
    return Response.json(
      { name: error.name, message: error.message },
      { status: 500 },
    );
  }

  return Response.json(data, { status: 200 });
};
