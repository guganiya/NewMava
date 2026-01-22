import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const faqData = [
	{
		question: 'Can you work with my existing supplier?',
		answer:
			'Yes, we can perform due diligence on your current partners, audit their facilities, and take over the quality control process to ensure they meet your standards.',
	},
	{
		question: 'What do you need to start?',
		answer:
			"Ideally, we need technical drawings, material specifications, and your target price. If you don't have these, we can help you develop the requirements from scratch.",
	},
	{
		question: 'Do you only source in China?',
		answer:
			'While China is our primary hub, we also have networks in Vietnam, India, and Turkey, depending on the specific product category and your logistics needs.',
	},
]

const FaqAndCta = () => {
	const [openIndex, setOpenIndex] = useState(null)

	return (
		<section
			className='bg-white py-20 px-6 md:px-24'
			style={{ fontFamily: "'Segoe UI Variable Display', sans-serif" }}
		>
			<div className='max-w-6xl mx-auto mb-28'>
				{/* Уменьшен заголовок FAQ с 8xl до 6xl */}
				<h2 className='text-5xl md:text-6xl font-[900] text-[#000] uppercase italic tracking-tighter leading-none mb-3'>
					FAQ
				</h2>
				<p className='text-gray-400 font-bold tracking-[0.25em] text-[9px] uppercase mb-12 ml-1'>
					Коротко и по делу.
				</p>

				<div className='space-y-4'>
					{faqData.map((item, index) => {
						const isOpen = openIndex === index
						return (
							<div
								key={index}
								className='group border border-gray-100 rounded-[25px] md:rounded-[35px] overflow-hidden bg-white shadow-[0_5px_20px_rgba(0,0,0,0.02)] transition-all duration-500'
							>
								<button
									onClick={() => setOpenIndex(isOpen ? null : index)}
									className='w-full flex items-center justify-between p-7 md:p-9 text-left transition-colors'
								>
									{/* Уменьшен шрифт вопроса с 2xl до lg/xl */}
									<span
										className={`text-lg md:text-xl font-[800] tracking-tight transition-colors duration-300 ${isOpen ? 'text-[#AD1C42]' : 'text-[#000]'}`}
									>
										{item.question}
									</span>

									{/* Кнопка Плюс (чуть компактнее) */}
									<div
										className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-[#AD1C42] rotate-45' : 'bg-[#AD1C42]/5'}`}
									>
										<div
											className={`absolute w-3.5 h-[2px] rounded-full ${isOpen ? 'bg-white' : 'bg-[#AD1C42]'}`}
										/>
										<div
											className={`absolute h-3.5 w-[2px] rounded-full ${isOpen ? 'bg-white' : 'bg-[#AD1C42]'}`}
										/>
									</div>
								</button>

								<AnimatePresence>
									{isOpen && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: 'auto', opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
										>
											<div className='px-7 md:px-9 pb-9 flex gap-5'>
												<div className='w-[2.5px] bg-[#AD1C42] rounded-full shrink-0 my-1' />
												{/* Уменьшен текст ответа до base */}
												<div className='text-gray-500 text-sm md:text-base leading-relaxed max-w-3xl italic font-medium'>
													{item.answer}
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						)
					})}
				</div>
			</div>

			{/* --- БЛОК CTA --- */}
			<div className='max-w-6xl mx-auto mb-10'>
				<div className='relative bg-white border border-gray-100 rounded-[40px] md:rounded-[55px] p-10 md:p-16 shadow-[0_25px_80px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10'>
					<div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#AD1C42]/3 via-transparent to-transparent pointer-events-none' />

					<div className='relative z-10 max-w-xl text-center md:text-left'>
						{/* Уменьшен заголовок CTA с 6xl до 4xl/5xl */}
						<h3 className='text-3xl md:text-5xl font-[900] text-[#000] uppercase italic tracking-tighter leading-[0.95] mb-5'>
							Ready to procure <br /> without chaos?
						</h3>
						{/* Уменьшено описание до sm/base */}
						<p className='text-gray-500 text-sm md:text-base font-medium opacity-80 italic'>
							We’ll build a controlled sourcing pipeline — from first request to
							final unloading at your warehouse.
						</p>
					</div>
					<div className='relative z-10 flex flex-col sm:flex-row gap-4 shrink-0'>
						{/* Кнопка Contact MAVA теперь Link */}
						<Link
							to='/contacts'
							className='group relative px-10 py-5 bg-[#AD1C42] text-white rounded-full font-bold uppercase text-[10px] tracking-[0.2em] transition-all shadow-lg shadow-[#AD1C42]/20 active:scale-95 inline-flex items-center justify-center'
						>
							<span className='relative'>
								Contact MAVA
								{/* Линия под текстом при наведении */}
								<span className='absolute left-0 -bottom-1 w-0 h-[1.5px] bg-white transition-all duration-300 group-hover:w-full' />
							</span>
						</Link>

						{/* Кнопка Back to top остается кнопкой со скроллом */}
						<button
							onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
							className='group relative px-10 py-5 border border-gray-200 text-[#000] rounded-full font-bold uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-gray-50 active:scale-95'
						>
							<span className='relative'>
								Back to top
								{/* Линия под текстом при наведении */}
								<span className='absolute left-0 -bottom-1 w-0 h-[1.5px] bg-[#000] transition-all duration-300 group-hover:w-full' />
							</span>
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}

export default FaqAndCta
