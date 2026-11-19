import Image from "next/image";
import Link from "next/link";
import HeroField from "./components/HeroField";
import Markdown from "./components/Markdown";
import { InlinePlayer } from "./components/PlayButton";
import Reveal from "./components/Reveal";
import { contact, hero, services, tags, track, work } from "./content/home";
import { fetchList, fetchPageBody, fetchProjects } from "./lib/cms";
import { hostname, leadSentences } from "./lib/text";
import { ExternalArrow, LinkArrow } from "./components/Arrow";

export const revalidate = 60;

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
      <section className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col justify-center">
        <HeroField />
        <div className="page-column pb-16 pt-24">
          <div className="hero-copy">
            <Markdown source={heroBody} />
          </div>
        </div>
      </section>

      <div data-inverse className="theme-inverse pb-20 sm:pb-40">
        {feature && (
          <section id="fyug" className="page-column scroll-mt-20 pb-12 pt-24">
            <Reveal>
              <div className="group relative grid gap-x-12 gap-y-10 lg:grid-cols-12">
                <div className="project-image order-last aspect-[3/2] lg:col-span-7">
                  <Image
                    src={feature.image}
                    alt=""
                    width={1152}
                    height={768}
                    sizes="(min-width: 1152px) 616px, (min-width: 1024px) 58vw, 100vw"
                  />
                </div>
                {/* The copy and the player stack on a phone, sit side by side
                    on a tablet, and stack again beside the image on desktop. */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between md:gap-x-12 lg:col-span-5 lg:flex-col lg:items-stretch lg:justify-start">
                  <div>
                    <h2 className="display-heading lg:-mt-2">
                      <Link
                        href={`/projects/${feature.slug}`}
                        className="stretched-link"
                      >
                        {feature.title}
                      </Link>
                    </h2>
                    <p className="mt-5 text-pretty text-2xl leading-snug lg:max-w-[26ch]">
                      {feature.summary}
                    </p>
                    <p className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
                      <span aria-hidden="true" className="card-cue">
                        Learn more
                        <LinkArrow />
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
                          <ExternalArrow />
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ))}
                    </p>
                  </div>
                  <div className="relative z-10 mt-9 md:mt-0 md:shrink-0 lg:mt-auto lg:pt-12">
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
            <div className="section-top grid gap-x-12 gap-y-12 lg:grid-cols-12">
              <Reveal className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
                <h2 className="section-heading">{serviceList.title}</h2>
                <p className="mt-5 max-w-[30ch] text-xl leading-snug sm:text-2xl sm:leading-snug">
                  {serviceList.description}
                </p>
                <Link
                  href="/contact"
                  className="group text-link mt-8 hidden sm:inline-block"
                >
                  {contact.action}
                  <LinkArrow />
                </Link>
              </Reveal>
              <ul className="grid gap-x-12 gap-y-10 sm:grid-cols-2 sm:gap-y-14 lg:col-span-8">
                {serviceList.items.map(({ title, body }, index) => (
                  <li key={title}>
                    <Reveal
                      delay={(index % 2) * 0.08}
                      className="h-full border-t border-rule pt-6 [li:first-child>&]:border-t-0 [li:first-child>&]:pt-0 sm:[li:nth-child(2)>&]:border-t-0 sm:[li:nth-child(2)>&]:pt-0"
                    >
                      <h3 className="font-headline text-2xl lg:text-3xl">
                        {title}
                      </h3>
                      <p className="mt-3 max-w-[36ch] text-pretty leading-relaxed lg:text-lg lg:leading-relaxed">
                        {body}
                      </p>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/contact"
              className="group text-link mt-10 block sm:hidden"
            >
              {contact.action}
              <LinkArrow />
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
                More projects
                <LinkArrow />
              </Link>
            </div>
            <ul className="mt-10 flex flex-col gap-20 sm:mt-16 md:gap-24">
              {featured.map(({ slug, title, summary, image }, index) => (
                <li key={slug}>
                  <Reveal>
                    <article className="group relative grid gap-x-12 gap-y-7 md:grid-cols-12 md:gap-y-5">
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
                          sizes="(min-width: 1152px) 616px, (min-width: 768px) 58vw, 100vw"
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
                        <p className="mt-4 line-clamp-6 max-w-[34ch] text-pretty leading-relaxed lg:text-xl lg:leading-relaxed">
                          {leadSentences(summary ?? "", 220)}
                        </p>
                        <p aria-hidden="true" className="mt-6 card-cue">
                          View project
                          <LinkArrow />
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
              More projects
              <LinkArrow />
            </Link>
          </section>
        )}

        <section
          id="contact"
          className="page-column flex scroll-mt-20 flex-col items-center pt-16 text-center sm:pt-32"
        >
          <h2 className="closing-heading text-balance">{contact.heading}</h2>
          <p className="mt-5 text-balance text-xl sm:text-2xl">
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
