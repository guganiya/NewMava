import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CompactMorphM = () => {
    const [progress, setProgress] = useState(0);
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => setIsDone(true), 150);
                    return 100;
                }
                return prev + 1;
            });
        }, 20);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-black overflow-hidden"
             style={{ fontFamily: "'Segoe UI Variable Display', 'Segoe UI', system-ui, sans-serif" }}>

            {/* Контейнер с ограничением ширины */}
            <div className="relative flex flex-col items-center w-full max-w-[600px] px-10">

                {/* Цифра: вплотную к бару */}
                <div className="h-8 flex items-end justify-center">
                    <AnimatePresence>
                        {!isDone && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-white text-2xl font-medium tracking-tight mb-[-40px]"
                            >
                                {progress}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative w-full aspect-[3/1] flex items-center justify-center">
                    <svg width="100%" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid meet">
                        {/* Анимация превращения из бара в M */}
                        <motion.path
                            d={isDone
                                ? "M 120,130 L 120,30 L 200,100 L 280,30 L 280,130"
                                : "M 0,100 L 0,60 L 200,60 L 400,60 L 400,100 L 0,100"
                            }
                            fill="transparent"
                            stroke="white"
                            strokeWidth={isDone ? "16" : "2"}
                            strokeLinejoin="round"
                            strokeLinecap="square"
                            animate={{
                                d: isDone
                                    ? "M 120,130 L 120,30 L 200,100 L 280,30 L 280,130"
                                    : "M 0,100 L 0,60 L 200,60 L 400,60 L 400,100 L 0,100"
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 110,
                                damping: 18,
                                strokeWidth: { duration: 0.2 }
                            }}
                        />

                        {/* Белая заливка прогресса */}
                        {!isDone && (
                            <motion.rect
                                x="3"
                                y="63"
                                height="34"
                                fill="white"
                                initial={{ width: 0 }}
                                animate={{ width: `${(progress / 100) * 394}` }}
                                transition={{ ease: "linear" }}
                            />
                        )}
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default CompactMorphM;