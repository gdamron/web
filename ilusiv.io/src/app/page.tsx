import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import Markdown from "./components/Markdown";
import { HeroPlayer } from "./components/PlayButton";
import { consulting, contact, fugue, hero, work } from "./content/home";
import { fetchPageBody, fetchProjects } from "./lib/cms";

const FlowField = dynamic(() => import("./components/FlowField"), {
  ssr: false,
});

export const revalidate = 60;

const Home = async () => {
  const [heroBody, projects] = await Promise.all([
    fetchPageBody(hero.entryId),
    fetchProjects(),
  ]);
  const recent = projects
    .filter(({ slug }) => fugue.notes.path !== `/projects/${slug}`)
    .slice(0, work.count);

  return (
    <main>
      <section className="relative flex min-h-[100svh] flex-col justify-center">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <FlowField />
        </div>
        <div className="page-column pt-24 pb-16">
          <div className="hero-copy">
            <Markdown source={heroBody} />
          </div>
          <div className="mt-8">
            <HeroPlayer title={hero.track.title} caption={hero.track.caption} />
          </div>
        </div>
      </section>

      <div className="theme-inverse pb-24">
        <section
          id="fugue"
          className="page-column margin-grid scroll-mt-20 py-20"
        >
          <h2 className="section-heading">{fugue.heading}</h2>
          <div className="max-w-[60ch]">
            <p className="text-2xl leading-snug sm:text-3xl sm:leading-snug">
              {fugue.lede}
            </p>
            <p className="mt-6">{fugue.body}</p>
            <ul className="mt-8 flex flex-col gap-2">
              <li>
                <Link href={fugue.notes.path} className="text-link">
                  {fugue.notes.label}
                </Link>
              </li>
              <li>
                <a
                  href={fugue.source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  {fugue.source.label}
                </a>
                <span className="text-xs"> ↗</span>
              </li>
              <li>
                <Link href={fugue.diaries.path} className="text-link">
                  {fugue.diaries.label}
                </Link>
                <span className="text-muted"> {fugue.diaries.note}</span>
              </li>
            </ul>
          </div>
        </section>

        <section
          id="consulting"
          className="page-column margin-grid scroll-mt-20 py-20"
        >
          <h2 className="section-heading">{consulting.heading}</h2>
          <div>
            <p className="max-w-[60ch]">{consulting.body}</p>
            <dl className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {consulting.areas.map(({ name, text }) => (
                <div key={name}>
                  <dt className="font-headline text-xl">{name}</dt>
                  <dd className="mt-2 text-[0.95rem] leading-relaxed">
                    {text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          id="work"
          className="page-column margin-grid scroll-mt-20 py-20"
        >
          <div>
            <h2 className="section-heading">{work.heading}</h2>
            <Link href="/projects" className="text-link mt-4 inline-block">
              See all {projects.length} projects
            </Link>
          </div>
          <ul className="border-t border-rule">
            {recent.map(({ slug, title, summary, image, date }) => (
              <li key={slug} className="border-b border-rule">
                <Link
                  href={`/projects/${slug}`}
                  className="group grid grid-cols-[5rem_minmax(0,1fr)] items-start gap-5 py-6 sm:grid-cols-[9rem_minmax(0,1fr)_auto]"
                >
                  <Image
                    src={image}
                    alt=""
                    width={288}
                    height={192}
                    className="aspect-[3/2] w-full rounded object-cover"
                  />
                  <div>
                    <h3 className="font-headline text-xl underline-offset-8 decoration-2 decoration-accent group-hover:underline">
                      {title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[0.95rem] leading-relaxed">
                      {summary}
                    </p>
                  </div>
                  <p className="hidden text-sm text-muted sm:block">
                    {date.split("-")[0]}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="contact" className="page-column scroll-mt-20 pt-20">
          <h2 className="font-headline text-balance text-[clamp(2rem,5vw,3.75rem)] leading-[1.08] max-w-[18ch]">
            {contact.heading}
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg">{contact.body}</p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-md bg-primary px-8 py-3 font-medium text-background underline-offset-4 decoration-accent decoration-2 hover:underline"
          >
            {contact.action}
          </Link>
        </section>
      </div>
    </main>
  );
};

export default Home;
