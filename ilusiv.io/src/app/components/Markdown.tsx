import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import IlusivImage from "./IlusivImage";
import IlusivH1 from "./IlusivH1";
import IlusivQuote from "./IlusivQuote";

const Markdown = ({ source }: { source: string }) => {
  return (
    <ReactMarkdown
      components={{
        a({ href = "", children }) {
          const label = (
            <span className="hover:underline font-semibold decoration-accent text-anchor">
              {children}
            </span>
          );
          // Internal links navigate on the client, which keeps music playing.
          if (href.startsWith("/") || href.startsWith("#")) {
            return <Link href={href}>{label}</Link>;
          }
          return (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {label}
              <span className="text-xs text-anchor" aria-hidden="true">
                {"\u00a0↗"}
              </span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          );
        },
        blockquote({ children }) {
          return <IlusivQuote>{children}</IlusivQuote>;
        },
        h1({ children }) {
          return <IlusivH1>{children}</IlusivH1>;
        },
        h2({ children }) {
          const hid =
            typeof children === "string"
              ? `${children}`.toLowerCase().split(" ").join("-")
              : "";
          return (
            <h2 id={hid} className="text-2xl tracking-wider font-semibold py-4">
              <div className="border-b w-full">{children}</div>
            </h2>
          );
        },
        h3({ children }) {
          return <h3 className="text-xl font-semibold py-4">{children}</h3>;
        },
        h4({ children }) {
          return <h4 className="font-medium py-2">{children}</h4>;
        },
        li({ children }) {
          return <li className="list-disc pl-2">{children}</li>;
        },
        iframe({ src }) {
          return (
            <span className="flex justify-items-center justify-center py-2">
              <iframe
                className="rounded-lg w-full max-w-[960px] aspect-video"
                src={src || ""}
              />
            </span>
          );
        },
        img({ src, alt }) {
          return <IlusivImage src={src || ""} alt={alt || ""} />;
        },
        p({ children }) {
          return <p className="py-4">{children}</p>;
        },
        ul({ children }) {
          return <ul className="pl-4">{children}</ul>;
        },
      }}
      rehypePlugins={[rehypeRaw]}
    >
      {source}
    </ReactMarkdown>
  );
};

export default Markdown;
