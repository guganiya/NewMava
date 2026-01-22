import React, { useState, useEffect } from 'react'

const Hero = () => {
	const [offsetY, setOffsetY] = useState(0)

	const handleScroll = () => {
		setOffsetY(window.pageYOffset)
	}

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<section className='relative h-screen w-full flex flex-col justify-end overflow-hidden'>
			{/* Фоновое изображение с параллаксом */}
			<div className='absolute inset-0 z-0'>
				<img
					src='/global-logistics-transportation-network.jpg'
					alt='Logistics Background'
					className='w-full h-full object-cover scale-110'
					style={{
						transform: `translateY(${offsetY * 0.4}px)`,
					}}
				/>
				<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>
			</div>

			{/* Контентная область */}
			<div className='relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-20 md:pb-32'>
				<div
					className='flex flex-col items-start'
					style={{
						transform: `translateY(${offsetY * -0.15}px)`,
					}}
				>
					{/* Главный заголовок: добавлен -ml (отрицательный маржин) для сдвига влево */}
					<h1
						className='text-white text-[100px] sm:text-[150px] md:text-[220px] font-bold leading-[0.8] tracking-[0.2em] -ml-[0.1em] md:-ml-[0.8em]'
						style={{ fontFamily: "'Segoe UI Variable Display', sans-serif" }}
					>
						MAVA
					</h1>

					{/* Подзаголовок: также немного сдвинут, чтобы соответствовать букве M */}
					<p
						className='text-white text-3xl sm:text-4xl md:text-6xl font-medium mt-6 md:ml-0 tracking-wide'
						style={{ fontFamily: "'Segoe UI Variable Display', sans-serif" }}
					>
						The Perfect Time
					</p>
				</div>
			</div>
		</section>
	)
}

export default Hero
