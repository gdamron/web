import Link from "next/link";
import { links } from "../content/home";
import { ExternalArrow } from "./Arrow";

const siteLinks = [
  { name: "Work", path: "/projects" },
  { name: "About", path: "/about" },
  { name: "The Fugue Diaries", path: "/fugue-diaries" },
  { name: "Contact", path: "/contact" },
];

const elsewhere = [
  { name: "GitHub", href: links.github },
  { name: "LinkedIn", href: links.linkedin },
];

const Footer = () => {
  return (
    <footer data-inverse className="theme-inverse border-t border-rule">
      <div className="page-column flex flex-col gap-8 py-12 min-[1400px]:pb-16 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <Link href="/" className="font-headline text-2xl">
            (i)lusiv
          </Link>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} ilusiv
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-x-8 gap-y-1 sm:flex sm:flex-wrap sm:justify-end">
          {siteLinks.map(({ name, path }) => (
            <li key={path}>
              <Link
                href={path}
                className="inline-block py-1.5 underline-offset-8 decoration-2 decoration-accent hover:underline sm:py-0"
              >
                {name}
              </Link>
            </li>
          ))}
          {elsewhere.map(({ name, href }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-1.5 underline-offset-8 decoration-2 decoration-accent hover:underline sm:py-0"
              >
                {name}
                <ExternalArrow />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
