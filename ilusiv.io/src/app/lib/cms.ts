const { CMS_BASE_URL, CMS_API_TOKEN } = process.env;

// Fetches from the content API. A failed or malformed response yields
// undefined, so a page renders without that content instead of failing.
const fetchContent = async <T>(path: string): Promise<T | undefined> => {
  try {
    const res = await fetch(`${CMS_BASE_URL}${path}`, {
      headers: { Authorization: `Bearer ${CMS_API_TOKEN}` },
    });
    if (!res.ok) throw new Error(`Content request failed: ${res.status}`);
    return (await res.json()) as T;
  } catch (error) {
    console.error("Unable to load content", error);
    return undefined;
  }
};

export type Project = {
  date: string;
  title: string;
  summary?: string;
  image: string;
  slug: string;
  // External URLs for the project, such as its own website.
  links?: string[];
  // Contentful tag ids, such as "hero" or "featured".
  tags: string[];
};

type TagLink = { sys: { id: string } };

type ProjectsResponse = {
  items?: {
    fields: Omit<Project, "tags">;
    metadata?: { tags?: TagLink[] };
  }[];
};

// Every project, newest first.
export const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetchContent<ProjectsResponse>(
    "?select=fields,metadata&content_type=project",
  );
  return (response?.items ?? [])
    .map(({ fields, metadata }) => ({
      ...fields,
      tags: (metadata?.tags ?? []).map(({ sys }) => sys.id),
    }))
    .sort((lhs, rhs) => Date.parse(rhs.date) - Date.parse(lhs.date));
};

type PageResponse = { fields?: { title: string; body: string } };

// The markdown body of a page entry, such as the landing page's hero.
export const fetchPageBody = async (entryId: string): Promise<string> => {
  const response = await fetchContent<PageResponse>(`/${entryId}`);
  return response?.fields?.body ?? "";
};

export type List = {
  title: string;
  description: string;
  items: { title: string; body: string }[];
};

type ListResponse = { fields?: Partial<List> };

// A titled list of short items, such as the services on the landing page.
export const fetchList = async (entryId: string): Promise<List> => {
  const response = await fetchContent<ListResponse>(`/${entryId}`);
  return {
    title: response?.fields?.title ?? "",
    description: response?.fields?.description ?? "",
    items: response?.fields?.items ?? [],
  };
};
