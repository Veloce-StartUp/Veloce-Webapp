"use client";

import Image from "next/image";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { SectionHeading, type HeadingLevel } from "@/components/section-heading";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  location?: string;
  experience?: string;
  skills: string[];
  social: { linkedin?: string; twitter?: string; github?: string; email?: string };
}

const teamMembers: TeamMember[] = [
  {
    name: "Yohan Athukorala",
    role: "CEO & Founder",
    bio: "Passionate about building scalable systems and leading high-performing teams.",
    image: "/yohan-athukorala.png",
    location: "Colombo, Sri Lanka",
    experience: "12+ years",
    skills: [
      "Leadership",
      "Strategy",
      "Product Vision",
      "Full-Stack",
      "DevOps",
      "AI/ML",
    ],
    social: {
      linkedin: "https://www.linkedin.com/in/yohan-athukorala/",
      github: "https://github.com/YohanNayanajith",
      email: "yohannayanajith40@gmail.com",
    },
  },
  {
    name: "Kumud Perera",
    role: "CTO",
    bio: "Full-stack architect with expertise in distributed systems.",
    image: "/kumud-perera.png",
    location: "Colombo, Sri Lanka",
    experience: "15+ years",
    skills: ["UI/UX", "Backend", "Architecture", "DevOps"],
    social: {
      linkedin: "https://www.linkedin.com/in/kumud-perera-4559801a0/",
      github: "#",
      email: "nethmalperera54@gmail.com",
    },
  },
  {
    name: "Salomi Franciscus",
    role: "QA Engineer",
    bio: "Makes sure every release is reliable, secure and ready for real users before it ships.",
    image: "/Salomi-Franciscus.jpeg",
    skills: [
      "Manual Testing",
      "Test Automation",
      "Regression Testing",
      "Bug Tracking",
    ],
    social: {
      linkedin: "#",
    },
  },
];

/** Only links that go somewhere ("#" placeholders are skipped). */
function socialLinks(social: TeamMember["social"]) {
  const links = [
    { label: "LinkedIn", href: social.linkedin, icon: Linkedin },
    { label: "Twitter", href: social.twitter, icon: Twitter },
    { label: "GitHub", href: social.github, icon: Github },
    { label: "Email", href: social.email ? `mailto:${social.email}` : undefined, icon: Mail },
  ];
  return links.filter((link) => link.href && link.href !== "#");
}

export function TeamSection({ headingAs }: { headingAs?: HeadingLevel }) {
  return (
    <section id="team" className="relative py-24 md:py-32">
      <div className="container relative z-20 mx-auto px-4">
        <SectionHeading
          as={headingAs}
          title={
            <>
              Meet Our <span className="text-gradient-green">Team</span>
            </>
          }
          description="Talented individuals from diverse backgrounds united by a passion for innovation and excellence."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <article
              key={member.name}
              data-reveal
              data-tilt="5"
              className="glass spotlight group flex flex-col overflow-hidden rounded-[1.75rem]"
            >
              {/* Profile Image */}
              <div className="relative m-2 h-72 overflow-hidden rounded-[1.25rem] md:h-96">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/15 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                {/* Social links: always visible on touch, slide up on hover with a mouse */}
                <div className="absolute inset-x-4 bottom-4 flex justify-center gap-2 transition-all duration-500 [@media(hover:hover)]:translate-y-4 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
                  {socialLinks(member.social).map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        target={link.label === "Email" ? undefined : "_blank"}
                        rel="noopener noreferrer"
                        aria-label={`${member.name} on ${link.label}`}
                        className="glass flex h-10 w-10 items-center justify-center rounded-full text-gray-200 transition-colors hover:border-green-400/50 hover:bg-green-600 hover:text-white"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6 pt-4">
                <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-green-300">
                  {member.name}
                </h3>
                <p className="mb-3 font-medium text-green-400">{member.role}</p>
                <p className="text-sm leading-relaxed text-gray-300">{member.bio}</p>

                <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-xs text-gray-200 transition-colors duration-300 group-hover:border-green-400/25 group-hover:text-green-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
