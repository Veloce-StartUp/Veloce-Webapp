import { socialProfiles } from "@/lib/social";

/** Fixed social links on the left edge (wide desktop), reachable from anywhere on the page. */
export function SocialRail() {
  return (
    <nav
      aria-label="Social media"
      data-splash-quiet
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 min-[1400px]:flex"
    >
      <span aria-hidden="true" className="h-16 w-px bg-gradient-to-b from-transparent to-white/25" />
      <span className="rotate-180 font-mono text-[10px] uppercase tracking-[0.3em] text-gray-400 [writing-mode:vertical-rl]">
        Follow us
      </span>
      <div className="glass flex flex-col gap-1 rounded-full p-1.5">
        {socialProfiles.map((profile) => {
          const Icon = profile.icon;
          return (
            <a
              key={profile.label}
              href={profile.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Veloce on ${profile.label}`}
              title={profile.label}
              className="flex h-10 w-10 items-center justify-center rounded-full text-gray-300 transition-colors duration-300 hover:bg-green-500/15 hover:text-green-300 focus-visible:outline-2 focus-visible:outline-green-400"
            >
              <Icon className="h-4 w-4" />
            </a>
          );
        })}
      </div>
      <span aria-hidden="true" className="h-16 w-px bg-gradient-to-t from-transparent to-white/25" />
    </nav>
  );
}
