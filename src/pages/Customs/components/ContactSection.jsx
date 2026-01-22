import React from 'react';
import { motion } from 'framer-motion';

const ContactSection = () => {
    return (
        <section className="py-16 bg-white mb-20" style={{ fontFamily: '"Segoe Variable Display", sans-serif' }}>
            <div className="max-w-5xl mx-auto px-6">

                {/* Уменьшенный контейнер с меньшим padding (p-10 вместо p-16) */}
                <div className="bg-white rounded-[40px] p-10 md:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-neutral-50 text-center">

                    {/* Заголовок: уменьшен до 3xl */}
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-3xl font-black text-[#1a1a1a] uppercase italic mb-4 tracking-tight"
                    >
                        Need Customs Clearance?
                    </motion.h2>

                    {/* Описание: уменьшен шрифт до самого мелкого */}
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 font-bold text-[10px] md:text-[11px] uppercase tracking-[0.2em] mb-10 max-w-lg mx-auto leading-relaxed"
                    >
                        Get a professional consultation and calculate customs clearance time and cost for your cargo.
                    </motion.p>

                    {/* Кнопки: стали более компактными */}
                    <div className="flex flex-wrap justify-center gap-4">

                        <button
                            className="group relative bg-[#AD1C42] text-white px-8 py-4 rounded-full font-black uppercase italic tracking-widest text-[11px] transition-all active:scale-95 shadow-[0_10px_20px_rgba(173,28,66,0.2)]"
                        >
                            <span className="relative z-10">Get Consultation</span>

                            {/* Линия при наведении */}
                            <div className="absolute bottom-3 left-1/2 h-[1.5px] bg-white w-0 group-hover:w-1/4 transition-all duration-300 -translate-x-1/2" />
                        </button>

                        <button className="px-8 py-4 rounded-full border border-neutral-200 text-gray-400 font-black uppercase italic tracking-widest text-[11px] hover:bg-neutral-50 hover:text-[#1a1a1a] transition-all">
                            View Services
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ContactSection;