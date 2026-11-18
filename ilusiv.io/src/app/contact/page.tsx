import type { Metadata } from "next";
import { ContactForm } from "../components/ContactForm";
import { contact } from "../content/home";

export const metadata: Metadata = { title: "Contact" };

const Contact = () => (
  <main
    id="content"
    className="page-column page-shell grid gap-x-12 gap-y-10 lg:grid-cols-12"
  >
    <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
      <h1 className="page-heading">{contact.heading}</h1>
      <p className="mt-6 max-w-[32ch] text-xl leading-snug sm:text-2xl sm:leading-snug">
        {contact.body}
      </p>
    </div>
    <div className="lg:col-span-6 lg:col-start-7">
      <ContactForm />
    </div>
  </main>
);

export default Contact;
