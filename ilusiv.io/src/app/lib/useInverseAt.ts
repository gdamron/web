"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Whether a fixed element sits over an inverse-theme region (anything marked
// data-inverse), so it can take that region's palette. The offset is measured
// in pixels from the given viewport edge.
export const useInverseAt = (edge: "top" | "bottom", offset: number) => {
  const [inverse, setInverse] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const y = edge === "top" ? offset : window.innerHeight - offset;
      const regions = document.querySelectorAll("[data-inverse]");
      setInverse(
        Array.from(regions).some((region) => {
          const { top, bottom } = region.getBoundingClientRect();
          return top <= y && bottom > y;
        }),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [edge, offset, pathname]);

  return inverse;
};
