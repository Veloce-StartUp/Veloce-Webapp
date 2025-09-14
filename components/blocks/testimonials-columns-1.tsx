"use client";
import React from "react";
import { motion } from "motion/react";

export const TestimonialsColumn = (props: {
    className?: string;
    testimonials: typeof testimonials;
    duration?: number;
}) => {
    return (
        <div className={props.className}>
            <motion.div
                animate={{
                    translateY: "-50%",
                }}
                transition={{
                    duration: props.duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6"
            >
                {[
                    ...new Array(2).fill(0).map((_, index) => (
                        <React.Fragment key={index}>
                            {props.testimonials.map(({ text, image, name, role }, i) => (
                                <div
                                    className="p-6 rounded-xl border border-gray-800 bg-gray-900/80 backdrop-blur-sm shadow-lg shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-300 hover:border-green-500/30 max-w-xs w-full"
                                    key={i}
                                >
                                    <div className="text-gray-300 text-sm leading-relaxed">{text}</div>
                                    <div className="flex items-center gap-3 mt-4">
                                        <img
                                            width={40}
                                            height={40}
                                            src={image}
                                            alt={name}
                                            className="h-10 w-10 rounded-full border-2 border-green-500/30"
                                        />
                                        <div className="flex flex-col">
                                            <div className="font-medium text-white text-sm tracking-tight leading-5">{name}</div>
                                            <div className="text-green-400 text-xs leading-5 opacity-80 tracking-tight">{role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </React.Fragment>
                    )),
                ]}
            </motion.div>
        </div>
    );
};