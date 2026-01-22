import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

const systemFeatures = [
	{
		category: 'SOURCING',
		title: 'Supplier discovery',
		description: 'Curated shortlists with real trade-offs, not random options.',
	},
	{
		category: 'VERIFICATION',
		title: 'Due diligence',
		description: 'Direct verification of capacity and reliability on-site.',
	},
	{
		category: 'NEGOTIATION',
		title: 'Terms that protect',
		description: 'Securing lead times, warranties, and payment safety.',
	},
	{
		category: 'QUALITY',
		title: 'QC checkpoints',
		description: 'Mandatory inspections and photo reports before shipment.',
	},
	{
		category: 'LOGISTICS',
		title: 'Chain coordination',
		description: 'Aligning production and transport for a seamless flow.',
	},
	{
		category: 'CONTROL',
		title: 'One team',
		description: 'Full responsibility from request to delivery. No excuses.',
	},
]

const ProcurementSystem = () => {
	const sectionRef = useRef(null)
	const titleRef = useRef(null)
	const descRef = useRef(null)
	const cardsRef = useRef([])

	// Шрифт Segoe UI Variable Display с запасными вариантами
	const fontStyle = {
		fontFamily:
			"'Segoe UI Variable Display', 'Segoe UI', system-ui, -apple-system, sans-serif",
	}

	useEffect(() => {
		// 1. SplitType для текста
		const splitTitle = new SplitType(titleRef.current, {
			types: 'chars',
			tagName: 'span',
		})
		const splitDesc = new SplitType(descRef.current, {
			types: 'chars',
			tagName: 'span',
		})

		// 2. Таймлайн появления (Highlight как в About)
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: sectionRef.current,
				start: 'top 85%',
				end: 'top 20%',
				scrub: 1,
			},
		})

		tl.fromTo(
			splitTitle.chars,
			{
				opacity: 0,
				backgroundColor: '#AD1C42',
				color: '#fff',
				y: 10,
			},
			{
				opacity: 1,
				y: 0,
				stagger: 0.05,
				duration: 1,
			},
		).to(
			splitTitle.chars,
			{
				backgroundColor: 'transparent',
				color: '#000',
				stagger: 0.05,
				duration: 0.8,
			},
			0.5,
		)

		// Анимация описания
		tl.fromTo(
			splitDesc.chars,
			{ opacity: 0 },
			{ opacity: 1, stagger: 0.01, duration: 1 },
			'-=0.5',
		)

		// 3. Анимация карточек (GSAP)
		if (cardsRef.current.length > 0) {
			gsap.fromTo(
				cardsRef.current,
				{ opacity: 0, y: 50 },
				{
					opacity: 1,
					y: 0,
					stagger: 0.1,
					duration: 1.2,
					ease: 'power4.out',
					scrollTrigger: {
						trigger: '.cards-grid',
						start: 'top 90%',
						toggleActions: 'play none none reverse',
					},
				},
			)
		}

		return () => {
			splitTitle.revert()
			splitDesc.revert()
			ScrollTrigger.getAll().forEach(t => t.kill())
		}
	}, [])

	return (
		<section
			ref={sectionRef}
			className='relative py-24 bg-white'
			style={fontStyle}
		>
			<div className='container mx-auto px-6 max-w-6xl'>
				{/* ЗАГОЛОВОК */}
				<div className='mb-16'>
					<h2
						ref={titleRef}
						className='text-4xl md:text-6xl font-[900] text-[#000] mb-4 tracking-tight leading-[1.1] uppercase italic'
					>
						A Systematic Approach
					</h2>
					<p
						ref={descRef}
						className='max-w-2xl text-gray-500 text-base md:text-lg leading-relaxed font-medium'
					>
						One chain owner — MAVA. We manage everything from search to final
						unloading at your warehouse.
					</p>
				</div>

				{/* СЕТКА КАРТОЧЕК */}
				<div className='cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
					{systemFeatures.map((feature, index) => (
						<div
							key={index}
							ref={el => (cardsRef.current[index] = el)}
							className='group relative p-8 bg-white rounded-[28px] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.01)] transition-all duration-500 overflow-hidden hover:border-[#AD1C42]/20'
						>
							{/* Свечение при наведении */}
							<div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'>
								<div className='absolute -top-20 -left-20 w-56 h-56 bg-[#AD1C42]/5 blur-[70px] rounded-full' />
							</div>

							<span className='relative z-10 text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-4 block group-hover:text-[#AD1C42] transition-colors'>
								{feature.category}
							</span>

							<h3 className='relative z-10 text-xl font-[800] text-[#000] mb-3 tracking-tight uppercase'>
								{feature.title}
							</h3>

							<p className='relative z-10 text-gray-500 text-sm leading-snug font-medium'>
								{feature.description}
							</p>

							{/* Линия при наведении */}
							<div className='absolute bottom-0 left-0 w-0 h-[2.5px] bg-[#AD1C42]/40 transition-all duration-500 group-hover:w-full' />
						</div>
					))}
				</div>
			</div>
		</section>
	)
}

export default ProcurementSystem
