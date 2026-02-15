"use client";

import Image from "next/image";
import Link from "next/link";

const clients = [
  {
    name: "CSSL",
    logo: "/cssl-logo.png",
    website: "https://cssl.lk",
    alt: "Computer Society of Sri Lanka",
  },
  {
    name: "NITC",
    logo: "/NITC-logo.png",
    website: "https://nitc.lk",
    alt: "National IT Conference",
  },
  {
    name: "FITIS",
    logo: "/fitis-logo.svg",
    website: "https://fitis.lk",
    alt: "Federation of Information Technology Industry Sri Lanka",
  },
  {
    name: "DIGITAL EXCELLENCE AWARDS",
    logo: "/digital-excellence-logo.svg",
    website: "https://www.digitalexcellenceawards.lk",
    alt: "Digital Excellence Awards",
  },
  {
    name: "Clayton Family Medical Centre",
    logo: "/clayton-family-medical-centre.png",
    website: "https://claytonfmc.com.au/",
    alt: "Clayton Family Medical Centre",
  },
];

export function ClientsSection() {
  return (
    <section className="py-20 bg-black relative overflow-hidden border-b border-white/5">
      <div className="container mx-auto px-4 mb-12 relative z-20">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance text-white">
            We Work With <span className="text-green-400">The Best</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto text-pretty">
            Proud to partner with leading organizations innovation.
          </p>
        </div>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden z-20">
        {/* Gradient Masks for Fade Effeect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 z-20 bg-gradient-to-r from-black to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 z-20 bg-gradient-to-l from-black to-transparent" />

        {/* Marquee Track */}
        <div className="flex w-max animate-infinite-scroll hover:pause">
          {/* First set of items */}
          <div className="flex items-center gap-8 md:gap-16 px-4 md:px-8 z-50">
            {clients.map((client, index) => (
              <ClientCard key={`client-1-${index}`} client={client} />
            ))}
          </div>
          {/* Duplicate set for seamless looping */}
          <div
            className="flex items-center gap-8 md:gap-16 px-4 md:px-8 z-50"
            aria-hidden="true"
          >
            {clients.map((client, index) => (
              <ClientCard key={`client-2-${index}`} client={client} />
            ))}
          </div>
          {/* Triplicate set for wide screens to ensure no gaps */}
          <div
            className="flex items-center gap-8 md:gap-16 px-4 md:px-8 z-50"
            aria-hidden="true"
          >
            {clients.map((client, index) => (
              <ClientCard key={`client-3-${index}`} client={client} />
            ))}
          </div>
        </div>
      </div>

      {/* Inline styles for the animation if not in globals.css */}
      <style jsx>{`
        @keyframes infinite-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.33%); /* Move 1/3 since we have 3 sets */
          }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

function ClientCard({ client }: { client: (typeof clients)[0] }) {
  return (
    <Link
      href={client.website}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex-shrink-0"
    >
      <div className="w-48 h-28 md:w-64 md:h-36 bg-black border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center transition-all duration-300 group-hover:border-green-500/50 group-hover:shadow-[0_0_20px_-5px_rgba(74,222,128,0.2)]">
        {/* White background container for logo properly */}
        <div className="relative w-full h-full bg-white rounded-lg p-3 flex items-center justify-center overflow-hidden">
          <Image
            src={client.logo}
            alt={client.alt}
            fill
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>

      {/* Tooltip-like text on hover */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-green-400 text-sm font-medium">
        {client.name}
      </div>
    </Link>
  );
}
