import { PropsWithChildren, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

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
          return (
            <blockquote className="border-l-2 my-4 pl-4 text-gray-400">
              {children}
            </blockquote>
          );
        },
        h1({ children }) {
          const hid =
            typeof children === "string"
              ? `${children}`.toLowerCase().split(" ").join("-")
              : "";
          return (
            <h1 id={hid} className="font-headline text-4xl py-4">
              {children}
            </h1>
          );
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
