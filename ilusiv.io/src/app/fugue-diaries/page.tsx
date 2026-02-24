import Parser from "rss-parser";
import IlusivH1 from "../components/IlusivH1";
import Image from "next/image";

export const revalidate = 3600;

const RSS_URL = "https://fuguediaries.substack.com/feed";

type CustomItem = { enclosure?: { url: string } };
const parser = new Parser<Record<string, never>, CustomItem>({ customFields: { item: ["enclosure"] } });

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const FugueDiaries = async () => {
  const feed = await parser.parseURL(RSS_URL);
  const items = feed.items.slice(0, 10);

  return (
    <main>
      <div className="flex justify-center">
        <div className="py-16 px-8 sm:w-4/5 md:w-3/4 lg:w-3/5 max-w-3xl w-full">
          <IlusivH1>The Fugue Diaries</IlusivH1>
          <p className="mb-10">
            Adventures in agentically coding a generative music platform, creating sound with it,
            and exploring what comes up in the process.
          </p>
          <ul className="flex flex-col gap-8">
            {items.map(({ title, contentSnippet, link, pubDate, enclosure }) => (
              <li key={link} className="rounded-lg border-[1px] border-transparent hover:border-accent transition">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-5 items-start"
                >
                  {enclosure?.url && (
                    <Image
                      src={enclosure.url}
                      alt={title || "Fugue Diaries Post"}
                      className="h-28 w-44 object-cover shrink-0 rounded"
                      width={1920}
                      height={1080}
                    />
                  )}
                  <div className="flex flex-col gap-1">
                    {pubDate && <span className="text-xs opacity-50">{formatDate(pubDate)}</span>}
                    <span className="font-semibold text-lg leading-snug group-hover:underline underline-offset-4 decoration-2 decoration-accent">
                      {title}
                    </span>
                    {contentSnippet && (
                      <span className="text-sm opacity-70">{contentSnippet}</span>
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <a
              href="https://fuguediaries.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm"
            >
              <span
                className="h-6 font-semibold text-accent px-1"
              >
                Read on substack</span> ↗
            </a>
          </div>
          <div className="mt-12">
            <iframe
              src="https://fuguediaries.substack.com/embed"
              width="480"
              height="150"
              className="w-full"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default FugueDiaries;
