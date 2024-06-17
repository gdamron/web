import Image from "next/image";
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
        a({ href, children }) {
          const isExternal = href?.startsWith("http");
          return (
            <a
              href={href}
              target={isExternal ? "_blank" : "_self"}
              rel="noopener noreferrer"
            >
              <span className="hover:underline font-semibold decoration-accent text-accent">
                {children}
              </span>
              {isExternal && <span className="text-xs text-primary"> ↗ </span>}
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
          return <h3 className="font-medium py-2">{children}</h3>;
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
