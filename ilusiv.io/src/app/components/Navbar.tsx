"use client";

import Link from "next/link";
import MenuIcon from "./MenuIcon";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Fugue", path: "/#fugue" },
  { name: "Work", path: "/projects" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathName = usePathname();
  const isCurrent = (path: string) =>
    !path.includes("#") && pathName.startsWith(path);

  return (
    <nav className="site-nav fixed z-30 w-full h-12 backdrop-blur-lg pt-2">
      <div className="page-column flex justify-between items-center h-full">
        <Link href="/" className="font-headline text-2xl">
          (i)lusiv
        </Link>
        <ul className="hidden sm:flex gap-8">
          {navItems.map(({ name, path }) => (
            <li key={path}>
              <Link
                href={path}
                aria-current={isCurrent(path) ? "page" : undefined}
                className={`${isCurrent(path) ? "underline" : "hover:underline"} underline-offset-8 decoration-2 decoration-accent text-lg`}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          className="sm:hidden h-6 w-6"
        >
          <MenuIcon />
        </button>
      </div>
      <div
        className={`fixed top-0 w-[65%] sm:hidden h-screen bg-menu px-6 py-2 ease-in duration-200 ${isMenuOpen ? "left-0 visible" : "left-[-100%] invisible"}`}
      >
        <div className="flex w-full justify-end">
          <button
            type="button"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            className="text-4xl leading-none py-1"
          >
            ×
          </button>
        </div>
        <ul className="py-4">
          {[{ name: "Home", path: "/" }, ...navItems].map(({ name, path }) => (
            <li key={path}>
              <Link
                href={path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-4 decoration-accent ${path === "/" ? (pathName === "/" ? "underline" : "") : isCurrent(path) ? "underline" : ""}`}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
