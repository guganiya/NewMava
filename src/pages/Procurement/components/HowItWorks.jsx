import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const steps = [
	{
		id: '01',
		title: 'Request & requirements',
		image: 'public/servises/2.jpg',
		desc: 'Detailed analysis of your needs.',
	},
	{
		id: '02',
		title: 'Supplier verification',
		image: 'public/servises/4.jpg',
		desc: 'On-site audits and reliability checks.',
	},
	{
		id: '03',
		title: 'Samples & QC plan',
		image: 'public/servises/9.jpg',
		desc: 'Testing before mass production starts.',
	},
	{
		id: '04',
		title: 'Negotiation & Terms',
		image: 'public/servises/12.jpg',
		desc: 'Securing price and safety guarantees.',
	},
	{
		id: '05',
		title: 'Production control',
		image: 'public/servises/2.jpg',
		desc: 'Real-time monitoring of the shop floor.',
	},
	{
		id: '06',
		title: 'Final Logistics',
		image: 'public/servises/4.jpg',
		desc: 'Delivery to your door, cleared and safe.',
	},
]

const ProcessScroll = () => {
	const [selectedStep, setSelectedStep] = useState(null)
	const containerRef = useRef(null)
	const movementRef = useRef(null)

	useEffect(() => {
		let mm = gsap.matchMedia()

		mm.add('(min-width: 768px)', () => {
			// ДЕСКТОП: Диагональная анимация
			gsap.to(movementRef.current, {
				x: '-150vw',
				y: '-150vh',
				ease: 'none',
				scrollTrigger: {
					trigger: containerRef.current,
					pin: true,
					scrub: 1,
					start: 'top top',
					end: '+=4000',
					invalidateOnRefresh: true,
				},
			})
		})

		// На мобилках (до 768px) GSAP ничего не делает с контейнером,
		// позволяя работать обычному CSS скроллу.

		return () => mm.revert()
	}, [])

	return (
		<section
			ref={containerRef}
			className='relative w-full h-screen md:h-screen bg-[#fff] overflow-hidden md:overflow-hidden'
			style={{ fontFamily: "'Segoe UI Variable Display', sans-serif" }}
		>
			{/* Статичный заголовок */}
			<div className='absolute top-10 left-6 md:top-25 md:left-24 z-50'>
				<h2 className='text-4xl md:text-8xl font-[900] text-[#000] uppercase italic tracking-tighter leading-none'>
					How it <span className='text-[#AD1C42]'>works</span>
				</h2>
				<p className='text-gray-400 mt-2 font-medium tracking-widest text-[10px] md:text-xs uppercase'>
					Clear steps. Predictable results.
				</p>
			</div>

			{/* Контейнер-платформа */}
			<div
				ref={movementRef}
				className={`
          absolute flex gap-6 md:gap-24 px-6 md:px-0
          top-[40%] md:top-[60%] left-0 md:left-[60%]
          w-full md:w-max
          overflow-x-auto md:overflow-visible
          snap-x snap-mandatory md:snap-none
          no-scrollbar
        `}
			>
				{steps.map((step, i) => (
					<div
						key={step.id}
						className='card-wrapper shrink-0 snap-center'
						// На десктопе сдвиг по Y для диагонали, на мобилке в ряд (0)
						style={{
							transform:
								typeof window !== 'undefined' && window.innerWidth >= 768
									? `translateY(${i * 200}px)`
									: 'translateY(0)',
						}}
					>
						<motion.div
							layoutId={`process-${step.id}`}
							onClick={() => setSelectedStep(step)}
							className='group relative w-[80vw] md:w-[420px] aspect-[4/5] rounded-[40px] md:rounded-[50px] overflow-hidden shadow-2xl cursor-pointer'
							style={{ rotate: i % 2 === 0 ? '-4deg' : '4deg' }}
							whileHover={{ rotate: 0, scale: 1.02 }}
						>
							<img
								src={step.image}
								className='absolute inset-0 w-full h-full object-cover'
								alt=''
							/>
							<div className='absolute inset-0 bg-gradient-to-t from-[#33000d]/90 via-transparent to-transparent' />

							<div className='absolute top-8 left-8 md:top-10 md:left-10'>
								<span className='text-5xl md:text-6xl font-black text-white/30 outline-text'>
									{step.id}
								</span>
							</div>

							<div className='absolute bottom-10 left-8 right-8 md:bottom-12 md:left-10 md:right-10 text-white'>
								<h3 className='text-2xl md:text-3xl font-[900] mb-2 uppercase italic leading-none'>
									{step.title}
								</h3>
								<p className='text-[9px] md:text-[10px] tracking-widest uppercase opacity-60 font-bold'>
									Click to explore details →
								</p>
							</div>
						</motion.div>
					</div>
				))}
			</div>

			{/* Твой неизменный AnimatePresence (Модалка) */}
			<AnimatePresence>
				{selectedStep && (
					<div className='fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6'>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setSelectedStep(null)}
							className='absolute inset-0 bg-black/60 backdrop-blur-xl'
						/>
						<motion.div
							layoutId={`process-${selectedStep.id}`}
							className='relative bg-white w-full max-w-5xl md:h-[550px] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl flex flex-col md:flex-row'
						>
							<div className='w-full md:w-1/2 h-[200px] md:h-full relative overflow-hidden'>
								<img
									src={selectedStep.image}
									className='absolute inset-0 w-full h-full object-cover'
									alt=''
								/>
							</div>
							<div className='w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white text-[#33000d]'>
								<span className='text-[#AD1C42] font-black tracking-widest uppercase text-[10px] mb-2'>
									Step {selectedStep.id}
								</span>
								<h3 className='text-3xl md:text-5xl font-[900] uppercase italic leading-[0.9] mb-8'>
									{selectedStep.title}
								</h3>
								<div className='flex items-stretch gap-6'>
									<div className='w-[4px] md:w-[6px] bg-[#AD1C42] rounded-full shrink-0' />
									<p className='text-gray-600 text-base md:text-lg leading-relaxed italic'>
										{selectedStep.desc}
									</p>
								</div>
								<button
									onClick={() => setSelectedStep(null)}
									className='mt-10 self-start px-10 py-4 bg-[#33000d] text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em]'
								>
									Close process
								</button>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			<style jsx>{`
				.outline-text {
					-webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.5);
					color: transparent;
				}
				.no-scrollbar::-webkit-scrollbar {
					display: none;
				}
				.no-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
			`}</style>
		</section>
	)
}

export default ProcessScroll
