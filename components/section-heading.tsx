import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: string;
  icon?: LucideIcon;
  align?: "center" | "left";
  as?: "h1" | "h2";
  className?: string;
}

/** Section title block: optional glass eyebrow, split-line heading and a fading description. */
export function SectionHeading({
  title,
  description,
  eyebrow,
  icon: Icon,
  align = "center",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mb-14 md:mb-20",
        centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow && (
        <div data-reveal="fade" className={cn("mb-6 flex", centered && "justify-center")}>
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-green-300">
            {Icon ? (
              <Icon className="h-3.5 w-3.5" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_10px_2px_rgba(74,222,128,0.7)]" />
            )}
            {eyebrow}
          </span>
        </div>
      )}

      <Heading
        data-split
        className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl"
      >
        {title}
      </Heading>

      {description && (
        <p
          data-reveal
          className={cn(
            "mt-6 text-pretty text-lg leading-relaxed text-gray-300 md:text-xl",
            centered && "mx-auto max-w-2xl",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
