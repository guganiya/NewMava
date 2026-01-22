import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import BackgroundRibbons from '../../components/BackgroundRibbons.jsx'

gsap.registerPlugin(ScrollTrigger)

const servicesData = [
	{
		id: 'air',
		title: 'Air Freight by MAVA',
		description: 'Speed that’s measured not just in hours — but in trust.',
		content: [
			'When time becomes currency, and decisions need to be made not tomorrow, but yesterday — air freight steps in.',
			'We don’t just move cargo through the sky. We make the sky the most reliable part of your supply chain.',
			'Whether it’s a sample that defines the future of a contract, or a critical spare part needed to restart production — we understand the value of every hour, and deliver as if it were our own.',
		],
		featuresTitle: 'Why MAVA is different?',
		features: [
			'Routes tailored individually — we find solutions, not standard flights',
			'Access to commercial air freight — from urgent parcels to tons of cargo',
			'24/7 tracking and communication — always know where your cargo is and when it lands',
			'We don’t chase volume — we fly with purpose',
		],
		footerNote:
			'At MAVA, air freight is more than just transport. It’s meaningful speed. It’s logistics with wings.',
		img1: '/servises/1.jpg',
		img2: '/servises/2.jpg',
		img3: '/servises/3.jpg',
	},
	{
		id: 'sea',
		title: 'Sea Freight by MAVA',
		description:
			'When it’s not just about sending — but delivering precisely, reliably, and on point.',
		content: [
			'Sea freight isn’t about ships. It’s about making sure your cargo doesn’t get lost, deadlines don’t slip, and your client isn’t left waiting.',
			'It’s when between shipment and delivery — there’s not silence, but control. Not “we hope,” but “we know.”',
			'At sea, anything can go off plan. That’s why we have a plan for everything: reroute, reload, advise — before you even ask.',
			'FCL, LCL, BB — not just letters, but tailored solutions for your cycle.',
			'With us, you don’t have to search for who’s responsible. You know.',
		],
		featuresTitle: 'Ocean logistics managed:',
		features: [
			'Direct contracts with major carriers ensuring space and competitive rates',
			'Multi-modal integration — from port to your door seamlessly',
			'Customs clearance expertise that keeps your cargo moving',
			'Oversized and project cargo handled with surgical precision',
		],
		footerNote:
			'With MAVA — the sea becomes clear. And predictable. Even when it storms.',
		img1: '/servises/4.jpg',
		img2: '/servises/5.jpg',
		img3: '/servises/6.jpg',
	},
	{
		id: 'rail',
		title: 'Rail Freight with MAVA',
		description:
			'Power of the route. Precision of the schedule. Confidence at every station.',
		content: [
			'A train doesn’t get stuck in traffic. Doesn’t wait for the weather. Doesn’t miss deadlines. It moves. On schedule, on rails, on plan.',
			'We harness this power to make your cargo move like clockwork.',
			'From China to Europe. From the CIS to Turkiye. Through the Caspian, Caucasus, Central Asia. One route — dozens of options. We pick the best.',
			'Every route is fine-tuned, every detail calculated. For us, rail isn’t an alternative, it’s a strategy. We choose it deliberately, not hastily.',
			'Container, flatcar, covered railcar, open-top railcar — we tailor the format to the cargo’s essence, not a standard.',
		],
		featuresTitle: 'The Rail advantage:',
		features: [
			'Stable pricing and predictable lead times year-round',
			'Eco-friendly alternative to road and air freight',
			'Daily departures on key international routes',
			'Complete handling of transshipment and border documentation',
		],
		footerNote: 'We don’t rush — we move with precision.',
		img1: '/servises/7.jpg',
		img2: '/servises/8.jpg',
		img3: '/servises/9.jpg',
	},
	{
		id: 'road',
		title: 'Road Freight with MAVA',
		description: 'When the road is long — but everything runs right.',
		content: [
			'Road freight isn’t just a route. It’s borders, customs, paperwork, delays, weather, loading, unloading, constant communication.',
			'And in this game, it’s not the fastest who wins — but the one who thinks faster.',
			'With us, you don’t ask, “Where’s the truck?” — you already know. We’re always in touch — no “let me check,” no “I’ll get back to you.”',
			'If there’s a risk — we flag it. If there’s a delay — we act before you even notice. If you need advice — we’re already one step ahead.',
			'Our routes cover the CIS, Turkey, Iran, Europe, and China. FTL, LCL, special cargo, temperature control — not just services, but tools we use every day.',
			'We’re flexible — even when the road isn’t. We know the laws. Understand the markets. And work ahead of the problem — so you don’t lose time, money, or peace of mind.',
		],
		featuresTitle: 'Control every kilometer:',
		features: [
			'Own and partner fleet covering all of Eurasia',
			'Real-time GPS visibility for every single shipment',
			'Specialized equipment for temperature-controlled and ADR cargo',
			'Cross-docking and warehouse consolidation that actually works',
		],
		footerNote:
			'Road freight with MAVA isn’t just transport. It’s the confidence that everything’s under control — even while you sleep.',
		img1: '/servises/10.jpg',
		img2: '/servises/11.jpg',
		img3: '/servises/12.jpg',
	},
]

const ServiceBlock = ({ data }) => {
	const triggerRef = useRef(null)
	const reveal2Ref = useRef(null)
	const reveal3Ref = useRef(null)
	const lineRef = useRef(null)
	const percentRef = useRef(null)

	const dot1 = useRef(null)
	const dot2 = useRef(null)
	const dot3 = useRef(null)

	useLayoutEffect(() => {
		let ctx = gsap.context(() => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: triggerRef.current,
					start: 'top top',
					end: '+=3000',
					pin: true,
					scrub: 1,
				},
			})

			// 1. Установка начальных состояний
			gsap.set([dot2.current, dot3.current], { opacity: 0.3, height: '6px' })
			gsap.set(dot1.current, { opacity: 1, height: '18px' })
			gsap.set(reveal2Ref.current, { clipPath: 'inset(0% 0% 0% 100%)' })
			gsap.set(reveal3Ref.current, { clipPath: 'inset(0% 0% 0% 100%)' })

			// --- ФАЗА 1 (Фото 1 -> Фото 2) ---
			// Длительность 1 единица
			tl.to(lineRef.current, { left: '0%', ease: 'none', duration: 1 }, 0)
				.to(
					reveal2Ref.current,
					{ clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1 },
					0,
				)
				// Индикаторы меняются ровно посередине первой фазы
				.to(dot1.current, { opacity: 0.3, height: '6px', duration: 0.1 }, 0.5)
				.to(dot2.current, { opacity: 1, height: '18px', duration: 0.1 }, 0.5)

			// --- МГНОВЕННЫЙ ПЕРЕХОД ---
			// Ставим метку "reset", чтобы линия прыгнула назад без ожидания
			tl.to(lineRef.current, { left: '100%', duration: 0, ease: 'none' })

			// --- ФАЗА 2 (Фото 2 -> Фото 3) ---
			// Начинается сразу после мгновенного перехода (duration: 1)
			tl.to(lineRef.current, { left: '0%', ease: 'none', duration: 1 })
				.to(
					reveal3Ref.current,
					{ clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1 },
					'<',
				)
				// Индикаторы меняются посередине второй фазы
				.to(
					dot2.current,
					{ opacity: 0.3, height: '6px', duration: 0.1 },
					'-=0.5',
				)
				.to(dot3.current, { opacity: 1, height: '18px', duration: 0.1 }, '<')

			// Счетчик процентов (синхронно всему скроллу)
			const pObj = { val: 0 }
			gsap.to(pObj, {
				val: 100,
				scrollTrigger: {
					trigger: triggerRef.current,
					start: 'top top',
					end: '+=3000',
					scrub: 1,
				},
				onUpdate: () => {
					if (percentRef.current)
						percentRef.current.innerText = `${Math.round(pObj.val)}%`
				},
			})
		}, triggerRef)

		return () => ctx.revert()
	}, [])

	return (
		<div
			className='w-full bg-white'
			style={{
				fontFamily:
					'"Segoe Variable Display", "Segoe UI", system-ui, sans-serif',
			}}
		>
			{/* Секция с контентом */}
			<section className='min-h-screen flex items-center justify-center py-16 px-6 mt-18'>
				<div className='max-w-3xl w-full bg-[#fcfcfc] p-10 md:p-16 rounded-[40px] shadow-sm border border-gray-50 drop-shadow-[-30px_30px_40px_rgba(0,0,0,0.5)]'>
					{/* Заголовок: используем font-black для Segoe Variable */}
					<h2 className='text-4xl md:text-5xl font-black text-[#5a121f] mb-6 leading-tight uppercase italic tracking-tight'>
						{data.title}
					</h2>

					{/* Описание: Segoe Variable Semibold для четкости */}
					<p className='text-lg font-semibold text-[#8b1a2f] mb-6 leading-relaxed uppercase tracking-wide'>
						{data.description}
					</p>

					{/* Основной текст: Segoe Variable Light/Regular */}
					<div className='space-y-4 text-gray-600 text-base md:text-lg leading-relaxed mb-10 font-normal'>
						{data.content.map((p, i) => (
							<p key={i}>{p}</p>
						))}
					</div>

					{data.features && (
						<div className='mb-10'>
							<h3 className='text-xl font-bold text-[#5a121f] mb-4'>
								{data.featuresTitle}
							</h3>
							<ul className='space-y-3 text-sm md:text-base font-medium'>
								{data.features.map((f, i) => (
									<li key={i} className='flex items-start gap-3'>
										<span className='text-[#8b1a2f] font-bold'>•</span>
										<span>{f}</span>
									</li>
								))}
							</ul>
						</div>
					)}

					<p className='text-lg font-bold italic text-[#5a121f] border-l-4 border-[#8b1a2f] pl-5 py-1'>
						{data.footerNote}
					</p>
				</div>
			</section>
			{/* Интерактивная карточка */}
			<section
				ref={triggerRef}
				className='h-screen w-full flex items-center justify-center overflow-hidden'
			>
				<div className='relative w-[85vw] max-w-[850px] aspect-[14/16] md:aspect-[16/10] max-h-[75vh] rounded-[40px] overflow-hidden shadow-2xl bg-black drop-shadow-[-30px_30px_40px_rgba(0,0,0,0.5)]'>
					<div
						className='absolute inset-0 bg-cover bg-center opacity-90'
						style={{ backgroundImage: `url(${data.img1})` }}
					/>
					<div
						ref={reveal2Ref}
						className='absolute inset-0 bg-cover bg-center z-10'
						style={{
							backgroundImage: `url(${data.img2})`,
							clipPath: 'inset(0% 0% 0% 100%)',
						}}
					/>
					<div
						ref={reveal3Ref}
						className='absolute inset-0 bg-cover bg-center z-20'
						style={{
							backgroundImage: `url(${data.img3})`,
							clipPath: 'inset(0% 0% 0% 100%)',
						}}
					/>

					{/* Бегунок */}
					<div
						ref={lineRef}
						className='absolute top-0 bottom-0 w-[1px] bg-white/40 z-30'
						style={{ left: '100%' }}
					>
						<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 shadow-xl' />
					</div>

					{/* Индикаторы */}
					<div className='absolute right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 items-center'>
						<div
							ref={dot1}
							className='w-1 bg-white rounded-full transition-all duration-300'
						/>
						<div
							ref={dot2}
							className='w-1 bg-white rounded-full transition-all duration-300'
						/>
						<div
							ref={dot3}
							className='w-1 bg-white rounded-full transition-all duration-300'
						/>
					</div>

					{/* Проценты */}
					<div className='absolute bottom-8 right-8 z-40 text-white text-4xl font-black italic mix-blend-difference opacity-70'>
						<span ref={percentRef}>0%</span>
					</div>
				</div>
			</section>
		</div>
	)
}
const ServicesPage = () => {
	return (
		<div className='flex flex-col w-full min-h-screen bg-white font-sans'>
			<Navbar />
			<div className='fixed inset-0 z-0 pointer-events-none opacity-60'>
				{/* Уменьшаем количество до 3 и ставим прозрачность 40%, чтобы было нежно */}
				<BackgroundRibbons count={50} />
			</div>
			<main className='flex-grow'>
				{servicesData.map(service => (
					<ServiceBlock key={service.id} data={service} />
				))}
			</main>
			<Footer />
		</div>
	)
}

export default ServicesPage
