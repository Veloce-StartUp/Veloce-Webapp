'use client';
import React, { useState, useEffect } from 'react';
import { WavePath } from "@/components/ui/wave-path";
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// --- Text Arc Component ---
const CentralLogo = () => (
    <img
        src="https://res.cloudinary.com/druqq6b0a/image/upload/v1757878293/VELOCE_Digital_Company_Logo_2_worjb4.png"
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
                <motion.div
                    className="absolute pointer-events-none"
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: 'linear',
                    }}
                >
                    <TextArc text={text} diameter={diameter} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                >
                    <CentralLogo />
                </motion.div>
            </div>
        </div>
    );
};

// --- Main Wave Section ---
export default function WaveSection() {
    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden px-4 py-12 md:py-20">
            {/* Background effects */}
            <div
                aria-hidden="true"
                className={cn(
                    'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
                    'bg-[radial-gradient(ellipse_at_center,rgba(0,255,128,0.1),transparent_50%)]',
                    'blur-[30px]',
                )}
            />

            {/* Animated gradient elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-green-500/5 rounded-full blur-xl animate-pulse" />
                <div
                    className="absolute bottom-20 right-20 w-40 h-40 bg-green-400/5 rounded-full blur-2xl animate-pulse"
                    style={{ animationDelay: "2s" }}
                />
                <div
                    className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-600/5 rounded-full blur-lg animate-pulse"
                    style={{ animationDelay: "4s" }}
                />
            </div>

            <div className="flex w-full md:w-[70vw] flex-col items-center md:items-end z-10">
                {/* Wave path with green accent */}
                <div className="w-full mb-20">
                    <WavePath className="text-green-400 w-full" />
                </div>

                <div className="flex w-full flex-col items-center md:items-end">
                    <div className="flex flex-col md:flex-row items-center md:items-center md:justify-between w-full gap-6 md:gap-8">
                        {/* Text Arc Component */}
                        <div className="mb-12 md:mb-0 md:ml-16">
                            <TextArcEffect />
                        </div>

                        <p className="text-gray-300 text-center md:text-right text-xl md:text-2xl lg:text-4xl leading-relaxed max-w-2xl">
                            Transforming ideas into cutting-edge digital experiences.
                            Our solutions blend creativity with technology to build
                            the future today.
                        </p>
                    </div>
                </div>

                {/* Additional content */}
                <div className="mt-12 md:mt-16 w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl">
                    <div className="p-6 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-green-400/30 transition-all duration-300">
                        <h3 className="text-green-400 text-lg font-semibold mb-3">Web Development</h3>
                        <p className="text-gray-400">
                            Modern, responsive websites built with the latest technologies for optimal performance.
                        </p>
                    </div>

                    <div className="p-6 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-green-400/30 transition-all duration-300">
                        <h3 className="text-green-400 text-lg font-semibold mb-3">Mobile Applications</h3>
                        <p className="text-gray-400">
                            Native and cross-platform apps that deliver seamless experiences across all devices.
                        </p>
                    </div>

                    <div className="p-6 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-green-400/30 transition-all duration-300">
                        <h3 className="text-green-400 text-lg font-semibold mb-3">Cloud Solutions</h3>
                        <p className="text-gray-400">
                            Scalable infrastructure and services to power your business in the cloud era.
                        </p>
                    </div>
                </div>

                {/* Call to action */}
                {/*<button className="mt-8 md:mt-12 px-6 py-3 md:px-8 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25">*/}
                {/*    Explore Our Work*/}
                {/*</button>*/}
            </div>

            {/* Adding custom styles for font */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        
        .font-pixelated {
          font-family: 'VT323', monospace;
        }
      `}</style>
        </section>
    );
}