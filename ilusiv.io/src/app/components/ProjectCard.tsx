"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type ProjectCardProps = {
  title: string;
  slug: string;
  summary: string;
  image: string;
};

const ProjectCard = ({ title, slug, summary, image }: ProjectCardProps) => {
  const router = useRouter();

  return (
    <div
      className="rounded-lg overflow-scroll hover:border-accent border-transparent border-[1px] transition md:shadow-md hover:cursor-pointer"
      onClick={() => router.push(`/projects/${slug}`)}
    >
      <div className="h-48 overflow-hidden">
        <Image
          className="rounded-b-lg md:rounded-b-none w-full h-48 object-cover"
          src={image}
          alt={title}
          width={1920}
          height={1080}
        />
      </div>
      <div className="p-2 pt-4">
        <span>
          <h2 className="text-xl mb-2 font-semibold line-clamp-1">{title}</h2>
        </span>
        <p className="text-sm leading-relaxed line-clamp-4">{summary}</p>
        <div className="flex items-end justify-end h-6 pt-8">
          <p className="h-6 text-sm font-semibold text-accent px-1">more ›</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
