import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackArrow, ExternalArrow, LinkArrow } from "../../components/Arrow";
import ClosingCta from "../../components/ClosingCta";
import Markdown from "../../components/Markdown";
import ProjectCard from "../../components/ProjectCard";
import { fetchProject, fetchProjects } from "../../lib/cms";
import { hostname, leadSentences } from "../../lib/text";

export const revalidate = 60;

type Props = { params: { slug: string } };

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const project = await fetchProject(params.slug);
  return project ? { title: project.title, description: project.summary } : {};
};

const ProjectPage = async ({ params }: Props) => {
  const [project, projects] = await Promise.all([
    fetchProject(params.slug),
    fetchProjects(),
  ]);
  if (!project) notFound();

  const { title, image, date, body, summary, links = [] } = project;
  const year = date?.split("-")[0];

  // The three projects after this one, wrapping around at the end of the list.
  const others = projects.filter(({ slug }) => slug !== project.slug);
  const at = projects.findIndex(({ slug }) => slug === project.slug);
  const next = [0, 1, 2]
    .map((step) => others[(Math.max(at, 0) + step) % others.length])
    .filter((other, index, list) => other && list.indexOf(other) === index);

  return (
    <main id="content" className="page-column page-shell">
      <Link href="/projects" className="group text-link">
        <BackArrow />
        Work
      </Link>
      <h1 className="page-heading mt-8">{title}</h1>
      {summary && <p className="page-lede">{leadSentences(summary, 120)}</p>}

      {image && (
        <div className="project-image mt-10 aspect-[3/2] sm:mt-14 sm:aspect-[2/1] lg:aspect-[21/9]">
          <Image
            src={image}
            alt=""
            width={2304}
            height={1152}
            priority
            sizes="(min-width: 1152px) 1088px, 100vw"
          />
        </div>
      )}

      <div className="mt-10 grid gap-x-12 gap-y-8 sm:mt-14 lg:grid-cols-12">
        {(year || links.length > 0) && (
          <dl className="project-facts lg:order-last lg:col-span-3 lg:col-start-10">
            {year && (
              <div>
                <dt>Year</dt>
                <dd>{year}</dd>
              </div>
            )}
            {links.length > 0 && (
              <div>
                <dt>{links.length > 1 ? "Links" : "Link"}</dt>
                {links.map((href) => (
                  <dd key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link"
                    >
                      {hostname(href)}
                      <ExternalArrow />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </dd>
                ))}
              </div>
            )}
          </dl>
        )}
        <div className="prose-body lg:col-span-8">
          <Markdown source={body ?? ""} demoteHeadings />
        </div>
      </div>

      {next.length > 0 && (
        <section className="section-top mt-16 sm:mt-24">
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
            <h2 className="section-heading">More work</h2>
            <Link href="/projects" className="group text-link">
              More projects
              <LinkArrow />
            </Link>
          </div>
          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-3">
            {next.map((other) => (
              <li key={other.slug}>
                <ProjectCard project={other} level="h3" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <ClosingCta className="section-top mt-20 sm:mt-28" />
    </main>
  );
};

export const generateStaticParams = async () =>
  (await fetchProjects()).map(({ slug }) => ({ slug }));

export default ProjectPage;
