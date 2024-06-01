"use client";

import Link from "next/link";
import MenuIcon from "./MenuIcon";
import { useState } from "react";

const navItems = [
  { name: "Projects", path: "/projects" },
  { name: "About", path: "/about" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const onMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed w-full h-12 backdrop-blur-lg pt-2">
      <div className="flex justify-between items-center h-full w-full px-8 2xl:px-16">
        <Link href="/">
          <h1 className="font-headline text-2xl">(i)lusiv</h1>
        </Link>
        <div className="hidden sm:flex">
          <ul className="hidden sm:flex">
            {navItems.map(({ name, path }) => (
              <Link key={path} href={path}>
                <li className="ml-8 hover:underline underline-offset-8 decoration-2 decoration-accent text-lg">
                  {name}
                </li>
              </Link>
            ))}
          </ul>
        </div>
        <div onClick={onMenuClick} className="sm:hidden cursor-pointer h-6 w-6">
          <MenuIcon />
        </div>
        <div
          className={
            isMenuOpen
              ? "fixed left-0 top-0 w-[65%] sm:hidden h-screen bg-[#eee] px-6 py-4 ease-in duration-200"
              : "fixed left-[-100%] top-0 w-[65%] sm:hidden h-screen bg-[#eee] px-6 py-4 ease-in duration-200"
          }
        >
          <div className="flex w-full items-center justify-end">
            <div
              onClick={() => setIsMenuOpen(false)}
              className="cursor-pointer"
            >
              X
            </div>
          </div>
          <div className="flex-col py-4">
            <ul>
              <Link href="/">
                <li
                  onClick={() => setIsMenuOpen(false)}
                  className="py-4 cursor-pointer"
                >
                  Home
                </li>
              </Link>
              {navItems.map(({ name, path }) => (
                <Link key={path} href={path}>
                  <li
                    onClick={() => setIsMenuOpen(false)}
                    className="py-4 cursor-pointer"
                  >
                    {name}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
