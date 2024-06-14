import Markdown from "../components/Markdown";
import ProjectCard from "../components/ProjectCard";

const { CMS_BASE_URL, CMS_API_TOKEN } = process.env;
const ENTITY_ID = `7jKlxkgJnCHErdjBN1JLdT`;

export const revalidate = 60;

type ProjectsResponse = {
  items: {
    fields: {
      title: string;
      summary: string;
      image: string;
      slug: string;
    };
  }[];
};

const Projects = async () => {
  const projectsUrl = `${CMS_BASE_URL}?select=fields&content_type=project&access_token=${CMS_API_TOKEN}`;
  const projectsRes = await fetch(projectsUrl);
  const { items: projects } = (await projectsRes.json()) as ProjectsResponse;

  return (
    <main>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-16 px-8 sm:w-4/5 md:w-3/4 lg:w-3/5">
          {projects.map(({ fields: { title, summary, image, slug } }) => (
            <ProjectCard
              image={image}
              title={title}
              summary={summary}
              slug={slug}
              key={slug}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Projects;
