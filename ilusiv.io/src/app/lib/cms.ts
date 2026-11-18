const { CMS_BASE_URL, CMS_API_TOKEN } = process.env;

// Fetches from the content API, and throws when the request fails. A page
// whose own content this is lets that through: a failed refresh then keeps
// the last good copy of the page instead of caching an empty one.
const requireContent = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${CMS_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${CMS_API_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Content request failed: ${res.status}`);
  return (await res.json()) as T;
};

// The same, for content a page can do without: a failure yields undefined.
const fetchContent = async <T>(path: string): Promise<T | undefined> => {
  try {
    return await requireContent<T>(path);
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
  // Markdown for the project's own page.
  body?: string;
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

// One project by its slug, or undefined when there is none. Throws when the
// content API cannot say either way.
export const fetchProject = async (
  slug: string,
): Promise<Project | undefined> => {
  const response = await requireContent<ProjectsResponse>(
    `?select=fields,metadata&content_type=project&fields.slug=${encodeURIComponent(slug)}`,
  );
  const item = response.items?.[0];
  if (!item) return undefined;
  return {
    ...item.fields,
    tags: (item.metadata?.tags ?? []).map(({ sys }) => sys.id),
  };
};

export type Page = {
  title: string;
  body: string;
  // A line that introduces the page, shown under its heading.
  summary?: string;
  image?: string;
};

type PageResponse = { fields?: Partial<Page> };

// A page entry: markdown with a title and, for some pages, a summary or an
// image. Throws
// when the content API fails.
export const fetchPage = async (entryId: string): Promise<Page> => {
  const response = await requireContent<PageResponse>(`/${entryId}`);
  return {
    title: response.fields?.title ?? "",
    body: response.fields?.body ?? "",
    summary: response.fields?.summary,
    image: response.fields?.image,
  };
};

// The markdown body of a page entry, such as the landing page's hero.
export const fetchPageBody = async (entryId: string): Promise<string> =>
  (await fetchPage(entryId)).body;

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
