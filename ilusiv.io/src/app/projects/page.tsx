import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LinkArrow } from "../components/Arrow";
import ClosingCta from "../components/ClosingCta";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";
import { tags, work } from "../content/home";
import { fetchPage, fetchProjects } from "../lib/cms";

export const revalidate = 60;

export const generateMetadata = async (): Promise<Metadata> => {
  const { title, summary } = await fetchPage(work.entryId);
  return { title: title || work.heading, description: summary };
};

const Projects = async () => {
  const [page, projects] = await Promise.all([
    fetchPage(work.entryId),
    fetchProjects(),
  ]);
  // Failing here keeps the last good page in place when content is missing.
  if (projects.length === 0) throw new Error("Projects are unavailable");

  const feature = projects.find((project) => project.tags.includes(tags.hero));
  const rest = projects.filter((project) => project !== feature);

  return (
    <main id="content" className="page-column page-shell">
      <h1 className="page-heading">{page.title || work.heading}</h1>
      {page.summary && <p className="page-lede">{page.summary}</p>}

      {feature && (
        <Reveal className="section-top mt-10 sm:mt-14">
          <article className="group relative grid gap-x-12 gap-y-7 md:grid-cols-12">
            <div className="project-image aspect-[3/2] md:col-span-7">
              <Image
                src={feature.image}
                alt=""
                width={1344}
                height={896}
                priority
                sizes="(min-width: 1152px) 616px, (min-width: 768px) 58vw, 100vw"
              />
            </div>
            <div className="flex flex-col md:col-span-5">
              <h2 className="-mt-1 font-headline text-4xl leading-tight lg:text-5xl lg:leading-tight">
                <Link
                  href={`/projects/${feature.slug}`}
                  className="stretched-link"
                >
                  {feature.title}
                </Link>
              </h2>
              <p className="mt-4 max-w-[30ch] text-pretty text-xl leading-snug lg:text-2xl lg:leading-snug">
                {feature.summary}
              </p>
              <p aria-hidden="true" className="card-cue mt-6 md:mt-auto">
                View project
                <LinkArrow />
              </p>
            </div>
          </article>
        </Reveal>
      )}

      <ul
        className={`grid gap-x-10 gap-y-8 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-3 ${
          feature ? "mt-16 sm:mt-20" : "section-top mt-10 sm:mt-14"
        }`}
      >
        {rest.map((project, index) => (
          <li key={project.slug}>
            <Reveal delay={(index % 3) * 0.06}>
              <ProjectCard project={project} />
            </Reveal>
          </li>
        ))}
      </ul>

      <ClosingCta className="section-top mt-20 sm:mt-28" />
    </main>
  );
};

export default Projects;
