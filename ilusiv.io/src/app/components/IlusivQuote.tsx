"use client";

import { PropsWithChildren } from "react";

const IlusivQuote = ({ children }: PropsWithChildren) => {
  return (
    <blockquote className="border-l-2 my-4 pl-4 text-gray-400">
      {children}
    </blockquote>
  );
};

export default IlusivQuote;
