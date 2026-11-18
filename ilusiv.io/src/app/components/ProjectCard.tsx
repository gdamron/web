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
// card is the link.
const ProjectCard = ({ project, level: Title = "h2" }: ProjectCardProps) => {
  const { slug, title, summary, image } = project;
  return (
    <article className="group relative">
      <div className="project-image aspect-[3/2]">
        <Image
          src={image}
          alt=""
          width={768}
          height={512}
          sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 100vw"
        />
      </div>
      <Title className="mt-5 font-headline text-2xl leading-tight">
        <Link href={`/projects/${slug}`} className="stretched-link">
          {title}
        </Link>
      </Title>
      {summary && (
        <p className="mt-3 line-clamp-4 text-pretty leading-relaxed">
          {leadSentences(summary, 180)}
        </p>
      )}
    </article>
  );
};

export default ProjectCard;
