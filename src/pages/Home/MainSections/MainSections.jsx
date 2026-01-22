import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

const AboutSections = () => {
	const containerRef = useRef(null)

	const content = [
		{
			title: 'MAVA was founded in March 2025.',
			desc: 'But behind this date is not a fresh start — it is the result of years of experience.',
			highlight: '#AD1C42',
			image: '/servises/2.jpg',
			reverse: false,
		},
		{
			title: 'Our team consists of professionals.',
			desc: 'Experts in air freight, customs clearance, and complex multimodal solutions.',
			highlight: '#1e293b',
			image: '/servises/4.jpg',
			reverse: true,
		},
		{
			title: 'An answer to empty promises.',
			desc: 'MAVA was created as an answer to a market full of formality.',
			highlight: '#AD1C42',
			image: '/servises/9.jpg',
			reverse: false,
		},
		{
			title: 'Young as a company. Mature as a partner.',
			desc: 'We combine energy with the reliability of decades of expertise.',
			highlight: '#1e293b',
			image: '/servises/12.jpg',
			reverse: true,
		},
	]

	useLayoutEffect(() => {
		let ctx = gsap.context(() => {
			// 1. АНИМАЦИЯ ЛЕНТОЧЕК (Теперь они двигаются)
			gsap.utils.toArray('.web-ribbon').forEach(ribbon => {
				gsap.to(ribbon, {
					x: 'random(-80, 80)',
					y: 'random(-80, 80)',
					rotation: 'random(-20, 20)',
					duration: 'random(10, 15)',
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut',
				})
			})

			const rows = gsap.utils.toArray('.about-row')

			rows.forEach((row, i) => {
				const titleElement = row.querySelector('.split-title')
				const imgWrapper = row.querySelector('.img-wrapper')
				const imgShadow = row.querySelector('.img-shadow')
				const sectionData = content[i]

				const text = new SplitType(titleElement, {
					types: 'words, chars',
					tagName: 'span',
				})

				// 2. ПАРАЛЛАКС КАРТИНКИ И ГЛУБОКОЙ ТЕНИ
				const tlImg = gsap.timeline({
					scrollTrigger: {
						trigger: row,
						start: 'top bottom',
						end: 'top 10%',
						scrub: 1.5,
					},
				})

				// Картинка раскрывается
				tlImg.fromTo(
					imgWrapper,
					{ clipPath: 'inset(15% 15% 15% 15% round 2rem)', scale: 0.8 },
					{ clipPath: 'inset(0% 0% 0% 0% round 2rem)', scale: 1 },
				)

				// Тень (img-shadow) становится мощнее и смещается
				tlImg.fromTo(
					imgShadow,
					{ opacity: 0, x: -50, y: 50, scale: 0.7, filter: 'blur(50px)' },
					{ opacity: 0.8, x: -25, y: 30, scale: 0.95, filter: 'blur(30px)' },
					0,
				)

				// 3. МЕДЛЕННАЯ АНИМАЦИЯ ТЕКСТА (Highlight)
				const tlText = gsap.timeline({
					scrollTrigger: {
						trigger: row,
						start: 'top 85%',
						end: '+=100%',
						scrub: 2,
					},
				})

				tlText
					.fromTo(
						text.chars,
						{
							opacity: 0,
							backgroundColor: sectionData.highlight,
							color: '#fff',
						},
						{ opacity: 1, stagger: 0.15, duration: 2 },
					)
					.to(
						text.chars,
						{
							backgroundColor: 'transparent',
							color: '#111827',
							stagger: 0.15,
							duration: 1.2,
						},
						0.6,
					)
			})
		}, containerRef)

		return () => ctx.revert()
	}, [])

	return (
		<div
			ref={containerRef}
			className='relative bg-[#eeeeee] w-full overflow-hidden'
		>
			{/* ЛЕНТОЧКИ (ФОНОВЫЙ СЛОЙ) */}
			<div className='absolute inset-0 pointer-events-none z-0'>
				{[...Array(40)].map((_, i) => (
					<div
						key={i}
						className={`web-ribbon absolute opacity-20 ${i % 2 === 0 ? 'bg-[#AD1C42]' : 'bg-gray-400'}`}
						style={{
							height: '1px',
							width: '250px',
							top: `${Math.random() * 100}%`,
							left: `${Math.random() * 100}%`,
							transform: `rotate(${Math.random() * 360}deg)`,
						}}
					/>
				))}
			</div>

			<div className='relative z-10'>
				{content.map((item, index) => (
					<section
						key={index}
						className={`about-row flex flex-col md:flex-row items-center py-32 md:py-52 px-6 md:px-24 max-w-[1200px] mx-auto gap-16 md:gap-32 ${item.reverse ? 'md:flex-row-reverse' : ''}`}
					>
						{/* ГРУППА: КАРТИНКА + ТЕНЬ */}
						<div className='w-full md:w-1/2 relative'>
							{/* ТЕНЬ (Слой под картинкой) */}
							<div
								className='img-shadow absolute inset-0 bg-black pointer-events-none'
								style={{ borderRadius: '2rem', zIndex: -1 }}
							/>
							{/* КАРТИНКА */}
							<div className='img-wrapper overflow-hidden aspect-[14/10] bg-white'>
								<img
									src={item.image}
									alt={item.title}
									className='w-full h-full object-cover'
								/>
							</div>
						</div>

						{/* ТЕКСТОВЫЙ БЛОК */}
						<div className='w-full md:w-1/2'>
							<h2 className='text-3xl md:text-4xl font-extrabold leading-tight text-gray-900'>
								<span className='split-title inline-block'>{item.title}</span>
							</h2>

							<div className='mt-10'>
								<div className='flex items-start gap-6'>
									{/* Красная линия с тенью */}
									<div className='w-2 bg-[#AD1C42] h-20 rounded-full shrink-0 shadow-[-10px_10px_20px_rgba(0,0,0,0.5)]' />
									<p className='text-gray-600 text-lg md:text-xl font-light italic leading-relaxed'>
										{item.desc}
									</p>
								</div>
							</div>
						</div>
					</section>
				))}
			</div>
			<div className='h-[15vh]' />
		</div>
	)
}

export default AboutSections
