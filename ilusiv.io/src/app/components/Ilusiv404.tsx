import Link from "next/link";
import { BackArrow } from "./Arrow";

const Ilusiv404 = () => {
  return (
    <main id="content" className="page-column page-shell">
      <h1 className="page-heading">{"That's a 404"}</h1>
      <p className="mt-6 text-xl sm:text-2xl">(Cue sad trumpet sound)</p>
      <p className="mt-10">
        <Link href="/" className="group text-link">
          <BackArrow />
          Back to the start
        </Link>
      </p>
    </main>
  );
};

export default Ilusiv404;
