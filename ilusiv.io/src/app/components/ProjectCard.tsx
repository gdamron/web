import Image from "next/image";
import Link from "next/link";
import type { Project } from "../lib/cms";
import { leadSentences } from "../lib/text";

type ProjectCardProps = {
  project: Pick<Project, "slug" | "title" | "summary" | "image">;
  // The heading level that fits where the card sits.
  level?: "h2" | "h3";
};

// A project as an image, its title and the start of its summary. The whole
// card is the link. On a phone it is a row with a small image, so a list of
// them stays short.
const ProjectCard = ({ project, level: Title = "h2" }: ProjectCardProps) => {
  const { slug, title, summary, image } = project;
  return (
    <article className="group relative grid grid-cols-[6.5rem_1fr] gap-x-4 sm:block">
      <div className="project-image aspect-square self-start sm:aspect-[3/2]">
        <Image
          src={image}
          alt=""
          width={768}
          height={512}
          sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 104px"
        />
      </div>
      <div>
        <Title className="font-headline text-xl leading-tight sm:mt-5 sm:text-2xl sm:leading-tight">
          <Link href={`/projects/${slug}`} className="stretched-link">
            {title}
          </Link>
        </Title>
        {summary && (
          <p className="mt-2 line-clamp-2 text-pretty leading-relaxed sm:mt-3 sm:line-clamp-4">
            {leadSentences(summary, 180)}
          </p>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
