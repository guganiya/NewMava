import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const ProcurementHero = () => {
	const fontStyle = {
		fontFamily:
			"'Segoe UI Variable Display', 'Segoe UI', system-ui, -apple-system, sans-serif",
	}

	return (
		<section
			className='relative min-h-screen py-12 md:py-24 overflow-hidden bg-[#fdfdfd] flex items-center justify-center '
			style={fontStyle}
		>
			{/* Имитация источника света в верхнем правом углу */}
			<div className='absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,_rgba(173,28,66,0.06)_0%,_rgba(255,255,255,1)_60%)]' />

			<div className='container mx-auto px-4 md:px-6 max-w-6xl relative z-10'>
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					// Тень уходит влево-вниз от света справа-сверху
					className='bg-white rounded-[40px] shadow-[-25px_50px_90px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row items-stretch border border-gray-100/50'
				>
					{/* ЛЕВАЯ ЧАСТЬ */}
					<div className='w-full md:w-[58%] p-8 md:p-14 flex flex-col justify-center order-1'>
						{/* Хештеги */}
						<div className='flex flex-wrap gap-2 mb-6'>
							{['PROCUREMENT', 'SOURCING', 'CONTROL'].map(tag => (
								<span
									key={tag}
									className='flex items-center gap-2 px-3.5 py-1.5 bg-[#f8f0f2] rounded-full text-[10px] md:text-[11px] font-bold text-[#AD1C42] tracking-[0.12em] border border-[#AD1C42]/10'
								>
									<span className='w-1 h-1 rounded-full bg-[#AD1C42]' />
									{tag}
								</span>
							))}
						</div>

						{/* Заголовок — немного уменьшен */}
						<h1 className='text-3xl md:text-6xl font-[900] text-[#33000d] leading-[1.08] mb-6 uppercase italic tracking-tight'>
							Procurement <br />
							<span className='text-[#AD1C42]'>with MAVA</span>
						</h1>

						{/* Текст — уменьшен до оптимального уровня */}
						<div className='max-w-lg space-y-5 text-gray-600 text-base md:text-[17px] leading-relaxed'>
							<p>
								You’re not just looking for a supplier — you’re looking for{' '}
								<span className='text-[#33000d] font-semibold'>certainty</span>.
								In procurement, it’s not just about products. It’s about{' '}
								<span className='text-[#AD1C42] font-bold'>
									guarantees, reliability, and control.
								</span>
							</p>
							<p className='font-medium'>
								That’s why we build procurement as a system:{' '}
								<span className='text-[#33000d]'>
									smart, precise, and secure.
								</span>{' '}
								No noise, no losses —{' '}
								<span className='text-[#AD1C42] font-bold underline decoration-2 underline-offset-4'>
									full responsibility, front to back.
								</span>
							</p>
						</div>

						{/* Кнопки */}
						<div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-5 mt-10'>
							<Link
								to='/HowitWorks'
								className='group relative px-9 py-4 bg-[#AD1C42] text-white rounded-xl font-bold tracking-[0.1em] transition-all hover:bg-[#8e1736] hover:scale-105 active:scale-95 shadow-lg shadow-[#AD1C42]/30 uppercase text-[11px] overflow-hidden text-center'
							>
								<span className='relative z-10'>How it works</span>
								<span className='absolute bottom-3.5 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-white/60 transition-all duration-300 group-hover:w-1/3' />
							</Link>

							<Link
								to='/sourcing'
								className='group relative px-9 py-4 bg-white text-gray-800 border-2 border-gray-100 rounded-xl font-bold tracking-[0.1em] transition-all hover:bg-gray-50 active:scale-95 uppercase text-[11px] overflow-hidden text-center'
							>
								<span className='relative z-10'>Request Sourcing</span>
								<span className='absolute bottom-0 left-0 w-0 h-[3px] bg-[#AD1C42] transition-all duration-300 group-hover:w-full' />
							</Link>
						</div>
					</div>

					{/* ПРАВАЯ ЧАСТЬ */}
					<div className='w-full md:w-[42%] relative flex flex-col border-t md:border-t-0 md:border-l border-gray-100 bg-[#fafafa] order-2'>
						<div className='h-[260px] md:h-[420px] w-full overflow-hidden relative'>
							<img
								src='public/work/air-index1.jpg'
								alt='Procurement'
								className='absolute inset-0 w-full h-full object-cover grayscale opacity-90 transition-transform duration-1000 hover:scale-110 hover:grayscale-0'
							/>
							<div className='absolute inset-0 bg-gradient-to-bl from-white/10 via-transparent to-transparent' />
						</div>

						<div className='flex-1 p-8 md:p-10 flex flex-col justify-center bg-white'>
							<h3 className='text-lg font-[900] text-[#33000d] mb-5 uppercase italic flex items-center gap-3'>
								Why it works
								<span className='h-px w-8 bg-[#AD1C42]/20' />
							</h3>
							<ul className='space-y-3.5'>
								{[
									'Vetted manufacturers in global markets',
									'Ground support — real presence',
									'Smart value over “cheaper at any cost”',
									'Your steady, scalable flow control',
								].map((item, i) => (
									<li
										key={i}
										className='flex items-start gap-3.5 text-gray-600 group'
									>
										<span className='mt-0.5 w-5 h-5 flex-shrink-0 bg-[#f8f0f2] rounded-md border border-[#AD1C42]/10 flex items-center justify-center transition-all group-hover:bg-[#AD1C42] group-hover:rotate-90'>
											<div className='w-1 h-1 rounded-[1px] bg-[#AD1C42] group-hover:bg-white' />
										</span>
										<span className='group-hover:text-[#AD1C42] transition-colors uppercase text-[11px] font-bold tracking-tight leading-snug'>
											{item}
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}

export default ProcurementHero
