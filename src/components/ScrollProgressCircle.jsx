import React, { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ScrollProgressCircle = ({ nextTarget = '/' }) => {
	const [progress, setProgress] = useState(0)
	const circleRef = useRef(null)
	const size = 80 // Размер круга
	const strokeWidth = 4
	const radius = (size - strokeWidth) / 2
	const circumference = radius * 2 * Math.PI

	useEffect(() => {
		const trigger = ScrollTrigger.create({
			trigger: 'body', // Отслеживаем скролл всей страницы
			start: 'top top',
			end: 'bottom bottom',
			onUpdate: self => {
				const p = Math.round(self.progress * 100)
				setProgress(p)

				// Если дошли до конца (100%), переходим
				if (self.progress >= 1) {
					// Задержка полсекунды, чтобы юзер увидел 100%
					setTimeout(() => {
						window.location.href = nextTarget
					}, 500)
				}
			},
		})

		return () => trigger.kill()
	}, [nextTarget])

	// Вычисляем отступ для анимации SVG
	const offset = circumference - (progress / 100) * circumference

	return (
		<div className='fixed bottom-10 right-10 z-50 flex items-center justify-center pointer-events-none'>
			<svg width={size} height={size} className='transform -rotate-90'>
				{/* Фоновый серый круг */}
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill='#e5e7eb' // Серый фон как на скрине
					stroke='#e5e7eb'
					strokeWidth={strokeWidth}
				/>
				{/* Активный бордовый прогресс */}
				<circle
					ref={circleRef}
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill='transparent'
					stroke='#AD1C42' // Твой бордовый цвет
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					style={{
						strokeDashoffset: offset,
						transition: 'stroke-dashoffset 0.1s linear',
					}}
					strokeLinecap='round'
				/>
			</svg>
			{/* Текст процентов */}
			<span className='absolute text-gray-900 font-bold text-sm pointer-events-auto'>
				{progress}%
			</span>
		</div>
	)
}

export default ScrollProgressCircle
