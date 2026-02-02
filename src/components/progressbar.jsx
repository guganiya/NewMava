import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Progressbar = ({ onComplete, ready = false }) => {
    const [progress, setProgress] = useState(0)
    const [isDone, setIsDone] = useState(false)

    // --- Логика прогресса ---
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
            const t = setTimeout(onComplete, 2200) // Даем время насладиться финалом
            return () => clearTimeout(t)
        }
    }, [isDone, onComplete])

    const dashOffset = 1 - progress / 100

    /**
     * ГЕОМЕТРИЯ M (Модифицированная):
     * Наклон стоек увеличен (левая вправо, правая влево).
     * Все нижние точки строго на Y=180.
     * Центральный пик на Y=135.
     * Верхние пики на Y=50.
     */
    const PATH_D = `
    M 145 180 
    L 205 50 
    L 260 135 
    L 315 50 
    L 375 180
  `

    return (
        <motion.div
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(15px)' }}
            transition={{ duration: 1.4, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* --- АРТ-ФОН --- */}
            {/* Тонкая сетка координат */}
            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}
            />

            {/* Виньетка и глубина */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_80%)]" />

            {/* Контейнер элементов */}
            <div className="relative w-full max-w-[650px] flex flex-col items-center px-6">

                {/* ВЕРХНИЙ БЛОК: СТАТУС */}
                <div className="h-10 mb-10 flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                        {!isDone ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center"
                            >
                                <div className="flex gap-4 items-center">
                                    <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#ad1c42]" />
                                    <span className="text-[9px] font-bold tracking-[0.8em] text-[#ad1c42] uppercase">Processing</span>
                                    <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#ad1c42]" />
                                </div>
                                <motion.span className="text-[11px] font-mono mt-2 text-white/40 tabular-nums">
                                    SYS_AUTH_SEQ: {Math.round(progress)}%
                                </motion.span>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-[10px] font-bold tracking-[1em] text-white uppercase py-1 px-4 border-x border-white/20"
                            >
                                Protocol Established
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* СРЕДНИЙ БЛОК: SVG ЛОГОТИП */}
                <div className="relative w-full flex items-center justify-center scale-110">
                    <svg viewBox="0 0 520 220" className="w-full h-auto overflow-visible">
                        <defs>
                            {/* Сложный фильтр свечения */}
                            <filter id="ultra-glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feFlood floodColor="white" floodOpacity="0.5" result="color" />
                                <feComposite in="color" in2="blur" operator="in" result="glow" />
                                <feMerge>
                                    <feMergeNode in="glow" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            {/* Линейный градиент для обводки */}
                            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ad1c42" stopOpacity="0.2" />
                                <stop offset="50%" stopColor="#fff" stopOpacity="1" />
                                <stop offset="100%" stopColor="#ad1c42" stopOpacity="0.2" />
                            </linearGradient>
                        </defs>

                        {/* 1. ПРИЗРАЧНЫЙ СКЕЛЕТ (Тень формы) */}
                        <path
                            d={PATH_D}
                            fill="none"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeOpacity="0.03"
                            strokeLinecap="butt"
                            strokeLinejoin="round"
                        />

                        {/* 2. АНИМИРОВАННЫЙ ПУЛЬСИРУЮЩИЙ КОНТУР */}
                        <motion.path
                            d={PATH_D}
                            fill="none"
                            stroke="url(#line-grad)"
                            strokeWidth="2.5"
                            strokeLinecap="butt"
                            strokeLinejoin="round"
                            pathLength="1"
                            strokeDasharray="1"
                            strokeDashoffset={dashOffset}
                            animate={isDone ? {
                                strokeWidth: 10,
                                filter: "url(#ultra-glow)",
                            } : {
                                strokeWidth: 2.5,
                            }}
                            transition={{
                                strokeWidth: { duration: 0.8, ease: "circOut" },
                            }}
                        />

                        {/* 3. СКАНЕР (Проходит сквозь лого в конце) */}
                        <AnimatePresence>
                            {isDone && (
                                <motion.path
                                    d={PATH_D}
                                    fill="none"
                                    stroke="#ad1c42"
                                    strokeWidth="12"
                                    strokeOpacity="0"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: [0, 1], opacity: [0, 0.4, 0] }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    filter="blur(8px)"
                                />
                            )}
                        </AnimatePresence>

                        {/* 4. ТОЧКИ СОЕДИНЕНИЯ (Креативные узлы) */}
                        <AnimatePresence>
                            {isDone && (
                                <g>
                                    {[
                                        { x: 145, y: 180 }, { x: 205, y: 50 },
                                        { x: 260, y: 135 }, { x: 315, y: 50 }, { x: 375, y: 180 }
                                    ].map((p, i) => (
                                        <motion.circle
                                            key={i}
                                            cx={p.x} cy={p.y} r="3"
                                            fill="white"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: i * 0.1 + 0.5 }}
                                        />
                                    ))}
                                </g>
                            )}
                        </AnimatePresence>
                    </svg>
                </div>

                {/* НИЖНИЙ БЛОК: ТЕКСТ */}
                <div className="mt-16 flex flex-col items-center">
                    <div className="relative overflow-hidden py-2 px-10">
                        <motion.h1
                            initial={{ y: "100%", opacity: 0 }}
                            animate={isDone ? { y: 0, opacity: 1 } : {}}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="text-6xl font-[1000] tracking-[0.3em] text-white italic"
                        >
                            MAVA
                        </motion.h1>
                        {/* Декоративная линия под текстом */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={isDone ? { scaleX: 1 } : {}}
                            transition={{ duration: 1.5, delay: 0.6 }}
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ad1c42] to-transparent"
                        />
                    </div>

                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0em" }}
                        animate={isDone ? { opacity: 0.4, letterSpacing: "1.2em" } : {}}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="text-[8px] uppercase font-bold text-white mt-6 translate-x-[0.6em]"
                    >
                        Logistics Intelligence
                    </motion.p>
                </div>
            </div>

            {/* ФИНАЛЬНЫЙ СВЕТОВОЙ ИМПУЛЬС */}
            <AnimatePresence>
                {isDone && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: [0, 0.15, 0], scale: [0.8, 1.2] }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 bg-[#ad1c42] pointer-events-none rounded-full blur-[150px]"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default Progressbar