import React, { useState } from 'react'
import {
	motion,
	useScroll,
	useTransform,
	useMotionValueEvent,
} from 'framer-motion'
import Navbar from '../../components/Navbar.jsx'

const DATA = [
	{
		id: 1,
		title: 'AIR CHARTER WITH MAVA',
		content: [
			{ type: 'highlight', text: 'When “yesterday” is already too late.' },
			{ type: 'normal', text: 'Sometimes, cargo can’t wait.' },
			{
				type: 'normal',
				text: 'A contract is on the line. Production is stalled. Every hour costs.',
			},
			{
				type: 'normal',
				text: 'In those moments, regular logistics isn’t enough.',
			},
			{ type: 'normal', text: 'But we are.' },
			{
				type: 'normal',
				text: 'MAVA arranges a charter tailored to your timeline,',
			},
			{ type: 'normal', text: 'your route, your urgency.' },
			{
				type: 'normal',
				text: 'No schedules — just point of origin and destination.',
			},
			{ type: 'normal', text: 'We’ll handle the rest.' },
			{ type: 'normal', text: 'Documents? Permits? Aircraft availability?' },
			{
				type: 'highlight',
				text: 'We don’t just move planes. We move the process.',
			},
			{ type: 'normal', text: 'Air Charter isn’t just about speed.' },
			{ type: 'normal', text: 'It’s about making sure' },
			{ type: 'highlight', text: 'your cargo flies exactly when it needs to.' },
			{ type: 'normal', text: 'Not early. Not late. But right on time.' },
			{ type: 'highlight', text: 'When time flies — we fly faster.' },
		],
		img: '/special/1.jpg',
	},
	{
		id: 2,
		title: 'ROUTE SURVEY BY MAVA',
		content: [
			{
				type: 'highlight',
				text: 'Before we move — we know where. And how. Down to the millimeter.',
			},
			{ type: 'normal', text: 'A route survey isn’t “let’s go take a look.”' },
			{ type: 'normal', text: 'It’s data. Precision. Engineering logic.' },
			{
				type: 'normal',
				text: 'We study the route — not with guesses, but with instruments.',
			},
			{
				type: 'normal',
				text: 'Because heavy cargo means serious responsibility.',
			},
			{
				type: 'normal',
				text: 'Bridges, tunnels, slopes, road surfaces, curves, utilities —',
			},
			{
				type: 'normal',
				text: 'anything that can become a risk becomes part of the plan.',
			},
			{ type: 'normal', text: 'We use modern tools:' },
			{
				type: 'normal',
				text: 'laser rangefinders, digital levels, 3D modeling, advanced geodetic instruments.',
			},
			{ type: 'normal', text: 'Need drones? We send them.' },
			{
				type: 'normal',
				text: 'Need pilot runs and detailed speed calculations? We do it.',
			},
			{ type: 'normal', text: 'Every route is broken down into numbers —' },
			{ type: 'normal', text: 'so that we don’t “fix problems later,”' },
			{ type: 'highlight', text: 'we avoid them altogether.' },
			{ type: 'highlight', text: 'With MAVA, a route doesn’t just exist.' },
			{
				type: 'highlight',
				text: 'It’s prepared, verified, and ready to deliver.',
			},
		],
		img: '/special/2.jpg',
	},
	{
		id: 3,
		title: 'MAVA WAREHOUSING',
		content: [
			{
				type: 'highlight',
				text: 'Where cargo rests easy. And you stay in control.',
			},
			{ type: 'normal', text: '600 m² of covered storage.' },
			{ type: 'normal', text: '100 m² of cold storage.' },
			{
				type: 'normal',
				text: 'Not a single square meter wasted — everything used with purpose.',
			},
			{
				type: 'normal',
				text: 'This isn’t just a facility — it’s a buffer that protects your cargo',
			},
			{ type: 'normal', text: 'when time or logistics throw a curveball.' },
			{
				type: 'normal',
				text: 'Consolidation, cross-docking, short-term storage, labeling, prep—',
			},
			{ type: 'normal', text: 'we don’t just handle cargo, we manage it.' },
			{ type: 'normal', text: 'The warehouse is part of the route.' },
			{
				type: 'normal',
				text: 'Not “wait here,” but “this is part of the plan.”',
			},
			{
				type: 'normal',
				text: 'Temperature control, access monitoring, compliance —',
			},
			{ type: 'normal', text: 'everything in place, everything on point.' },
			{ type: 'normal', text: 'And if tomorrow you need 1,000 m² —' },
			{ type: 'normal', text: 'we know where to get it. Fast.' },
			{ type: 'highlight', text: 'A warehouse isn’t a pause.' },
			{ type: 'highlight', text: 'It’s part of the motion.' },
			{ type: 'highlight', text: 'With MAVA — always one step ahead.' },
		],
		img: '/special/3.jpg',
	},
	{
		id: 4,
		title: 'MULTIMODAL WITH MAVA',
		content: [
			{
				type: 'highlight',
				text: 'When the method doesn’t matter — only the result does.',
			},
			{
				type: 'normal',
				text: 'We don’t choose between sea, road, air, or rail.',
			},
			{
				type: 'normal',
				text: 'We combine them — so your cargo moves as one seamless journey.',
			},
			{
				type: 'normal',
				text: 'No gaps. No delays. No “sorry, that’s another department.”',
			},
			{ type: 'highlight', text: 'your entire logistics chain' },
			{ type: 'highlight', text: 'becomes one clear line.' },
			{ type: 'normal', text: 'No “out of our scope,”' },
			{ type: 'normal', text: 'no “our job ends at the port,”' },
			{ type: 'normal', text: 'no “talk to someone else.”' },
			{
				type: 'normal',
				text: 'We manage the full route — from point A to point Z.',
			},
			{
				type: 'normal',
				text: 'Including paperwork, transit zones, reloading, tracking, and timing.',
			},
			{
				type: 'normal',
				text: 'You don’t need to understand the complexity behind the scenes.',
			},
			{
				type: 'normal',
				text: 'You just need to know: it’s all going according to plan —',
			},
			{
				type: 'normal',
				text: 'even if that plan runs through three countries and four transfers.',
			},
			{
				type: 'highlight',
				text: 'With MAVA, it doesn’t matter how many modes of transport.',
			},
			{
				type: 'highlight',
				text: 'What matters is that everything works as one.',
			},
		],
		img: '/special/4.jpg',
	},
	{
		id: 5,
		title: 'VESSEL CHARTER BY MAVA',
		content: [
			{
				type: 'highlight',
				text: 'When you need not a format. But freedom of route.',
			},
			{ type: 'normal', text: 'Schedules don’t fit.' },
			{ type: 'normal', text: 'The route is too long.' },
			{ type: 'normal', text: 'The cargo is too large.' },
			{ type: 'normal', text: 'And the deadlines are too tight.' },
			{
				type: 'normal',
				text: 'This isn’t about logistics. This is about a challenge.',
			},
			{
				type: 'highlight',
				text: 'And we have the answer — a vessel tailored to the task.',
			},
			{ type: 'normal', text: 'We don’t just “search the database.”' },
			{
				type: 'normal',
				text: 'We activate our network, connections, and expertise.',
			},
			{ type: 'normal', text: 'Coordinate the port. Coordinate the crew.' },
			{ type: 'normal', text: 'Coordinate the wind, if needed.' },
			{
				type: 'normal',
				text: 'While others try to fit your project into their routes —',
			},
			{ type: 'normal', text: 'we tailor the route to your project.' },
			{ type: 'highlight', text: 'We are MAVA.' },
			{ type: 'highlight', text: 'We chart the course through any sea.' },
		],
		img: '/special/5.jpg',
	},
	{
		id: 6,
		title: 'HEAVYWEIGHT & OOG WITH MAVA',
		content: [
			{
				type: 'highlight',
				text: 'When the cargo is non-standard — standard approaches',
			},
			{ type: 'highlight', text: 'don’t work. MAVA knows what it takes.' },
			{ type: 'normal', text: 'Heavy, oversized, irregular —' },
			{
				type: 'normal',
				text: 'whatever goes beyond the limits, falls right into our comfort zone.',
			},
			{
				type: 'normal',
				text: 'Hundreds of tons. Long overhangs. Complex geometry.',
			},
			{ type: 'normal', text: 'This isn’t just about “delivery.” It’s about' },
			{ type: 'highlight', text: 'planning,' },
			{
				type: 'highlight',
				text: 'approval, foresight — and flawless execution.',
			},
			{ type: 'normal', text: 'We calculate axle loads. Check bridges.' },
			{ type: 'normal', text: 'Measure curves and inclines.' },
			{
				type: 'normal',
				text: 'We handle permits, escorts, rigging, and special equipment.',
			},
			{ type: 'normal', text: 'If needed — we build a route from scratch.' },
			{
				type: 'normal',
				text: 'If needed — we lift by crane and lower within millimeters.',
			},
			{ type: 'normal', text: 'We don’t just transport.' },
			{
				type: 'normal',
				text: 'We take full responsibility — from factory to foundation.',
			},
			{ type: 'highlight', text: 'With MAVA, OOG isn’t a challenge.' },
			{ type: 'highlight', text: 'It’s what we do best.' },
		],
		img: '/special/6.png',
	},
]

const SpecialPage = () => {
	const { scrollYProgress } = useScroll()

	return (
		<div
			className="relative bg-white font-['Segoe_UI_Variable_Display',_sans-serif] antialiased"
			style={{ height: '700vh' }}
		>
			<div className='fixed top-0 left-0 w-full z-[9999] isolate'>
				<Navbar />
			</div>

			<div className='fixed inset-0 overflow-hidden flex items-center justify-center bg-white'>
				<div className='relative w-full h-full preserve-3d'>
					{DATA.map((item, index) => (
						<SceneFrame
							key={item.id}
							item={item}
							index={index}
							progress={scrollYProgress}
							total={DATA.length}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

const SceneFrame = ({ item, index, progress, total }) => {
	const isEven = index % 2 === 0
	const [isInFocus, setIsInFocus] = useState(index === 0)

	// Адаптивный интервал скролла
	const zSpacing =
		typeof window !== 'undefined' && window.innerWidth < 768 ? -2000 : -3000
	const startZ = index * zSpacing
	const endZ = (total - 1) * Math.abs(zSpacing)

	const z = useTransform(progress, [0, 1], [startZ, startZ + endZ])
	const opacity = useTransform(z, [-1200, -400, 400, 1200], [0, 1, 1, 0])
	const scale = useTransform(z, [-1500, 0, 1200], [0.85, 1, 1.1])

	useMotionValueEvent(z, 'change', latest => {
		if (latest > -600 && latest < 600) {
			if (!isInFocus) setIsInFocus(true)
		} else {
			if (isInFocus) setIsInFocus(false)
		}
	})

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: 0.04, delayChildren: 0.2 },
		},
	}

	const lineVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: 'easeOut' },
		},
	}

	return (
		<motion.div
			style={{
				z,
				opacity,
				scale,
				pointerEvents: isInFocus ? 'auto' : 'none',
				display: opacity.get() === 0 ? 'none' : 'flex',
			}}
			className='absolute inset-0 flex items-center justify-center preserve-3d px-4'
		>
			<div
				className={`flex flex-col md:flex-row items-center justify-center gap-4 md:gap-24 w-full max-w-7xl ${
					isEven ? 'md:flex-row' : 'md:flex-row-reverse'
				}`}
			>
				{/* ФОТО: ШИРОКОЕ И НЕВЫСОКОЕ НА МОБИЛКЕ */}
				<div className='w-[95%] md:w-[38%] flex justify-center'>
					<motion.div
						animate={{
							rotateY: isInFocus ? (isEven ? 10 : -10) : 0,
						}}
						transition={{ duration: 1.2, ease: 'power2.out' }}
						style={{
							transformStyle: 'preserve-3d',
							backgroundImage: `url(${item.img})`,
							transform: 'translateZ(0)',
						}}
						className='w-full aspect-[16/9] md:aspect-[3/4.2] bg-cover bg-center rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden'
					/>
				</div>

				{/* КОНТЕНТ */}
				<div className='w-full md:w-[50%] text-center'>
					<motion.h3
						initial={{ opacity: 0, y: 15 }}
						animate={isInFocus ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
						transition={{ duration: 0.6 }}
						className='text-[1.2rem] md:text-[2.2rem] text-[#ad1c42] uppercase leading-tight font-light tracking-widest mb-3 md:mb-8'
					>
						{item.title}
					</motion.h3>

					<motion.div
						variants={containerVariants}
						initial='hidden'
						animate={isInFocus ? 'visible' : 'hidden'}
						className='flex flex-col items-center space-y-1 md:space-y-2'
					>
						{item.content.map((line, i) => (
							<motion.p
								key={i}
								variants={lineVariants}
								className={`leading-tight tracking-tight ${
									line.type === 'highlight'
										? 'text-[#5c0b1f] font-bold text-[0.8rem] md:text-[1.1rem]'
										: 'text-gray-600 font-medium text-[0.7rem] md:text-[0.95rem]'
								}`}
							>
								{line.text}
							</motion.p>
						))}
					</motion.div>
				</div>
			</div>
		</motion.div>
	)
}
export default SpecialPage
