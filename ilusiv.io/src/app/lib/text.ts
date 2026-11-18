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
