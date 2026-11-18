import type { Metadata } from "next";
import Image from "next/image";
import Parser from "rss-parser";
import { ExternalArrow } from "../components/Arrow";
import ClosingCta from "../components/ClosingCta";
import { isResizable } from "../components/IlusivImage";

export const revalidate = 3600;

export const metadata: Metadata = { title: "The Fugue Diaries" };

const SUBSTACK_URL = "https://fuguediaries.substack.com";

type CustomItem = { enclosure?: { url: string } };
const parser = new Parser<Record<string, never>, CustomItem>({
  customFields: { item: ["enclosure"] },
});

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const FugueDiaries = async () => {
  const feed = await parser.parseURL(`${SUBSTACK_URL}/feed`);
  const items = feed.items.slice(0, 10);

  return (
    <main id="content" className="page-column page-shell">
      <h1 className="page-heading">The Fugue Diaries</h1>
      <p className="page-lede">
        Adventures in agentically coding a generative music platform, creating
        sound with it, and exploring what comes up in the process.
      </p>
      <p className="mt-6">
        <a
          href={SUBSTACK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link"
        >
          Read on Substack
          <ExternalArrow />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
      <ul className="mt-12 border-t border-rule sm:mt-16">
        {items.map(({ title, contentSnippet, link, pubDate, enclosure }) => {
          const cover =
            enclosure?.url && isResizable(enclosure.url)
              ? enclosure.url
              : undefined;
          return (
            <li key={link} className="border-b border-rule py-8">
              <article className="group relative grid gap-x-10 gap-y-5 sm:grid-cols-12">
                {cover && (
                  <div className="project-image aspect-video sm:col-span-3">
                    <Image
                      src={cover}
                      alt=""
                      width={640}
                      height={360}
                      sizes="(min-width: 1152px) 250px, (min-width: 640px) 25vw, 100vw"
                    />
                  </div>
                )}
                <div
                  className={`self-center ${cover ? "sm:col-span-9" : "sm:col-span-12"}`}
                >
                  {pubDate && (
                    <p className="text-sm text-muted">{formatDate(pubDate)}</p>
                  )}
                  <h2 className="mt-2 font-headline text-2xl leading-tight lg:text-3xl lg:leading-tight">
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="stretched-link"
                    >
                      {title || "Untitled post"}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </h2>
                  {contentSnippet && (
                    <p className="mt-3 line-clamp-3 max-w-[60ch] text-pretty leading-relaxed">
                      {contentSnippet}
                    </p>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
      <iframe
        src={`${SUBSTACK_URL}/embed`}
        title="Subscribe to The Fugue Diaries"
        height="150"
        className="mt-12 w-full max-w-xl rounded-md"
      />
      <ClosingCta className="section-top mt-20 sm:mt-28" />
    </main>
  );
};

export default FugueDiaries;
