const { CMS_BASE_URL, CMS_API_TOKEN } = process.env;

export type Project = {
  date: string;
  title: string;
  summary: string;
  image: string;
  slug: string;
};

type ProjectsResponse = { items?: { fields: Project }[] };

// Every project, newest first.
export const fetchProjects = async (): Promise<Project[]> => {
  const url = `${CMS_BASE_URL}?select=fields&content_type=project&access_token=${CMS_API_TOKEN}`;
  const res = await fetch(url);
  const { items = [] } = (await res.json()) as ProjectsResponse;
  return items
    .map(({ fields }) => fields)
    .sort((lhs, rhs) => Date.parse(rhs.date) - Date.parse(lhs.date));
};

type PageResponse = { fields?: { title: string; body: string } };

// The markdown body of a page entry, such as the landing page's hero.
export const fetchPageBody = async (entryId: string): Promise<string> => {
  const url = `${CMS_BASE_URL}/${entryId}?access_token=${CMS_API_TOKEN}`;
  const res = await fetch(url);
  const { fields } = (await res.json()) as PageResponse;
  return fields?.body ?? "";
};
