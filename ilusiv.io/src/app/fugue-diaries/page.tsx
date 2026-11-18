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
            <li key={link} className="border-b border-rule py-6 sm:py-8">
              <article
                className={`group relative grid gap-x-4 sm:grid-cols-12 sm:gap-x-10 ${cover ? "grid-cols-[6.5rem_1fr]" : ""}`}
              >
                {cover && (
                  <div className="project-image aspect-square self-start sm:col-span-3 sm:aspect-video">
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
                  <h2 className="mt-1 font-headline text-xl leading-tight sm:mt-2 sm:text-2xl sm:leading-tight lg:text-3xl lg:leading-tight">
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
                    <p className="mt-3 line-clamp-2 max-w-[60ch] sm:line-clamp-3 text-pretty leading-relaxed">
                      {contentSnippet}
                    </p>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
      <section className="mt-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 sm:mt-12">
        <h2 className="text-balance font-headline text-xl sm:text-2xl lg:text-3xl">
          Get new posts by email
        </h2>
        <a
          href={`${SUBSTACK_URL}/subscribe`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link"
        >
          Subscribe on Substack
          <ExternalArrow />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </section>
      <ClosingCta className="section-top mt-20 sm:mt-28" />
    </main>
  );
};

export default FugueDiaries;
