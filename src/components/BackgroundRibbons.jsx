import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

const BackgroundRibbons = ({ count = 40 }) => {
	const containerRef = useRef(null)

	useLayoutEffect(() => {
		let ctx = gsap.context(() => {
			gsap.utils.toArray('.web-ribbon').forEach(ribbon => {
				gsap.to(ribbon, {
					x: 'random(-100, 100)',
					y: 'random(-100, 100)',
					rotation: 'random(-45, 45)',
					duration: 'random(10, 20)',
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut',
				})
			})
		}, containerRef)
		return () => ctx.revert()
	}, [])

	return (
		<div
			ref={containerRef}
			// Используем fixed и очень высокий z-index, чтобы они были ПОВЕРХ всего,
			// НО pointer-events-none позволит кликать сквозь них.
			className='fixed inset-0 pointer-events-none overflow-hidden'
			style={{ zIndex: 50 }}
		>
			{[...Array(count)].map((_, i) => (
				<div
					key={i}
					className={`web-ribbon absolute opacity-[0.15] will-change-transform ${
						i % 2 === 0 ? 'bg-[#AD1C42]' : 'bg-gray-400'
					}`}
					style={{
						height: '1px',
						width: '200px',
						// Распределяем по всему экрану
						top: `${Math.random() * 100}vh`,
						left: `${Math.random() * 100}vw`,
						transform: `rotate(${Math.random() * 360}deg)`,
					}}
				/>
			))}
		</div>
	)
}

export default BackgroundRibbons
