import Markdown from "../components/Markdown";

const { CMS_BASE_URL, CMS_API_TOKEN } = process.env;
const ABOUT_ENTITY_ID = `3OXmFbfeto0KIAIIn4LWfP`;

type AboutPageResponse = {
  fields: {
    title: string;
    body: string;
  };
};

export default async function About() {
  const url = `${CMS_BASE_URL}/${ABOUT_ENTITY_ID}?access_token=${CMS_API_TOKEN}`;
  const cmsRes = await fetch(url);
  const { fields } = (await cmsRes.json()) as AboutPageResponse;
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
}
