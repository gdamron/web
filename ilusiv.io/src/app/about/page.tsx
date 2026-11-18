import type { Metadata } from "next";
import Image from "next/image";
import ClosingCta from "../components/ClosingCta";
import Markdown from "../components/Markdown";
import { fetchPage } from "../lib/cms";

const ENTRY_ID = "3OXmFbfeto0KIAIIn4LWfP";

export const revalidate = 60;

export const metadata: Metadata = { title: "About" };

const About = async () => {
  const { body, image } = await fetchPage(ENTRY_ID);
  // Failing here keeps the last good page in place when content is missing.
  if (!body) throw new Error("The about page's content is unavailable");

  return (
    <main id="content" className="page-column page-shell">
      <h1 className="page-heading">About</h1>
      <div className="section-top mt-10 grid items-start gap-x-12 gap-y-10 sm:mt-14 md:grid-cols-12">
        {image && (
          <div className="project-image aspect-[4/5] w-full max-w-[12rem] md:sticky md:top-24 md:col-span-4 md:max-w-none">
            <Image
              src={image}
              alt=""
              width={768}
              height={960}
              priority
              sizes="(min-width: 1152px) 340px, (min-width: 768px) 33vw, 192px"
            />
          </div>
        )}
        <div
          className={`prose-body ${
            image ? "md:col-span-7 md:col-start-6" : "md:col-span-12"
          }`}
        >
          <Markdown source={body} demoteHeadings />
        </div>
      </div>
      <ClosingCta className="section-top mt-20 sm:mt-28" />
    </main>
  );
};

export default About;
