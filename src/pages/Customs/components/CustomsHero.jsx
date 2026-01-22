import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const customsData = [
    {
        id: 1,
        title: 'Import Clearance',
        description: 'Ports, containers, HS codes, VAT and duties.',
        image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 2,
        title: 'Export Formalities',
        description: 'Customs declarations and compliance.',
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 3,
        title: 'Transit Operations',
        description: 'Bonded transfers and T1/T2 documentation.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: 4,
        title: 'Advisory Services',
        description: 'Deep-dive audits and legal consulting.',
        image: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=1000'
    }
];

const CustomsHero = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % customsData.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <div className="w-full max-w-[1400px] mx-auto px-6 pt-32 pb-12" style={{ fontFamily: '"Segoe Variable Display", sans-serif' }}>

            <div className="mb-14 text-center">
                <h2 className="text-2xl md:text-4xl font-black text-[#1a1a1a] uppercase italic tracking-[0.25em]">
                    Customs Services
                </h2>
            </div>

            <div className="flex flex-col md:flex-row w-full h-[550px] md:h-[600px] gap-5 items-stretch overflow-hidden">
                {customsData.map((item, index) => {
                    const isActive = activeIndex === index;

                    return (
                        <motion.div
                            key={item.id}
                            onMouseEnter={() => {
                                setActiveIndex(index);
                                setIsPaused(true);
                            }}
                            onMouseLeave={() => setIsPaused(false)}
                            initial={{ flex: 1 }}
                            animate={{ flex: isActive ? 6 : 1 }}
                            transition={{
                                duration: 2.8,
                                ease: [0.16, 1, 0.3, 1],
                                delay: isActive ? 0 : 0.8
                            }}
                            className="relative overflow-hidden rounded-[50px] cursor-pointer bg-neutral-200 shadow-xl"
                        >
                            <motion.div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${item.image})` }}
                                animate={{
                                    scale: isActive ? 1.05 : 1.1,
                                    filter: isActive ? 'blur(0px)' : 'blur(2px)'
                                }}
                                transition={{ duration: 3.5 }}
                            />

                            <motion.div
                                className="absolute inset-0 bg-black"
                                animate={{ opacity: isActive ? 0.2 : 0.35 }}
                                transition={{ duration: 3.0 }}
                            />

                            <div className="absolute inset-0 flex flex-col justify-end p-6 overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {isActive && (
                                        <motion.div
                                            key={`content-${item.id}`}
                                            initial={{ opacity: 0, y: 50 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{
                                                opacity: 0,
                                                y: 100,
                                                transition: { duration: 0.6 }
                                            }}
                                            transition={{
                                                duration: 1.1,
                                                delay: 1.0,
                                                ease: [0.16, 1, 0.3, 1]
                                            }}
                                            /* ФОН ДЛЯ ТЕКСТА: Blur подложка */
                                            className="relative z-10 p-8 rounded-[35px] bg-black/20 backdrop-blur-md border border-white/10 max-w-[450px]"
                                        >
                                            <h3 className="text-2xl md:text-3xl font-black text-[#AD1C42] uppercase italic mb-3 tracking-tight">
                                                {item.title}
                                            </h3>
                                            <p className="text-white font-bold text-sm md:text-base uppercase leading-tight opacity-95">
                                                {item.description}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default CustomsHero;