import Link from "next/link";
import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import IlusivImage from "./IlusivImage";
import IlusivQuote from "./IlusivQuote";
import { ExternalArrow } from "./Arrow";
import { slugify } from "../lib/text";

const LEVELS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

const HEADING_CLASSES = [
  "page-heading py-4",
  "text-2xl tracking-wider font-semibold py-4",
  "text-xl font-semibold py-4",
  "font-medium py-2",
];

type MarkdownNode = {
  children?: { type: string; tagName?: string; value?: string }[];
};

// A paragraph holding nothing but links is a row of them, not a sentence.
const isLinkRow = (node?: MarkdownNode) => {
  const children = node?.children ?? [];
  const links = children.filter((child) => child.tagName === "a");
  return (
    links.length > 1 &&
    children.every(
      (child) =>
        child.tagName === "a" ||
        (child.type === "text" && !child.value?.trim()),
    )
  );
};

type MarkdownProps = {
  source: string;
  // On a page with its own title, the markdown's headings each step down a
  // level, so the page keeps a single h1.
  demoteHeadings?: boolean;
};

const Markdown = ({ source, demoteHeadings = false }: MarkdownProps) => {
  // Keeps each heading's look and gives it the right level for the page.
  const heading = (rank: number) => {
    const Tag = LEVELS[rank + (demoteHeadings ? 1 : 0)];
    const Heading = ({ children }: { children?: ReactNode }) => (
      <Tag
        id={typeof children === "string" ? slugify(children) : undefined}
        data-rank={rank + 1}
        className={HEADING_CLASSES[rank]}
      >
        {children}
      </Tag>
    );
    return Heading;
  };

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
              <ExternalArrow className="text-anchor" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          );
        },
        blockquote({ children }) {
          return <IlusivQuote>{children}</IlusivQuote>;
        },
        h1: heading(0),
        h2: heading(1),
        h3: heading(2),
        h4: heading(3),
        iframe({ src, title }) {
          return (
            <span className="flex justify-items-center justify-center py-2">
              <iframe
                className="rounded-lg w-full max-w-[960px] aspect-video"
                src={src || ""}
                title={title || "Embedded media"}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </span>
          );
        },
        img({ src, alt }) {
          return <IlusivImage src={src || ""} alt={alt || ""} />;
        },
        p({ node, children }) {
          return isLinkRow(node as MarkdownNode) ? (
            <p className="link-row py-4">{children}</p>
          ) : (
            <p className="py-4">{children}</p>
          );
        },
        ul({ children }) {
          return <ul className="list-disc pl-4">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal pl-4">{children}</ol>;
        },
        li({ children }) {
          return <li className="pl-2">{children}</li>;
        },
      }}
      rehypePlugins={[rehypeRaw]}
    >
      {source}
    </ReactMarkdown>
  );
};

export default Markdown;
