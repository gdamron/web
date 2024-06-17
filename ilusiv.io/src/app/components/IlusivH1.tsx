"use client";

import { PropsWithChildren } from "react";

const IlusivH1 = ({ children }: PropsWithChildren) => {
  const hid =
    typeof children === "string"
      ? `${children}`.toLowerCase().split(" ").join("-")
      : "";
  return (
    <h1 id={hid} className="font-headline text-4xl py-4">
      {children}
    </h1>
  );
};

export default IlusivH1;
