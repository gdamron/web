// Draft copy for the landing page below the hero. It lives here while the layout settles;
// each export maps onto a Contentful entry once the wording is agreed.

// The hero's headline and text come from the Contentful home entry; only the
// label beside the play button lives here.
export const hero = {
  entryId: "dtMEs39juy5zPeh31pwxy",
  track: {
    title: "Music Box",
    caption: "A Fugue invention, generated live in your browser.",
  },
};

export const fugue = {
  heading: "Fugue",
  lede: "A music creation tool for pieces that play themselves.",
  body: "You describe a piece as an invention: voices, rules and the connections between them. Fugue performs it, a little differently every time. The music on this page is one of them.",
  source: { label: "Fugue on GitHub", href: "https://github.com/gdamron/fugue" },
  notes: { label: "Read the project notes", path: "/projects/fugue" },
  diaries: {
    label: "The Fugue Diaries",
    path: "/fugue-diaries",
    note: "Notes on building Fugue and composing with it.",
  },
};

export const consulting = {
  heading: "Consulting",
  body: "ilusiv is also where Grant takes on client work, as a hands-on engineer or as an interim engineering lead. Most of it falls into four kinds of project.",
  areas: [
    {
      name: "Creator tools",
      text: "Software that helps other people make things: music engines, authoring tools, editors and the pipelines behind them.",
    },
    {
      name: "Zero to one",
      text: "Taking an idea to a product people can use, then building the team and process that keep it moving.",
    },
    {
      name: "Legacy systems",
      text: "Getting to know the system everyone else is afraid to touch, documenting it and charting a way to maintain, upgrade or replace it.",
    },
    {
      name: "Tech debt",
      text: "Paying down the loan a product took out to ship, without stopping the work that pays the bills.",
    },
  ],
};

export const work = {
  heading: "Recent work",
  count: 4,
};

export const contact = {
  heading: "Have something that needs building?",
  body: "Tell me what you're working on and where it's stuck.",
  action: "Start a conversation",
};

export const links = {
  linkedin: "https://linkedin.com/in/grantdamron",
  github: "https://github.com/gdamron",
};
