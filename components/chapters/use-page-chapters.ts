"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export interface PageChapter {
  label: string;
  el: HTMLElement;
}

/** The `<Chapter>` wrappers on the current page, in document order (empty on pages without chapters). */
export function usePageChapters() {
  const pathname = usePathname();
  const [chapters, setChapters] = useState<PageChapter[]>([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setChapters(
        Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]")).map((el) => ({
          label: el.dataset.chapter ?? "",
          el,
        })),
      );
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return chapters;
}
