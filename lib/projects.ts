import {
  Award,
  Building2,
  ClipboardCheck,
  Leaf,
  ShoppingCart,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

export type ProjectStatus = "Live" | "In Development";

export interface ProjectHighlight {
  title: string;
  description: string;
}

export interface Project {
  /** URL segment used by /products/[slug] */
  slug: string;
  productName: string;
  title: string;
  /** Short copy used on the cards */
  description: string;
  /** Long copy used on the detail page */
  overview: string[];
  icon: LucideIcon;
  status: ProjectStatus;
  category: string;
  year: string;
  client?: string;
  /** Web / Android / iOS ... */
  platforms: string[];
  features: string[];
  highlights: ProjectHighlight[];
  techStack: string[];
  /** Cover image used on cards and at the top of the detail page */
  image: string;
  /** Screenshots shown in the detail page gallery */
  gallery: string[];
  color: string;
  url?: string;
  /** Shown on the landing page section */
  featured: boolean;
}

/**
 * Single source of truth for every project we showcase.
 * Images under /public/projects are placeholders — swap the file paths
 * (or overwrite the files) once the real screenshots are ready.
 */
export const projects: Project[] = [
  {
    slug: "digital-cssl-platform",
    productName: "Digital CSSL Platform",
    title: "Membership & Community Platform",
    description:
      "End-to-end digital platform for the Computer Society of Sri Lanka with a matching mobile app on Android and iOS.",
    overview: [
      "The Digital CSSL Platform is the online home of the Computer Society of Sri Lanka. It brings membership, events, payments and member communication into a single system that the CSSL team manages themselves.",
      "Alongside the web platform we built a companion mobile app, available on both Android and iOS, so members can carry their digital membership, register for events and follow announcements from their phone.",
    ],
    icon: Users,
    status: "Live",
    category: "Membership Platform",
    year: "2025",
    client: "Computer Society of Sri Lanka (CSSL)",
    platforms: ["Web", "Android", "iOS"],
    features: [
      "Membership Management",
      "Digital Membership Card",
      "Event Registration",
      "Online Payments",
      "Member Directory",
      "Push Notifications",
      "News & Announcements",
      "Admin Dashboard",
    ],
    highlights: [
      {
        title: "One platform, three surfaces",
        description:
          "A shared backend powers the public website, the member portal and the mobile app, so data stays consistent everywhere.",
      },
      {
        title: "Self-service membership",
        description:
          "Members apply, renew and pay online, while the secretariat approves and tracks everything from one dashboard.",
      },
      {
        title: "Mobile-first engagement",
        description:
          "Push notifications and the in-app digital membership card keep members connected between events.",
      },
    ],
    techStack: ["Next.js", "React Native", "Node.js", "PostgreSQL", "AWS"],
    image: "/Digital-CSSL.png",
    gallery: [
      // "/projects/digital-cssl-platform-1.svg",
      // "/projects/digital-cssl-platform-2.svg",
      // "/projects/digital-cssl-platform-3.svg",
    ],
    color: "from-emerald-600 to-teal-600",
    url: "https://www.cssl.lk",
    featured: true,
  },
  {
    slug: "nitc-2026",
    productName: "NITC 2026",
    title: "Conference & Registration Platform",
    description:
      "The official platform for the National IT Conference 2026, covering the event site, delegate registration and payments.",
    overview: [
      "NITC is Sri Lanka's flagship IT conference. For the 2026 edition we delivered the official conference platform: the public site with agenda, speakers and sponsors, plus the full registration and payment flow behind it.",
      "Organisers manage delegates, packages and reporting from an admin dashboard, while individual delegates and corporate groups register through flows built for each case.",
    ],
    icon: ClipboardCheck,
    status: "Live",
    category: "Event Platform",
    year: "2026",
    client: "Computer Society of Sri Lanka (CSSL)",
    platforms: ["Web"],
    features: [
      "Delegate Registration",
      "Corporate & Individual Packages",
      "Payment Integration",
      "Agenda & Speaker Management",
      "Sponsor Showcase",
      "Real-time Reporting",
      "Email Confirmations",
    ],
    highlights: [
      {
        title: "Built for conference peaks",
        description:
          "Registration handles the traffic spikes that come with early-bird deadlines and announcement days.",
      },
      {
        title: "Group registration done right",
        description:
          "Companies register multiple delegates under one invoice, with per-delegate details captured up front.",
      },
      {
        title: "Live organiser reporting",
        description:
          "The team sees registrations, payments and package breakdowns as they happen — no spreadsheets.",
      },
    ],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Payment Gateway", "AWS"],
    image: "/NITC-2026.png",
    gallery: [
      // "/projects/nitc-2026-1.svg",
      // "/projects/nitc-2026-2.svg",
      // "/projects/nitc-2026-3.svg",
    ],
    color: "from-blue-600 to-indigo-600",
    url: "https://www.nitc.lk",
    featured: true,
  },
  {
    slug: "digital-excellence-awards",
    productName: "DEX — Digital Excellence Awards",
    title: "Awards Submission & Judging Platform",
    description:
      "Awards platform that takes entries from submission through evaluation to final results, with a dedicated judging workspace.",
    overview: [
      "The Digital Excellence Awards (DEX) platform runs the full awards cycle online. Applicants create entries, upload supporting material and submit against the categories they qualify for.",
      "Judges get their own workspace with the entries assigned to them, structured scoring criteria and progress tracking, while the secretariat oversees categories, panels and results from the admin side.",
    ],
    icon: Trophy,
    status: "Live",
    category: "Awards Platform",
    year: "2026",
    client: "Digital Excellence Awards",
    platforms: ["Web"],
    features: [
      "Online Entry Submission",
      "Document & Media Uploads",
      "Category Management",
      "Judge Workspace",
      "Criteria-based Scoring",
      "Automated Result Calculation",
      "Applicant Portal",
    ],
    highlights: [
      {
        title: "Structured, auditable scoring",
        description:
          "Every score is tied to a defined criterion and judge, so results can be reviewed and defended.",
      },
      {
        title: "Panels without the paperwork",
        description:
          "Entries are distributed to judging panels automatically, with conflicts and progress tracked in one place.",
      },
      {
        title: "One submission journey",
        description:
          "Applicants save drafts, upload evidence and track their entry status from a single portal.",
      },
    ],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "AWS S3"],
    image: "/DEX-Judging-Platform.png",
    gallery: [
      // "/projects/digital-excellence-awards-1.svg",
      // "/projects/digital-excellence-awards-2.svg",
      // "/projects/digital-excellence-awards-3.svg",
    ],
    color: "from-amber-500 to-orange-600",
    // url: "https://www.digitalexcellenceawards.lk",
    url: "https://digital-excellence-awards-judging.onrender.com",
    featured: true,
  },
  {
    slug: "ovr-apartment-system",
    productName: "OVR Apartment System",
    title: "Apartment & Property Management System",
    description:
      "Management system for apartment operations — units, residents, billing, maintenance requests and common-area bookings.",
    overview: [
      "The OVR Apartment System digitises the day-to-day running of an apartment complex. Management keeps a live record of units, owners and tenants instead of chasing paper files.",
      "Residents raise maintenance requests, view their bills and book common amenities, while management handles billing cycles, visitor records and reporting from the admin console.",
    ],
    icon: Building2,
    status: "In Development",
    category: "Property Management",
    year: "2025",
    platforms: ["Web"],
    features: [
      "Unit & Resident Records",
      "Maintenance Requests",
      "Billing & Invoicing",
      "Payment Tracking",
      "Common Area Booking",
      "Visitor Management",
      "Notices & Announcements",
      "Management Reports",
    ],
    highlights: [
      {
        title: "Everything about a unit in one place",
        description:
          "Ownership, tenancy, billing history and open requests all sit against the unit record.",
      },
      {
        title: "Maintenance you can track",
        description:
          "Requests move through a clear status flow so residents know where things stand and nothing gets lost.",
      },
      {
        title: "Billing without the spreadsheets",
        description:
          "Recurring charges are generated per cycle, with payments and arrears tracked automatically.",
      },
    ],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
    image: "/projects/ovr-apartment-system.svg",
    gallery: [
      // "/projects/ovr-apartment-system-1.svg",
      // "/projects/ovr-apartment-system-2.svg",
      // "/projects/ovr-apartment-system-3.svg",
    ],
    color: "from-sky-600 to-cyan-600",
    featured: true,
  },
  {
    slug: "logic-leaf",
    productName: "Logic Leaf Technologies",
    title: "Corporate Website",
    description:
      "Corporate website for Logic Leaf Technologies, built for a fast, modern presentation of their services and brand.",
    overview: [
      "Logic Leaf Technologies needed a corporate site that matched the way they present themselves to clients: clean, fast and clear about what they do.",
      "We delivered a fully responsive marketing site with service and company sections, an enquiry flow that lands directly with their team, and an SEO-ready structure.",
    ],
    icon: Leaf,
    status: "Live",
    category: "Corporate Website",
    year: "2025",
    client: "Logic Leaf Technologies",
    platforms: ["Web"],
    features: [
      "Responsive Design",
      "Service Showcase",
      "Contact & Enquiry Flow",
      "SEO Optimised",
      "Performance Tuned",
      "Content Sections",
    ],
    highlights: [
      {
        title: "Fast by default",
        description:
          "Optimised assets and modern rendering keep the site quick on mobile connections.",
      },
      {
        title: "Built to be found",
        description:
          "Semantic structure, metadata and clean URLs give the site a solid SEO foundation.",
      },
      {
        title: "Enquiries that reach the team",
        description:
          "The contact flow delivers straight to the right inbox, with confirmation for the sender.",
      },
    ],
    techStack: ["Next.js", "Tailwind CSS", "GSAP", "SEO Optimization"],
    image: "/Logic-Leaf-Technologies.png",
    gallery: [
      // "/projects/logic-leaf-1.svg",
      // "/projects/logic-leaf-2.svg",
      // "/projects/logic-leaf-3.svg",
    ],
    color: "from-green-600 to-lime-600",
    url: "https://logicleaftechnologies.com",
    featured: false,
  },
  {
    slug: "bloodsmate",
    productName: "Bloodsmate",
    title: "E-Commerce Platform with Admin Dashboard",
    description:
      "Complete e-commerce solution with inventory management, secure payment processing, and customer analytics.",
    overview: [
      "Bloodsmate is a full e-commerce platform covering the storefront and the operations behind it — catalogue, inventory, checkout and fulfilment.",
      "The admin dashboard gives the team inventory control, order tracking and customer analytics in one place, so the store can be run without developer involvement.",
    ],
    icon: ShoppingCart,
    status: "Live",
    category: "E-Commerce",
    year: "2024",
    platforms: ["Web"],
    features: [
      "Inventory Management",
      "Secure Payment Processing",
      "Customer Analytics",
      "Order Tracking",
      "Admin Dashboard",
    ],
    highlights: [
      {
        title: "Storefront and back office together",
        description:
          "Customer-facing store and the admin dashboard share one system, so stock and orders stay in sync.",
      },
      {
        title: "Secure checkout",
        description:
          "Payments run through an integrated gateway with proper handling of the sensitive parts of the flow.",
      },
      {
        title: "Analytics that inform stock",
        description:
          "Sales and customer data feed straight into inventory decisions.",
      },
    ],
    techStack: ["Next.js", "Node.js", "MongoDB", "Payment Gateway"],
    image: "/bloodsmate.png",
    gallery: [
      "/projects/bloodsmate-1.svg",
      "/projects/bloodsmate-2.svg",
      "/projects/bloodsmate-3.svg",
    ],
    color: "from-green-600 to-emerald-600",
    url: "https://www.bloodsmate.com",
    featured: true,
  },
  {
    slug: "nitc-2025",
    productName: "NITC 2025",
    title: "Registration Platform",
    description:
      "Comprehensive event registration system with attendee management and real-time reporting capabilities.",
    overview: [
      "The NITC 2025 platform handled registration for the National IT Conference, from individual delegates to corporate groups.",
      "Organisers managed attendees, payments and badge printing from a single dashboard, with real-time reporting throughout the run-up to the event.",
    ],
    icon: ClipboardCheck,
    status: "Live",
    category: "Event Platform",
    year: "2025",
    client: "Computer Society of Sri Lanka (CSSL)",
    platforms: ["Web"],
    features: [
      "Attendee Management",
      "Real-time Reporting",
      "Payment Integration",
      "Badge Printing",
      "Company and Individual Registration",
    ],
    highlights: [
      {
        title: "Two registration paths",
        description:
          "Individual and corporate registrations are handled through flows suited to each, under one system.",
      },
      {
        title: "Badges straight from the data",
        description:
          "Attendee records generate print-ready badges, removing manual preparation before the event.",
      },
      {
        title: "Reporting in real time",
        description:
          "Registration and payment figures were available to organisers at any moment.",
      },
    ],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Payment Gateway"],
    image: "/NITC-2025.png",
    gallery: [
      "/projects/nitc-2025-1.svg",
      "/projects/nitc-2025-2.svg",
      "/projects/nitc-2025-3.svg",
    ],
    color: "from-blue-600 to-indigo-600",
    url: "https://www.nitc.lk",
    featured: false,
  },
  {
    slug: "cssl-awards",
    productName: "CSSL Awards & Innovation Hub",
    title: "Judging Platform",
    description:
      "Specialized platform for competition management with scoring systems and judge coordination tools.",
    overview: [
      "The CSSL Awards & Innovation Hub platform runs competitions end to end — from participant entries through judging to final results.",
      "Administrators create competitions with their own categories and criteria, assign judges, and let the platform handle scoring and result calculation.",
    ],
    icon: Award,
    status: "Live",
    category: "Awards Platform",
    year: "2024",
    client: "Computer Society of Sri Lanka (CSSL)",
    platforms: ["Web"],
    features: [
      "Scoring System",
      "Judge Coordination",
      "Result Calculation",
      "Participant Portal",
      "Custom Competition Creation",
    ],
    highlights: [
      {
        title: "Competitions on demand",
        description:
          "New competitions, categories and scoring criteria are configured by admins without code changes.",
      },
      {
        title: "Coordinated judging",
        description:
          "Judges see only their assigned entries, with progress visible to the organisers.",
      },
      {
        title: "Results without manual tallying",
        description:
          "Scores roll up automatically into category results.",
      },
    ],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
    image: "/CSSL-Awards.png",
    gallery: [
      "/projects/cssl-awards-1.svg",
      "/projects/cssl-awards-2.svg",
      "/projects/cssl-awards-3.svg",
    ],
    color: "from-purple-600 to-pink-600",
    url: "https://www.awards.cssl.lk",
    featured: true,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export const projectCategories = [
  "All",
  ...Array.from(new Set(projects.map((project) => project.category))),
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getRelatedProjects(slug: string, limit = 3): Project[] {
  const current = getProjectBySlug(slug);
  const others = projects.filter((project) => project.slug !== slug);

  if (!current) return others.slice(0, limit);

  const sameCategory = others.filter(
    (project) => project.category === current.category,
  );
  const rest = others.filter((project) => project.category !== current.category);

  return [...sameCategory, ...rest].slice(0, limit);
}
