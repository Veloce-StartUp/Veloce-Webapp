import { Facebook, Instagram, Linkedin, type LucideIcon } from "lucide-react";

export interface SocialProfile {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Veloce's social profiles: footer, the left-hand social rail and the page's structured data. */
export const socialProfiles: SocialProfile[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/veloce-technology",
    icon: Linkedin,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/VeloceTechnology/",
    icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/veloce.technology",
    icon: Instagram,
  },
];
