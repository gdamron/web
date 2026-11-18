import Link from "next/link";
import { contact } from "../content/home";

// How a page ends: the question, a line under it, and the one filled button.
const ClosingCta = ({ className = "" }: { className?: string }) => (
  <section
    className={`flex flex-col items-center text-center ${className}`}
    aria-labelledby="closing-heading"
  >
    <h2 id="closing-heading" className="closing-heading text-balance">
      {contact.heading}
    </h2>
    <p className="mt-5 text-balance text-xl sm:text-2xl">{contact.body}</p>
    <Link href="/contact" className="cta-button mt-8">
      {contact.action}
    </Link>
  </section>
);

export default ClosingCta;
