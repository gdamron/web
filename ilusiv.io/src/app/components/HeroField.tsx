"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const FlowField = dynamic(() => import("./FlowField"), { ssr: false });

// The hero's moving background, with a control to hold it still for anyone
// who finds motion beside text distracting.
const HeroField = () => {
  const [paused, setPaused] = useState(false);

  return (
    <>
      <div className="hero-field absolute inset-0 -z-10" aria-hidden="true">
        <FlowField paused={paused} />
      </div>
      {/* Not offered under reduced motion, where the field is already still. */}
      <div className="page-column absolute inset-x-0 bottom-4 motion-reduce:hidden">
        <button
          type="button"
          onClick={() => setPaused(!paused)}
          className="-mx-2 flex items-center gap-2 px-2 py-2 text-sm text-muted hover:text-primary"
        >
          <svg
            viewBox="0 0 12 12"
            className="h-2.5 w-2.5 fill-current"
            aria-hidden="true"
          >
            {paused ? (
              <path d="M2 1l9 5-9 5z" />
            ) : (
              <path d="M2 1h3v10H2zM7 1h3v10H7z" />
            )}
          </svg>
          {paused ? "Resume motion" : "Pause motion"}
        </button>
      </div>
    </>
  );
};

export default HeroField;
