import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Progressbar = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isDone, setIsDone] = useState(false);
    const [isResourcesLoaded, setIsResourcesLoaded] = useState(false);

    useEffect(() => {
        const handleLoad = () => setIsResourcesLoaded(true);
        if (document.readyState === 'complete') handleLoad();
        else window.addEventListener('load', handleLoad);

        // Плавная логика прогресса
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (isResourcesLoaded) {
                    // Асимптотическое приближение к 100 для идеальной плавности
                    const diff = 100 - prev;
                    if (diff < 0.1) {
                        clearInterval(timer);
                        setTimeout(() => setIsDone(true), 150);
                        return 100;
                    }
                    return prev + diff * 0.12;
                }
                // Пока не загружено, медленно ползем, создавая видимость работы
                return prev < 92 ? prev + 0.3 : prev;
            });
        }, 25);

        return () => {
            window.removeEventListener('load', handleLoad);
            clearInterval(timer);
        };
    }, [isResourcesLoaded]);

    useEffect(() => {
        if (isDone && onComplete) {
            // Время экспозиции логотипа перед входом на сайт
            const timeout = setTimeout(onComplete, 2000);
            return () => clearTimeout(timeout);
        }
    }, [isDone, onComplete]);

    return (
        <motion.div
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-[#020202] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Глубокий фон: Зернистость + Мягкий виньет */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black opacity-60" />

            <div className="relative w-full max-w-[500px] flex flex-col items-center scale-[0.9] sm:scale-100">

                {/* Статус-текст */}
                <div className="h-6 mb-6 overflow-hidden">
                    <AnimatePresence mode="wait">
                        {!isDone ? (
                            <motion.div
                                key="loading-status"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 0.4, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-white text-[9px] font-medium tracking-[0.6em] uppercase tabular-nums"
                            >
                                Establishing Route — {Math.round(progress)}%
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 0.8, y: 0 }}
                                className="text-white text-[9px] font-medium tracking-[0.6em] uppercase"
                            >
                                Connection Secured
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* SVG Контейнер */}
                <div className="relative w-full flex items-center justify-center">
                    <svg viewBox="0 0 400 200" className="w-full h-full">
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Призрачный скелет */}
                        <path
                            d="M 100,160 L 100,40 L 200,130 L 300,40 L 300,160"
                            stroke="white" strokeWidth="1" fill="none" strokeOpacity="0.03"
                        />

                        {/* Анимированный путь */}
                        <motion.path
                            d={isDone
                                ? "M 100,160 L 100,40 L 200,130 L 300,40 L 300,160"
                                : "M 80,150 L 80,50 L 200,130 L 320,50 L 320,150"}
                            fill="none"
                            stroke="white"
                            strokeWidth={isDone ? "12" : "1.8"}
                            strokeDasharray="600"
                            strokeDashoffset={600 - (progress / 100) * 600}
                            filter={isDone ? "url(#glow)" : "none"}
                            animate={{
                                d: isDone
                                    ? "M 100,160 L 100,40 L 200,130 L 300,40 L 300,160"
                                    : "M 80,150 L 80,50 L 200,130 L 320,50 L 320,150",
                                strokeWidth: isDone ? 12 : 1.8,
                                opacity: isDone ? 1 : 0.8
                            }}
                            transition={{
                                d: { type: "spring", stiffness: 35, damping: 14 },
                                strokeWidth: { duration: 0.5, ease: "circOut" },
                                strokeDashoffset: { duration: 0.1 }
                            }}
                        />
                    </svg>
                </div>

                {/* Брендинг MAVA */}
                <div className="mt-10 relative flex flex-col items-center">
                    <motion.h1
                        initial={{ opacity: 0, letterSpacing: "1.5em", filter: "blur(12px)" }}
                        animate={isDone ? { opacity: 1, letterSpacing: "0.6em", filter: "blur(0px)" } : {}}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-white text-5xl font-black ml-[0.6em]"
                    >
                        MAVA
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isDone ? { opacity: 0.25 } : {}}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-white text-[8px] uppercase tracking-[0.9em] mt-4"
                    >
                        Logistics Intelligence
                    </motion.p>
                </div>
            </div>

            {/* Финальная вспышка */}
            <AnimatePresence>
                {isDone && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.05, 0] }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 bg-white pointer-events-none"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Progressbar;