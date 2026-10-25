import type { ReactNode } from "react";

interface ChapterProps {
  /** Name shown in the chapter index and on the scroll ruler. */
  label: string;
  children: ReactNode;
}

/** Groups sections into a named chapter for the scroll index and ruler. */
export function Chapter({ label, children }: ChapterProps) {
  return (
    <div data-chapter={label} className="relative">
      {children}
    </div>
  );
}
