import Link from "next/link";
import { links } from "../content/home";

const siteLinks = [
  { name: "Work", path: "/projects" },
  { name: "About Grant", path: "/about" },
  { name: "The Fugue Diaries", path: "/fugue-diaries" },
  { name: "Contact", path: "/contact" },
];

const elsewhere = [
  { name: "GitHub", href: links.github },
  { name: "LinkedIn", href: links.linkedin },
];

const Footer = () => {
  return (
    <footer className="theme-inverse border-t border-rule">
      <div className="page-column flex flex-col gap-8 py-12 pr-28 sm:flex-row sm:justify-between">
        <div>
          <Link href="/" className="font-headline text-2xl">
            (i)lusiv
          </Link>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} ilusiv
          </p>
        </div>
        <ul className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-8">
          {siteLinks.map(({ name, path }) => (
            <li key={path}>
              <Link
                href={path}
                className="underline-offset-8 decoration-2 decoration-accent hover:underline"
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
                className="underline-offset-8 decoration-2 decoration-accent hover:underline"
              >
                {name}
                <span className="text-xs"> ↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
