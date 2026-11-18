import { fetchProjects } from "../lib/cms";
import ProjectCard from "../components/ProjectCard";

export const revalidate = 60;

const Projects = async () => {
  const projects = await fetchProjects();

  return (
    <main>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 pt-24 md:grid-cols-2 gap-8 py-12 px-8 max-w-4xl sm:w-4/5 md:w-3/4 lg:w-3/5">
          {projects.map(({ date, title, summary, image, slug }) => (
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
