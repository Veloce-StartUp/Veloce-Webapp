import Image from "next/image";
import type { ProjectApp } from "@/lib/projects";
import { cn } from "@/lib/utils";

/** Apple's and Google's official badge artwork, shown at the same height as their guidelines ask. */
const badges = [
  { store: "appStore", src: "/badges/app-store.svg", width: 120, height: 40, action: "Download", label: "the App Store" },
  { store: "googlePlay", src: "/badges/google-play.png", width: 134, height: 40, action: "Get", label: "Google Play" },
] as const;

/** Links an app's store listings with the official badges. */
export function StoreBadges({ app, className }: { app: ProjectApp; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {badges.map((badge) => {
        const href = app[badge.store];
        if (!href) return null;
        return (
          <a
            key={badge.store}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg transition-[filter] duration-300 hover:drop-shadow-[0_0_14px_rgba(74,222,128,0.45)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-400"
          >
            {/* Served as-is: the artwork is tiny, and resizing would round it off its aspect ratio. */}
            <Image
              src={badge.src}
              alt={`${badge.action} ${app.name} on ${badge.label}`}
              width={badge.width}
              height={badge.height}
              unoptimized
              className="h-10 w-auto"
            />
          </a>
        );
      })}
    </div>
  );
}
