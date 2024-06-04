import Markdown from "./components/Markdown";

const { CMS_BASE_URL, CMS_API_TOKEN } = process.env;
const ABOUT_ENTITY_ID = `dtMEs39juy5zPeh31pwxy`;

type HomePageResponse = {
  fields: {
    title: string;
    body: string;
  };
};

const Home = async () => {
  const url = `${CMS_BASE_URL}/${ABOUT_ENTITY_ID}?access_token=${CMS_API_TOKEN}`;
  const cmsRes = await fetch(url);
  const { fields } = (await cmsRes.json()) as HomePageResponse;
  const { body } = fields;

  return (
    <main>
      <div className="flex justify-center">
        <div className="py-16 px-8 sm:w-4/5 md:w-3/5 lg:w-1/2">
          <Markdown source={body} />
        </div>
      </div>
    </main>
  );
};

export default Home;
