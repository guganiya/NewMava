import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const steps = [
    {
        id: '01',
        title: 'Request',
        description: 'Client sends cargo details and destination.',
        image: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: '02',
        title: 'Documents Review',
        description: 'HS codes, invoices, certificates validation.',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: '03',
        title: 'Declaration',
        description: 'Customs declaration submission & control.',
        image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: '04',
        title: 'Inspection',
        description: 'Physical inspection if required.',
        image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=1000'
    },
    {
        id: '05',
        title: 'Release',
        description: 'Cargo released and delivered.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000'
    }
];

const CustomsProcess = () => {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section
            ref={containerRef}
            className="py-24 bg-white overflow-hidden w-full relative"
            style={{ fontFamily: '"Segoe Variable Display", sans-serif' }}
        >
            <div className="max-w-7xl mx-auto px-6">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-32"
                >
                    <h2 className="text-2xl md:text-4xl font-black text-[#1a1a1a] uppercase italic tracking-[0.2em]">
                        Clearance Process
                    </h2>
                </motion.div>

                <div className="relative">
                    {/* Линии */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-[3px] bg-neutral-100 -translate-x-1/2 hidden md:block rounded-full" />
                    <motion.div
                        style={{ scaleY }}
                        className="absolute left-1/2 top-0 bottom-0 w-[3px] bg-[#AD1C42] -translate-x-1/2 hidden md:block origin-top rounded-full z-10"
                    />

                    {steps.map((step, index) => {
                        const isEven = index % 2 === 1;

                        return (
                            <div key={step.id} className="relative mb-32 last:mb-0">
                                <div className={`flex flex-col md:flex-row items-center justify-between gap-12 md:gap-32 ${isEven ? 'md:flex-row-reverse' : ''}`}>

                                    {/* Текст с тенями */}
                                    <motion.div
                                        initial={{ opacity: 0, x: isEven ? 60 : -60 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: false, amount: 0.4 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className={`w-full md:w-1/2 
        ${isEven ? 'md:text-left md:pl-16' : 'md:text-right md:pr-16'}`}
                                        /* Применяем фильтр ко всему текстовому контейнеру */
                                        style={{ filter: 'drop-shadow(-15px 15px 20px rgba(0,0,0,0.3))' }}
                                    >
    <span className="text-[#AD1C42] font-black text-lg italic mb-2 block">
        {step.id}
    </span>
                                        <h3 className="text-2xl md:text-3xl font-black text-[#1a1a1a] uppercase italic mb-4 tracking-tight leading-none">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-400 font-bold text-sm md:text-base uppercase leading-snug max-w-xs inline-block">
                                            {step.description}
                                        </p>
                                    </motion.div>

                                    {/* Круг */}
                                    <motion.div
                                        initial={{ backgroundColor: "#AD1C42", scale: 0.8 }}
                                        whileInView={{ backgroundColor: "#AD1C42", scale: 1.1 }}
                                        viewport={{ once: false, amount: 0.8 }}
                                        className="absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full hidden md:block z-20 border-[3px] border-white shadow-md"
                                    />

                                    {/* Фото с запрашиваемой тенью */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, x: isEven ? -60 : 60 }}
                                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                                        viewport={{ once: false, amount: 0.4 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="w-full md:w-[45%]"
                                        /* Применяем drop-shadow фильтр здесь */
                                        style={{ filter: 'drop-shadow(-30px 30px 40px rgba(0,0,0,0.5))' }}
                                    >
                                        <div className="rounded-[30px] overflow-hidden bg-neutral-100 aspect-[16/10]">
                                            <img
                                                src={step.image}
                                                alt={step.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CustomsProcess;