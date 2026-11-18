"use client";

import Link from "next/link";
import MenuIcon from "./MenuIcon";
import { NavPlayer } from "./PlayButton";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { contact } from "../content/home";
import { useInverseAt } from "../lib/useInverseAt";

// Items with a `section` scroll to it on the landing page, where it is
// highlighted while in view. Elsewhere they lead to `page`, or back to the
// landing page's section when there is no page for it.
const navItems = [
  { name: "fyūg", section: "fyug" },
  { name: "Services", section: "services" },
  { name: "Work", section: "work", page: "/projects" },
  { name: "About", page: "/about" },
  { name: "Contact", section: "contact", page: "/contact" },
];

const sections = navItems.flatMap(({ section }) => (section ? [section] : []));

// The landing section currently under the reader's eye, if any.
const useActiveSection = (enabled: boolean) => {
  const [active, setActive] = useState<string>();

  useEffect(() => {
    if (!enabled) {
      setActive(undefined);
      return;
    }
    let frame = 0;
    const check = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current: string | undefined;
      for (const id of sections) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line) current = id;
      }
      // At the foot of the page the last section counts, however tall the
      // screen is.
      const { scrollHeight } = document.documentElement;
      if (window.scrollY + window.innerHeight >= scrollHeight - 2) {
        const last = sections.filter((id) => document.getElementById(id)).pop();
        current = last ?? current;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [enabled]);

  return active;
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathName = usePathname();
  const onLanding = pathName === "/";
  const activeSection = useActiveSection(onLanding);
  const inverse = useInverseAt("top", 24);

  const links = navItems.map(({ name, section, page }) => ({
    name,
    path: section && (onLanding || !page) ? `/#${section}` : (page ?? "/"),
    current: onLanding
      ? section !== undefined && section === activeSection
      : page !== undefined && pathName.startsWith(page),
  }));

  const openRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  // While the menu is open: Escape closes it, the page behind holds still,
  // and focus moves in, then back to the menu button on close.
  useEffect(() => {
    if (!isMenuOpen) {
      if (wasOpen.current) openRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
      if (event.key !== "Tab") return;
      // Keep Tab inside the menu while it is open.
      const stops = menuRef.current?.querySelectorAll<HTMLElement>("a, button");
      if (!stops?.length) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    // The menu only exists on small screens; close it if the screen grows.
    const wide = window.matchMedia("(min-width: 640px)");
    const onWide = () => wide.matches && setIsMenuOpen(false);
    wide.addEventListener("change", onWide);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [isMenuOpen]);

  return (
    <nav
      aria-label="Main"
      className={`site-nav fixed inset-x-0 top-0 z-30 h-12 border-b border-rule transition-colors duration-300 motion-reduce:transition-none ${inverse ? "theme-inverse" : ""}`}
    >
      <div className="page-column flex justify-between items-center h-full">
        <Link href="/" className="relative top-0.5 font-headline text-2xl">
          (i)lusiv
        </Link>
        <div className="flex items-center sm:gap-5">
          <ul className="hidden sm:flex gap-6 md:gap-8">
            {links.map(({ name, path, current }) => (
              <li key={name}>
                <Link
                  href={path}
                  aria-current={
                    current ? (onLanding ? "location" : "page") : undefined
                  }
                  className={`${current ? "underline" : "hover:underline"} underline-offset-8 decoration-2 decoration-accent text-lg`}
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
          <NavPlayer />
          <button
            ref={openRef}
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            aria-controls="site-menu"
            className="-mr-2.5 flex h-11 w-11 items-center justify-center sm:hidden"
          >
            <span className="h-6 w-6">
              <MenuIcon />
            </span>
          </button>
        </div>
      </div>
      <div
        ref={menuRef}
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        // @ts-expect-error React 18 has no typing for the inert attribute.
        inert={isMenuOpen ? undefined : ""}
        className={`fixed inset-0 flex h-[100dvh] flex-col bg-background transition-opacity duration-200 motion-reduce:transition-none sm:hidden ${isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div className="page-column flex h-12 shrink-0 items-center justify-between border-b border-rule">
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="relative top-0.5 font-headline text-2xl"
          >
            (i)lusiv
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            className="-mr-2.5 h-11 w-11 text-4xl leading-none"
          >
            ×
          </button>
        </div>
        <ul className="page-column flex-1 overflow-y-auto pt-10">
          {links.map(({ name, path, current }) => (
            <li key={name}>
              <Link
                href={path}
                onClick={() => setIsMenuOpen(false)}
                aria-current={
                  current ? (onLanding ? "location" : "page") : undefined
                }
                className={`block py-3 font-headline text-4xl underline-offset-8 decoration-2 decoration-accent ${current ? "underline" : ""}`}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="page-column shrink-0 pb-10">
          <Link
            href="/contact"
            onClick={() => setIsMenuOpen(false)}
            className="cta-button w-full text-center"
          >
            {contact.action}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
