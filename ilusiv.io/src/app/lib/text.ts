// The opening sentences of a passage that fit within a character budget, so a
// teaser ends on a full stop instead of being cut mid-sentence. Always keeps
// at least the first sentence.
export const leadSentences = (text: string, budget: number): string => {
  const sentences = text.trim().split(/(?<=[.!?])\s+/);
  let lead = sentences[0] ?? "";
  for (const sentence of sentences.slice(1)) {
    if (lead.length + 1 + sentence.length > budget) break;
    lead += ` ${sentence}`;
  }
  return lead;
};

// "https://www.example.com/path" reads as "example.com" in a link label.
export const hostname = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

// "Getting Started" becomes "getting-started", for a heading's anchor.
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");

// Markdown reduced to its words, for comparing passages: links become their
// labels, and emphasis marks and extra spaces are dropped.
export const plainText = (markdown: string): string =>
  markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
