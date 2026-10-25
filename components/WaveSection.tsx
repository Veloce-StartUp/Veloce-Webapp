'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Cloud, Globe, Smartphone } from 'lucide-react';
import { WavePath } from "@/components/ui/wave-path";
import { gsap, playWhileVisible, ScrollTrigger, useGSAP } from '@/lib/gsap';

const STATEMENT =
    "Transforming ideas into cutting-edge digital experiences. Our solutions blend creativity with technology to build the future today.";

/** Words that land in green once the statement lights up. */
const EMPHASIS = new Set(["cutting-edge", "digital", "experiences.", "future", "today."]);

const pillars = [
    {
        icon: Globe,
        title: "Web Development",
        description: "Modern, responsive websites built with the latest technologies for optimal performance.",
    },
    {
        icon: Smartphone,
        title: "Mobile Applications",
        description: "Native and cross-platform apps that deliver seamless experiences across all devices.",
    },
    {
        icon: Cloud,
        title: "Cloud Solutions",
        description: "Scalable infrastructure and services to power your business in the cloud era.",
    },
];

// --- Text Arc Component ---
const CentralLogo = () => (
    <img
        src="https://res.cloudinary.com/druqq6b0a/image/upload/f_auto,q_auto,w_192/v1757878293/VELOCE_Digital_Company_Logo_2_worjb4.png"
        alt="Logo"
        className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover shadow-lg"
        onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src='https://placehold.co/96x96/27272a/ffffff?text=Logo';
        }}
    />
);

const TextArc = ({ text, diameter = 200 }: { text: string; diameter?: number }) => {
    const characters = text.split('');
    const radius = diameter / 2;
    const angleStep = 360 / characters.length;

    return (
        <div className="relative" style={{ width: diameter, height: diameter }}>
            {characters.map((char, index) => {
                const angle = angleStep * index;
                const charStyle = {
                    position: 'absolute' as const,
                    height: `${radius}px`,
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: 'bottom center',
                    top: 0,
                    left: '50%',
                    marginLeft: '-0.5em',
                };

                return (
                    <div key={index} style={charStyle}>
            <span className="text-base md:text-lg font-bold font-pixelated text-green-300/90">
              {char}
            </span>
                    </div>
                );
            })}
        </div>
    );
};

const TextArcEffect = () => {
    const text = " BUILD • TOMORROW • TODAY •";
    const [diameter, setDiameter] = useState(260);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setDiameter(180);
            } else {
                setDiameter(260);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex items-center justify-center w-full">
            <div className="relative flex items-center justify-center">
                <div className="text-arc absolute pointer-events-none">
                    <TextArc text={text} diameter={diameter} />
                </div>

                <div className="glass flex items-center justify-center rounded-full p-3 shadow-[0_0_60px_-10px_rgba(74,222,128,0.6)] transition-transform duration-500 hover:rotate-6 hover:scale-110">
                    <CentralLogo />
                </div>
            </div>
        </div>
    );
};

// --- Main Wave Section ---
export default function WaveSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            // Words brighten one by one as the statement scrolls through the viewport.
            gsap.fromTo(
                '.statement-word',
                { opacity: 0.14 },
                {
                    opacity: 1,
                    ease: 'none',
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: '.statement',
                        start: 'top 85%',
                        end: 'bottom 45%',
                        scrub: true,
                    },
                },
            );

            // The arc spins steadily, faster while the page is scrolling.
            const spin = gsap.to('.text-arc', { rotate: 360, duration: 20, ease: 'none', repeat: -1 });
            playWhileVisible(spin, sectionRef.current!);
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'bottom top',
                onUpdate: (self) => {
                    const boost = Math.min(Math.abs(self.getVelocity()) / 200, 8);
                    gsap.to(spin, { timeScale: 1 + boost, duration: 0.2, overwrite: true });
                    gsap.to(spin, { timeScale: 1, duration: 1.4, delay: 0.25, ease: 'power2.out' });
                },
            });
        },
        { scope: sectionRef },
    );

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden px-4 py-24 text-white md:py-32">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,255,128,0.04),transparent_60%)] blur-[30px]"
            />

            <div className="container relative z-10 mx-auto lg:w-[70vw] lg:max-w-none">
                {/* Wave path with green accent: across the full width of the section, shorter on phones */}
                <div className="mb-16 w-full md:mb-24">
                    <WavePath className="mx-auto w-[70%] text-green-400 md:w-full" />
                </div>

                <div className="grid items-center gap-14 lg:grid-cols-[auto_1fr] lg:gap-20">
                    <div data-reveal="scale" className="mx-auto lg:ml-10">
                        <TextArcEffect />
                    </div>

                    <p className="statement text-balance text-center text-3xl font-medium leading-tight tracking-tight md:text-5xl lg:text-right lg:text-[3.4rem]">
                        {STATEMENT.split(' ').map((word, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && ' '}
                                <span
                                    className={`statement-word inline-block ${EMPHASIS.has(word) ? 'text-gradient-green' : 'text-white'}`}
                                >
                                    {word}
                                </span>
                            </React.Fragment>
                        ))}
                    </p>
                </div>

                <div className="mt-20 grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
                    {pillars.map((pillar) => {
                        const Icon = pillar.icon;
                        return (
                            <div key={pillar.title} data-reveal className="glass spotlight group rounded-3xl p-6 md:p-8">
                                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-green-400/25 bg-green-500/10 text-green-400 transition-transform duration-500 group-hover:scale-110">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="mb-3 text-lg font-semibold text-green-400">{pillar.title}</h3>
                                <p className="text-gray-300">{pillar.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
