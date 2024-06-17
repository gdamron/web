import Markdown from "../components/Markdown";
import ProjectCard from "../components/ProjectCard";

const { CMS_BASE_URL, CMS_API_TOKEN } = process.env;

export const revalidate = 60;

type ProjectsResponse = {
  items: {
    fields: {
      date: string;
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
  const { items } = (await projectsRes.json()) as ProjectsResponse;
  const projects = items.sort(
    (lhs, rhs) => Date.parse(rhs.fields.date) - Date.parse(lhs.fields.date),
  );

  return (
    <main>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12 px-8 sm:w-4/5 md:w-3/4 lg:w-3/5">
          {projects.map(({ fields: { date, title, summary, image, slug } }) => (
            <ProjectCard
              date={date}
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
