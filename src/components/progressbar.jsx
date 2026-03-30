import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Progressbar = ({ onComplete, ready = false }) => {
	const [progress, setProgress] = useState(0)
	const [isDone, setIsDone] = useState(false)

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress(prev => {
				if (!ready) return prev < 94 ? prev + 0.35 : prev
				const diff = 100 - prev
				if (diff < 0.1) {
					clearInterval(timer)
					setTimeout(() => setIsDone(true), 150)
					return 100
				}
				return prev + diff * 0.12
			})
		}, 20)
		return () => clearInterval(timer)
	}, [ready])

	useEffect(() => {
		if (isDone && onComplete) {
			const t = setTimeout(onComplete, 3800)
			return () => clearTimeout(t)
		}
	}, [isDone, onComplete])

	// Основные точки для контура М
	const points = {
		L_BOT: { x: 145, y: 180 },
		L_TOP: { x: 205, y: 50 },
		CENTER: { x: 260, y: 180 },
		R_TOP: { x: 315, y: 50 },
		R_BOT: { x: 375, y: 180 },
	}

	// Функция для масштабирования треугольника к центру (создаёт отступ)
	const scaleTriangle = (p1, p2, p3, scale = 0.85) => {
		const centerX = (p1.x + p2.x + p3.x) / 3
		const centerY = (p1.y + p2.y + p3.y) / 3

		const scalePoint = p => ({
			x: centerX + (p.x - centerX) * scale,
			y: centerY + (p.y - centerY) * scale,
		})

		return [scalePoint(p1), scalePoint(p2), scalePoint(p3)]
	}

	// Функция для смещения треугольника по вертикали
	const offsetTriangle = (points, offsetY) => {
		return points.map(p => ({
			x: p.x,
			y: p.y + offsetY,
		}))
	}

	// Масштабированные точки для треугольников (с отступом от М)
	const scaledMainTri = scaleTriangle(
		points.L_TOP,
		points.R_TOP,
		points.CENTER,
		0.78,
	)
	const scaledLeftTri = scaleTriangle(
		points.L_BOT,
		points.L_TOP,
		points.CENTER,
		0.78,
	)
	const scaledRightTri = scaleTriangle(
		points.CENTER,
		points.R_TOP,
		points.R_BOT,
		0.78,
	)

	// Смещаем треугольники: верхний вверх (-), нижние вниз (+)
	const [triMainP1, triMainP2, triMainP3] = offsetTriangle(scaledMainTri, -8) // Поднимаем красный вверх
	const [triLeftP1, triLeftP2, triLeftP3] = offsetTriangle(scaledLeftTri, 10) // Опускаем левый вниз
	const [triRightP1, triRightP2, triRightP3] = offsetTriangle(
		scaledRightTri,
		10,
	) // Опускаем правый вниз

	// Контур буквы М
	const PATH_M = `M ${points.L_BOT.x} ${points.L_BOT.y} L ${points.L_TOP.x} ${points.L_TOP.y} L ${points.CENTER.x} ${points.CENTER.y} L ${points.R_TOP.x} ${points.R_TOP.y} L ${points.R_BOT.x} ${points.R_BOT.y}`

	// Центральный (верхний) треугольник - уменьшенный и поднятый
	const TRI_MAIN = `M ${triMainP1.x} ${triMainP1.y} L ${triMainP2.x} ${triMainP2.y} L ${triMainP3.x} ${triMainP3.y} Z`

	// Нижние треугольники - уменьшенные и опущенные
	const TRI_L_BOT = `M ${triLeftP1.x} ${triLeftP1.y} L ${triLeftP2.x} ${triLeftP2.y} L ${triLeftP3.x} ${triLeftP3.y} Z`
	const TRI_R_BOT = `M ${triRightP1.x} ${triRightP1.y} L ${triRightP2.x} ${triRightP2.y} L ${triRightP3.x} ${triRightP3.y} Z`

	const dashOffset = 1 - progress / 100

	return (
		<motion.div
			exit={{ opacity: 0, scale: 1.1, filter: 'blur(15px)' }}
			transition={{ duration: 1.4, ease: [0.43, 0.13, 0.23, 0.96] }}
			className='fixed inset-0 z-[9999] bg-[#030303] flex flex-col items-center justify-center overflow-hidden'
		>
			{/* Сетка на фоне */}
			<div
				className='absolute inset-0 opacity-[0.05]'
				style={{
					backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
					backgroundSize: '50px 50px',
				}}
			/>

			<div className='relative w-full max-w-[650px] flex flex-col items-center px-6'>
				{/* STATUS */}
				<div className='h-10 mb-10'>
					<AnimatePresence mode='wait'>
						{!isDone ? (
							<motion.div
								key='loading'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className='flex flex-col items-center'
							>
								<div className='flex gap-4 items-center'>
									<span className='w-12 h-[1px] bg-[#ad1c42]' />
									<span className='text-[9px] font-bold tracking-[0.8em] text-[#ad1c42] uppercase'>
										Processing
									</span>
									<span className='w-12 h-[1px] bg-[#ad1c42]' />
								</div>
								<motion.span className='text-[11px] font-mono mt-2 text-white/40'>
									{Math.round(progress)}%
								</motion.span>
							</motion.div>
						) : (
							<motion.div
								initial={{ y: 10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								className='text-[10px] font-bold tracking-[1em] text-white uppercase py-1 px-4 border-x border-white/20'
							>
								Protocol Established
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* ЛОГОТИП */}
				<div className='relative w-full flex items-center justify-center scale-110'>
					<svg viewBox='0 0 520 230' className='w-full h-auto overflow-visible'>
						{/* 1. НИЖНИЙ ЛЕВЫЙ ТРЕУГОЛЬНИК (Белый) - опущен вниз */}
						<motion.path
							d={TRI_L_BOT}
							fill='white'
							initial={{ opacity: 0, scale: 0.8 }}
							animate={
								isDone
									? {
											opacity: 1,
											scale: 1,
										}
									: { opacity: 0 }
							}
							transition={{
								duration: 0.6,
								delay: 0.3,
								ease: 'easeOut',
							}}
							style={{ transformOrigin: 'center' }}
						/>

						{/* 2. НИЖНИЙ ПРАВЫЙ ТРЕУГОЛЬНИК (Белый) - опущен вниз */}
						<motion.path
							d={TRI_R_BOT}
							fill='white'
							initial={{ opacity: 0, scale: 0.8 }}
							animate={
								isDone
									? {
											opacity: 1,
											scale: 1,
										}
									: { opacity: 0 }
							}
							transition={{
								duration: 0.6,
								delay: 0.5,
								ease: 'easeOut',
							}}
							style={{ transformOrigin: 'center' }}
						/>

						{/* 3. ЦЕНТРАЛЬНЫЙ ТРЕУГОЛЬНИК (Белый -> Красный) - поднят вверх */}
						<motion.path
							d={TRI_MAIN}
							initial={{ opacity: 0, scale: 0.8, fill: '#ffffff' }}
							animate={
								isDone
									? {
											opacity: 1,
											scale: 1,
											fill: ['#ffffff', '#ffffff', '#ad1c42'],
										}
									: {}
							}
							transition={
								isDone
									? {
											duration: 2.2,
											times: [0, 0.4, 1],
											delay: 0.7,
											scale: { duration: 0.6, delay: 0.7 },
										}
									: {}
							}
							style={{ transformOrigin: 'center' }}
						/>

						{/* 4. КОНТУР БУКВЫ М (отдельно от треугольников) */}
						{/* 4. КОНТУР БУКВЫ М (исчезает после отрисовки) */}
						<motion.path
							d={PATH_M}
							fill='none'
							stroke='white'
							strokeWidth='2.5'
							strokeLinecap='round'
							strokeLinejoin='round'
							pathLength='1'
							strokeDasharray='1'
							strokeDashoffset={dashOffset}
							// Анимация исчезновения:
							animate={
								isDone
									? { opacity: 0, transition: { duration: 0.8, delay: 0.2 } }
									: { opacity: 1 }
							}
						/>

						{/* Тонкие границы треугольников для большего разделения */}
						{isDone && (
							<>
								<motion.path
									d={TRI_L_BOT}
									fill='none'
									stroke='rgba(255,255,255,0.3)'
									strokeWidth='1'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 1.5, duration: 0.5 }}
								/>
								<motion.path
									d={TRI_R_BOT}
									fill='none'
									stroke='rgba(255,255,255,0.3)'
									strokeWidth='1'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 1.6, duration: 0.5 }}
								/>
								<motion.path
									d={TRI_MAIN}
									fill='none'
									stroke='rgba(173,28,66,0.5)'
									strokeWidth='1'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 1.7, duration: 0.5 }}
								/>
							</>
						)}
					</svg>
				</div>

				{/* БРЕНДИНГ */}
				<div className='mt-16 flex flex-col items-center'>
					<div className='relative overflow-hidden py-2 px-10'>
						<motion.h1
							initial={{ y: '100%', opacity: 0 }}
							animate={isDone ? { y: 0, opacity: 1 } : {}}
							transition={{ duration: 1, delay: 1.4 }}
							className='text-6xl md:text-7xl font-black tracking-[0.3em] text-white italic uppercase'
						>
							MAVA
						</motion.h1>
						<motion.div
							initial={{ scaleX: 0 }}
							animate={isDone ? { scaleX: 1 } : {}}
							transition={{ duration: 1.5, delay: 1.8 }}
							className='absolute bottom-0 left-0 right-0 h-[2px] bg-[#ad1c42]'
						/>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

export default Progressbar
