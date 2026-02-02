import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Progressbar = ({ onComplete, ready = false }) => {
    const [progress, setProgress] = useState(0)
    const [isDone, setIsDone] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (!ready) return prev < 94 ? prev + 0.35 : prev
                const diff = 100 - prev
                if (diff < 0.1) {
                    clearInterval(timer)
                    setTimeout(() => setIsDone(true), 150)
                    return 100
                }
                return prev + diff * 0.12
            })
        }, 20)
        return () => clearInterval(timer)
    }, [ready])

    useEffect(() => {
        if (isDone && onComplete) {
            const t = setTimeout(onComplete, 2800)
            return () => clearTimeout(t)
        }
    }, [isDone, onComplete])

    const dashOffset = 1 - progress / 100

    const points = {
        L_BOT: { x: 145, y: 180 },
        L_TOP: { x: 205, y: 50 },
        CENTER: { x: 260, y: 180 },
        R_TOP: { x: 315, y: 50 },
        R_BOT: { x: 375, y: 180 }
    }

    const PATH_D = `M ${points.L_BOT.x} ${points.L_BOT.y} L ${points.L_TOP.x} ${points.L_TOP.y} L ${points.CENTER.x} ${points.CENTER.y} L ${points.R_TOP.x} ${points.R_TOP.y} L ${points.R_BOT.x} ${points.R_BOT.y}`

    return (
        <motion.div
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(15px)' }}
            transition={{ duration: 1.4, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* СЕТКА */}
            <div className="absolute inset-0 opacity-[0.05]"
                 style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_80%)]" />

            <div className="relative w-full max-w-[650px] flex flex-col items-center px-6">

                {/* STATUS */}
                <div className="h-10 mb-10">
                    <AnimatePresence mode="wait">
                        {!isDone ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                                <div className="flex gap-4 items-center">
                                    <span className="w-12 h-[1px] bg-[#ad1c42]" />
                                    <span className="text-[9px] font-bold tracking-[0.8em] text-[#ad1c42] uppercase">Processing</span>
                                    <span className="w-12 h-[1px] bg-[#ad1c42]" />
                                </div>
                                <motion.span className="text-[11px] font-mono mt-2 text-white/40">{Math.round(progress)}%</motion.span>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[10px] font-bold tracking-[1em] text-white uppercase py-1 px-4 border-x border-white/20">
                                Protocol Established
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* LOGO С ПУЛЬСАЦИЕЙ И ИЗЛУЧЕНИЕМ */}
                <div className="relative w-full flex items-center justify-center scale-110">
                    <svg viewBox="0 0 520 220" className="w-full h-auto overflow-visible">
                        <defs>
                            <filter id="neon-glow-main" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3.5" result="blur" />
                                <feFlood floodColor="white" floodOpacity="1" result="color" />
                                <feComposite in="color" in2="blur" operator="in" result="glow" />
                                <feMerge>
                                    <feMergeNode in="glow" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* 1. БУКВА М (ПРЕЖНИЙ ДИЗАЙН + ПУЛЬСАЦИЯ) */}
                        <motion.path
                            d={PATH_D}
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            pathLength="1"
                            strokeDasharray="1"
                            strokeDashoffset={dashOffset}
                            animate={isDone ? {
                                strokeWidth: [4, 5, 4],
                                filter: ['url(#neon-glow-main)', 'url(#neon-glow-main)', 'url(#neon-glow-main)'],
                                opacity: [0.5, 0.5, 0.5]
                            } : {}}
                            transition={isDone ? {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            } : {}}
                        />

                        {/* 2. СВЕТЯЩИЕСЯ ЛИНИИ (ИЗЛУЧЕНИЕ СВЕТА) */}
                        <AnimatePresence>
                            {isDone && (
                                <g>
                                    {/* 1. ГЛУБОКОЕ ФОНОВОЕ ИЗЛУЧЕНИЕ (Ambient Light) */}
                                    {/* Это создает пятно света на "стене" за логотипом */}
                                    <g filter="blur(40px)">
                                        {[
                                            { p1: points.L_TOP, p2: points.R_TOP, d: 0 },
                                            { p1: points.L_BOT, p2: points.CENTER, d: 0.2 },
                                            { p1: points.CENTER, p2: points.R_BOT, d: 0.4 }
                                        ].map((line, i) => (
                                            <motion.line
                                                key={`glow-${i}`}
                                                x1={line.p1.x + 15} y1={line.p1.y}
                                                x2={line.p2.x - 15} y2={line.p2.y}
                                                stroke="white"
                                                strokeWidth="25" // Очень широкое освещение
                                                strokeLinecap="round"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0.3, 0.3, 0.3, 0.3, 0.3] }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 2 + i,
                                                    ease: "easeInOut"
                                                }}
                                            />
                                        ))}
                                    </g>

                                    {/* 2. СРЕДНЕЕ СВЕЧЕНИЕ (Halo) */}
                                    {/* Ореол вокруг самой трубки */}
                                    <g filter="blur(8px)">
                                        {[
                                            { p1: points.L_TOP, p2: points.R_TOP, d: 0 },
                                            { p1: points.L_BOT, p2: points.CENTER, d: 0.2 },
                                            { p1: points.CENTER, p2: points.R_BOT, d: 0.4 }
                                        ].map((line, i) => (
                                            <motion.line
                                                key={`halo-${i}`}
                                                x1={line.p1.x + 15} y1={line.p1.y}
                                                x2={line.p2.x - 15} y2={line.p2.y}
                                                stroke="white"
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0.3, 0.3, 0.3, 0.3, 0.3] }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 0.5 + Math.random(),
                                                    delay: line.d
                                                }}
                                            />
                                        ))}
                                    </g>

                                    {/* 3. САМИ ТРУБКИ (Core) */}
                                    {/* Ядро лампы, которое мерцает как "сдыхающее" */}
                                    <g filter="url(#neon-glow-main)">
                                        {[
                                            { p1: points.L_TOP, p2: points.R_TOP, d: 0 },
                                            { p1: points.L_BOT, p2: points.CENTER, d: 0.2 },
                                            { p1: points.CENTER, p2: points.R_BOT, d: 0.4 }
                                        ].map((line, i) => (
                                            <motion.line
                                                key={`core-${i}`}
                                                x1={line.p1.x + 15} y1={line.p1.y}
                                                x2={line.p2.x - 15} y2={line.p2.y}
                                                stroke="white"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0, opacity: 0 }}
                                                animate={{
                                                    pathLength: 1,
                                                    opacity: [0.3, 0.3, 0.3, 0.3, 0.3], // Мерцание ядра
                                                }}
                                                transition={{
                                                    pathLength: { duration: 0.8, delay: line.d },
                                                    opacity: {
                                                        repeat: Infinity,
                                                        duration: 0.15 + Math.random() * 0.3,
                                                        ease: "steps(4)" // Делает мерцание дерганым, как у плохой лампы
                                                    }
                                                }}
                                            />
                                        ))}
                                    </g>
                                </g>
                            )}
                        </AnimatePresence>

                        {/* КРАСНЫЙ СКАНЕР */}
                        <AnimatePresence>
                            {isDone && (
                                <motion.path
                                    d={PATH_D} fill="none" stroke="#ad1c42" strokeWidth="10"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: [0, 1], opacity: [0, 0.4, 0] }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    filter="blur(8px)"
                                />
                            )}
                        </AnimatePresence>
                    </svg>
                </div>

                {/* БРЕНДИНГ */}
                <div className="mt-16 flex flex-col items-center">
                    <div className="relative overflow-hidden py-2 px-10">
                        <motion.h1
                            initial={{ y: "100%", opacity: 0 }}
                            animate={isDone ? { y: 0, opacity: 1 } : {}}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="text-6xl md:text-7xl font-black tracking-[0.3em] text-white italic uppercase"
                        >
                            MAVA
                        </motion.h1>
                        <motion.div initial={{ scaleX: 0 }} animate={isDone ? { scaleX: 1 } : {}} transition={{ duration: 1.5, delay: 0.6 }} className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ad1c42]" />
                    </div>
                    <motion.p initial={{ opacity: 0 }} animate={isDone ? { opacity: 0.4 } : {}} transition={{ duration: 1.5, delay: 0.8 }} className="text-[8px] uppercase font-bold text-white mt-6 tracking-[1.2em] translate-x-[0.6em]">
                        Logistics Intelligence
                    </motion.p>
                </div>
            </div>
        </motion.div>
    )
}

export default Progressbar