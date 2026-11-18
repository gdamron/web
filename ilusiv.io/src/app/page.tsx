import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Markdown from "./components/Markdown";
import { InlinePlayer } from "./components/PlayButton";
import Reveal from "./components/Reveal";
import { contact, hero, services, tags, track, work } from "./content/home";
import { fetchList, fetchPageBody, fetchProjects } from "./lib/cms";
import { leadSentences } from "./lib/text";

const FlowField = dynamic(() => import("./components/FlowField"), {
  ssr: false,
});

export const revalidate = 60;

// "https://www.example.com/path" reads as "example.com" in a link label.
const hostname = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const Home = async () => {
  const [heroBody, projects, serviceList] = await Promise.all([
    fetchPageBody(hero.entryId),
    fetchProjects(),
    fetchList(services.entryId),
  ]);
  // Failing here keeps the last good page in place when content is missing,
  // instead of caching an empty one.
  if (!heroBody || projects.length === 0) {
    throw new Error("Landing page content is unavailable");
  }

  const feature = projects.find((project) => project.tags.includes(tags.hero));
  const featured = projects
    .filter(
      (project) => project !== feature && project.tags.includes(tags.featured),
    )
    .slice(0, work.count);

  return (
    <main id="content">
      <section className="relative isolate flex min-h-[100svh] flex-col justify-center">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <FlowField />
        </div>
        <div className="page-column pb-16 pt-24">
          <div className="hero-copy">
            <Markdown source={heroBody} />
          </div>
        </div>
      </section>

      <div data-inverse className="theme-inverse pb-20 sm:pb-40">
        {feature && (
          <section
            id="fugue"
            className="page-column scroll-mt-20 py-12 sm:pb-12 sm:pt-20"
          >
            <Reveal>
              <div className="group relative grid gap-x-12 gap-y-10 md:grid-cols-12">
                <div className="project-image order-last aspect-[3/2] md:col-span-7 md:aspect-[4/3]">
                  <Image
                    src={feature.image}
                    alt=""
                    width={1152}
                    height={768}
                    sizes="(min-width: 1152px) 616px, (min-width: 768px) 58vw, 100vw"
                  />
                </div>
                <div className="flex flex-col md:col-span-5">
                  <h2 className="display-heading md:-mt-2">
                    <Link
                      href={`/projects/${feature.slug}`}
                      aria-label={`Read about ${feature.title}`}
                      className="stretched-link"
                    >
                      {feature.title}
                    </Link>
                  </h2>
                  <p className="mt-5 max-w-[26ch] text-2xl leading-snug">
                    {feature.summary}
                  </p>
                  <p className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-lg">
                    <span aria-hidden="true" className="card-cue">
                      Read about {feature.title}
                      <span className="link-arrow">→</span>
                    </span>
                    {(feature.links ?? []).map((href) => (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link relative z-10"
                      >
                        Visit {hostname(href)}
                        <span className="text-xs" aria-hidden="true">
                          {"\u00a0↗"}
                        </span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ))}
                  </p>
                  <div className="relative z-10 -m-3 mt-9 w-fit p-3 md:mt-auto md:pt-12">
                    <InlinePlayer title={track.title} caption={track.caption} />
                  </div>
                </div>
              </div>
            </Reveal>
          </section>
        )}

        {serviceList.items.length > 0 && (
          <section
            id="services"
            className="page-column scroll-mt-20 py-12 sm:pb-6 sm:pt-20"
          >
            <Reveal className="section-top">
              <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                <h2 className="section-heading">{serviceList.title}</h2>
                <Link
                  href="/contact"
                  className="group text-link hidden sm:inline"
                >
                  {contact.action}
                  <span aria-hidden="true" className="link-arrow">
                    →
                  </span>
                </Link>
              </div>
              <p className="mt-5 max-w-[52ch] text-xl leading-snug sm:text-2xl sm:leading-snug">
                {serviceList.description}
              </p>
            </Reveal>
            <ul className="mt-12 grid gap-x-12 gap-y-10 border-rule sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:border-t">
              {serviceList.items.map(({ title, body }, index) => (
                <li key={title}>
                  <Reveal
                    delay={index * 0.08}
                    className="h-full border-t border-rule pt-6 lg:border-t-0"
                  >
                    <h3 className="font-headline text-2xl">{title}</h3>
                    <p className="mt-3 leading-relaxed lg:text-lg lg:leading-relaxed">
                      {body}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="group text-link mt-14 block border-t border-rule pt-6 sm:hidden"
            >
              {contact.action}
              <span aria-hidden="true" className="link-arrow">
                →
              </span>
            </Link>
          </section>
        )}

        {featured.length > 0 && (
          <section
            id="work"
            className="page-column scroll-mt-20 py-12 sm:pb-8 sm:pt-20"
          >
            <div className="section-top flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <h2 className="section-heading">{work.heading}</h2>
              <Link
                href="/projects"
                className="group text-link hidden sm:inline"
              >
                See all {projects.length} projects
                <span aria-hidden="true" className="link-arrow">
                  →
                </span>
              </Link>
            </div>
            <ul className="mt-10 flex flex-col gap-20 sm:mt-16 md:gap-24">
              {featured.map(({ slug, title, summary, image }, index) => (
                <li key={slug}>
                  <Reveal>
                    <article className="group relative grid gap-x-12 gap-y-5 md:grid-cols-12">
                      <div
                        className={`project-image aspect-[3/2] md:col-span-7 ${
                          index % 2 ? "md:order-last" : ""
                        }`}
                      >
                        <Image
                          src={image}
                          alt=""
                          width={1344}
                          height={896}
                          sizes="(min-width: 768px) 58vw, 100vw"
                        />
                      </div>
                      <div className="md:col-span-5">
                        <h3 className="-mt-1 font-headline text-3xl leading-tight lg:text-4xl lg:leading-tight">
                          <Link
                            href={`/projects/${slug}`}
                            className="stretched-link"
                          >
                            {title}
                          </Link>
                        </h3>
                        <p className="mt-4 line-clamp-6 max-w-[34ch] leading-relaxed lg:text-xl lg:leading-relaxed">
                          {leadSentences(summary ?? "", 220)}
                        </p>
                        <p aria-hidden="true" className="mt-6 card-cue">
                          View project
                          <span aria-hidden="true" className="link-arrow">
                            →
                          </span>
                        </p>
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
            <Link
              href="/projects"
              className="group text-link mt-16 block border-t border-rule pt-6 sm:hidden"
            >
              See all {projects.length} projects
              <span aria-hidden="true" className="link-arrow">
                →
              </span>
            </Link>
          </section>
        )}

        <section
          id="contact"
          className="page-column flex scroll-mt-20 flex-col items-center pt-16 text-center sm:pt-32"
        >
          <h2 className="closing-heading text-balance max-w-[16ch] sm:max-w-[18ch]">
            {contact.heading}
          </h2>
          <p className="mt-6 max-w-[40ch] text-balance text-xl sm:text-2xl">
            {contact.body}
          </p>
          <Link href="/contact" className="cta-button mt-8">
            {contact.action}
          </Link>
        </section>
      </div>
    </main>
  );
};

export default Home;
