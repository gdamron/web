import Image from "next/image";
import IlusivImage from "../../components/IlusivImage";
import IlusivH1 from "../../components/IlusivH1";
import Markdown from "../../components/Markdown";
import IlusivQuote from "../../components/IlusivQuote";

const { CMS_BASE_URL, CMS_API_TOKEN } = process.env;

export const revalidate = 60;

type ProjectResponse = {
  items: {
    fields: {
      title: string;
      image: string;
      body: string;
      date: string;
    };
  }[];
};

const ProjectPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const slugQuery = `fields.slug=${slug}`;
  const selectQuery = `select=fields&content_type=project&access_token=${CMS_API_TOKEN}`;
  const projectUrl = `${CMS_BASE_URL}?${slugQuery}&${selectQuery}`;
  const projectRes = await fetch(projectUrl);
  const { items } = (await projectRes.json()) as ProjectResponse;

  const {
    fields: { title, image, date, body },
  } = items[0];

  return (
    <main>
      <div className="flex justify-center">
        <div className="py-12 px-8 sm:w-4/5 md:w-3/4 lg:w-3/5">
          <IlusivImage src={image} alt={title} />
          <div className="pt-4">
            <IlusivH1>
              <span className="md:text-5xl">{title}</span>
            </IlusivH1>
          </div>
          <Markdown source={body} />
          <IlusivQuote>{date.split("-")[0]}</IlusivQuote>
        </div>
      </div>
    </main>
  );
};

export default ProjectPage;
