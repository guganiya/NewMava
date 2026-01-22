import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'

gsap.registerPlugin(ScrollTrigger)

const lightPattern = {
    backgroundImage: `
    url("data:image/svg+xml,%3Csvg width='240' height='240' viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(0,0,0,0.05)' stroke-width='1'%3E%3Cpath d='M120 20 L220 200 L20 200 Z'/%3E%3C/g%3E%3C/svg%3E"),
    url("data:image/svg+xml,%3Csvg width='240' height='240' viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(0,0,0,0.05)' stroke-width='1'%3E%3Cpath d='M20 40 L220 40 L120 220 Z'/%3E%3C/g%3E%3C/svg%3E")
  `,
    backgroundRepeat: 'repeat, repeat',
    backgroundSize: '240px 240px, 240px 240px',
    backgroundPosition: '0 0, 120px -50px',
}

const ContactsPage = () => {
    const containerRef = useRef(null)

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            new SplitType('.split-text', { types: 'chars' })

            gsap.utils.toArray('section').forEach(section => {
                const chars = section.querySelectorAll('.char')
                if (chars.length) {
                    gsap.from(chars, {
                        scrollTrigger: {
                            trigger: section,
                            start: 'top 90%',
                            toggleActions: 'play none none reverse',
                        },
                        y: 20,
                        opacity: 0,
                        stagger: 0.01,
                        duration: 0.5,
                        ease: 'power2.out',
                    })
                }
            })

            gsap.utils.toArray('.bg-word').forEach(word => {
                gsap.to(word, {
                    scrollTrigger: {
                        trigger: word.parentElement,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                    },
                    x: window.innerWidth < 768 ? 40 : 100, // Уменьшил смещение для мобилок
                    ease: 'none',
                })
            })

            gsap.utils.toArray('.parallax-map').forEach(map => {
                gsap.to(map, {
                    scrollTrigger: {
                        trigger: map.parentElement,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.2,
                    },
                    y: window.innerWidth < 768 ? -30 : -80,
                    ease: 'none',
                })
            })
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar />

            <main
                ref={containerRef}
                className='bg-[#f6f6f6] text-[#111] font-sans overflow-x-hidden selection:bg-[#ad1c42] selection:text-white'
            >
                {/* 01. HERO */}
                <section className='relative min-h-[70vh] md:min-h-[90vh] flex items-center px-6 md:px-[10vw] overflow-hidden pt-32 md:pt-20'>
                    <div className='absolute inset-0 pointer-events-none z-0' style={lightPattern} />
                    <div className='bg-word absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] md:text-[14vw] font-black text-black/[0.015] select-none italic uppercase z-0'>
                        MAVA
                    </div>
                    <div className='relative z-10 max-w-2xl'>
                        <h1 className='split-text text-3xl md:text-5xl font-[900] italic uppercase leading-[1.1] tracking-tighter mb-5'>
                            Wherever you are —<br />
                            we’re within reach.
                        </h1>
                        <p className='text-sm md:text-base text-gray-400 font-medium italic'>
                            Logistics starts with people.
                        </p>
                    </div>
                </section>

                {/* 02. ASHGABAT */}
                <section className='relative min-h-[80vh] md:min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-[10vw] py-20 overflow-hidden'>
                    <div className='absolute inset-0 pointer-events-none z-0' style={lightPattern} />
                    <div className='bg-word absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] md:text-[14vw] font-black text-black/[0.015] select-none italic uppercase z-0'>
                        ASHGABAT
                    </div>
                    <div className='relative z-10 max-w-sm order-2 md:order-1 mt-12 md:mt-0 text-center md:text-left'>
                        <h2 className='split-text text-2xl md:text-4xl font-[900] italic uppercase tracking-tighter mb-3 leading-tight'>
                            This is where <span className='text-[#ad1c42]'>MAVA</span> begins.
                        </h2>
                        <p className='text-[10px] md:text-sm text-gray-400 italic font-medium uppercase tracking-wider'>
                            Ashgabat, Turkmenistan
                        </p>
                    </div>
                    <div className='parallax-map relative z-10 order-1 md:order-2 w-full max-w-[750px]'>
                        <img
                            src='/ashgabat.png'
                            className='w-full drop-shadow-[-20px_20px_30px_rgba(0,0,0,0.3)] md:drop-shadow-[-30px_30px_40px_rgba(0,0,0,0.5)] md:grayscale md:hover:grayscale-0 transition-all duration-1000'
                            alt='Ashgabat'
                        />
                    </div>
                </section>

                {/* 03. CHINA */}
                <section className='relative min-h-[80vh] md:min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-[10vw] py-20 overflow-hidden'>
                    <div className='absolute inset-0 pointer-events-none z-0' style={lightPattern} />
                    <div className='bg-word absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] md:text-[14vw] font-black text-black/[0.015] select-none italic uppercase z-0'>
                        CHINA
                    </div>
                    <div className='parallax-map relative z-10 w-full max-w-[750px] mb-12 md:mb-0'>
                        <img
                            src='/china.png'
                            className='w-full drop-shadow-[-20px_20px_30px_rgba(0,0,0,0.3)] md:drop-shadow-[-30px_30px_40px_rgba(0,0,0,0.5)] md:grayscale md:hover:grayscale-0 transition-all duration-1000'
                            alt='China'
                        />
                    </div>
                    <div className='relative z-10 max-w-sm text-center md:text-left'>
                        <h2 className='split-text text-2xl md:text-4xl font-[900] italic uppercase tracking-tighter mb-3 leading-tight'>
                            China — our confident step.
                        </h2>
                        <p className='text-[10px] md:text-sm text-gray-400 italic font-medium uppercase tracking-wider'>
                            Yiwu logistics hub
                        </p>
                    </div>
                </section>

                {/* 04. EUROPE */}
                <section className='relative min-h-[80vh] md:min-h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-[10vw] py-20 overflow-hidden'>
                    <div className='absolute inset-0 pointer-events-none z-0' style={lightPattern} />
                    <div className='bg-word absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] md:text-[14vw] font-black text-black/[0.015] select-none italic uppercase z-0'>
                        EUROPE
                    </div>
                    <div className='relative z-10 max-w-sm order-2 md:order-1 mt-12 md:mt-0 text-center md:text-left'>
                        <h2 className='split-text text-2xl md:text-4xl font-[900] italic uppercase tracking-tighter mb-3 leading-tight'>
                            Europe is next.
                        </h2>
                        <p className='text-[10px] md:text-sm text-gray-400 italic font-medium uppercase tracking-wider'>
                            Vilnius, Lithuania
                        </p>
                    </div>
                    <div className='parallax-map relative z-10 order-1 md:order-2 w-full max-w-[750px]'>
                        <img
                            src='/europe.png'
                            className='w-full drop-shadow-[-20px_20px_30px_rgba(0,0,0,0.3)] md:drop-shadow-[-30px_30px_40px_rgba(0,0,0,0.5)] md:grayscale md:hover:grayscale-0 transition-all duration-1000'
                            alt='Europe'
                        />
                    </div>
                </section>

                {/* 05. CONTACT FORM */}
                <section className='relative min-h-screen flex items-center justify-center px-6 md:px-[10vw] bg-[#0b0b0b] text-white overflow-hidden py-20'>
                    <div className='absolute inset-0 opacity-10 z-0' style={lightPattern} />
                    <div className='bg-word absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] md:text-[14vw] font-black text-white/[0.03] select-none italic uppercase z-0'>
                        CONTACT
                    </div>
                    <div className='relative z-10 w-full max-w-md'>
                        <h2 className='split-text text-3xl md:text-4xl font-[900] italic uppercase mb-2 tracking-tighter text-center md:text-left'>
                            Let’s talk.
                        </h2>
                        <p className='text-gray-500 text-[10px] md:text-sm mb-10 italic uppercase tracking-widest text-center md:text-left'>
                            Tell us what you need.
                        </p>
                        <form className='space-y-6'>
                            <input
                                type='text'
                                placeholder='YOUR NAME'
                                className='w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-[#ad1c42] transition-colors font-bold text-[10px] tracking-widest placeholder:text-gray-800 uppercase'
                            />
                            <input
                                type='email'
                                placeholder='EMAIL'
                                className='w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-[#ad1c42] transition-colors font-bold text-[10px] tracking-widest placeholder:text-gray-800 uppercase'
                            />
                            <textarea
                                placeholder='MESSAGE'
                                className='w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-[#ad1c42] transition-colors font-bold text-[10px] tracking-widest h-24 resize-none placeholder:text-gray-800 uppercase'
                            />
                            <button className='w-full bg-[#ad1c42] py-5 font-[900] uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all duration-500'>
                                Send Request
                            </button>
                        </form>
                    </div>
                </section>

                {/* 06. FINAL RESPONSIBILITY */}
                <section className='relative min-h-[50vh] md:min-h-[70vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden py-20'>
                    <div className='absolute inset-0 pointer-events-none z-0' style={lightPattern} />
                    <div className='bg-word absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] md:text-[12vw] font-black text-black/[0.015] select-none italic uppercase z-0'>
                        RESPONSIBILITY
                    </div>
                    <div className='relative z-10'>
                        <h2 className='split-text text-2xl md:text-5xl font-[900] italic uppercase leading-[1.2] tracking-tighter'>
                            Logistics is not speed.
                            <br />
                            <span className='text-[#ad1c42]'>It’s responsibility.</span>
                        </h2>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default ContactsPage