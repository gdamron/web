import Markdown from "../components/Markdown";

const { CMS_BASE_URL, CMS_API_TOKEN } = process.env;
const ENTITY_ID = `7jKlxkgJnCHErdjBN1JLdT`;

export const revalidate = 60;

type ProjectsPageResponse = {
  fields: {
    title: string;
    body: string;
  };
};

const Projects = async () => {
  const url = `${CMS_BASE_URL}/${ENTITY_ID}?access_token=${CMS_API_TOKEN}`;
  const cmsRes = await fetch(url);
  const { fields } = (await cmsRes.json()) as ProjectsPageResponse;
  const { body } = fields;

  return (
    <main>
      <div className="flex justify-center">
        <div className="py-16 px-8 sm:w-4/5 md:w-3/4 lg:w-3/5">
          <Markdown source={body} />
        </div>
      </div>
    </main>
  );
};

export default Projects;
