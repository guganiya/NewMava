import React, { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {
	const footerRef = useRef(null)

	useLayoutEffect(() => {
		let ctx = gsap.context(() => {
			gsap.fromTo(
				footerRef.current,
				{ y: 100, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: footerRef.current,
						start: 'top 95%',
						end: 'top 80%',
						scrub: 1,
					},
				},
			)
		}, footerRef)
		return () => ctx.revert()
	}, [])

	return (
		<footer
			ref={footerRef}
			className='relative z-[50] bg-[#1a1a1a] text-white pt-20 pb-10 px-6 md:px-24 rounded-t-[2rem] isolate -mt-20'
		>
			<div className='max-w-[1200px] mx-auto relative z-[101]'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-12 mb-14'>
					{/* LOGO & DESCRIPTION */}
					<div className='space-y-6'>
						<Link to='/' className='flex items-center gap-4 group'>
							{/* ЛОГОТИП */}
							<img
								src='/logo.png'
								alt='Logo'
								className='h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-110'
							/>
							{/* ТЕКСТ РЯДОМ С ЛОГО */}
							<div className='flex flex-col leading-none'>
								<span className='text-xl font-black uppercase tracking-tighter transition-colors group-hover:text-[#AD1C42]'>
									Mava
								</span>
								<span className='text-[9px] text-[#AD1C42] tracking-[0.3em] font-bold uppercase mt-1'>
									Logistics
								</span>
							</div>
						</Link>
						<p className='text-gray-300 text-sm font-light leading-relaxed max-w-[220px]'>
							Moving cargo, managing time. Full responsibility end to end.
						</p>
					</div>

					{/* NAVIGATION */}
					<div>
						<h4 className='text-[11px] font-black uppercase tracking-[0.2em] text-[#AD1C42] mb-7'>
							Navigation
						</h4>
						<ul className='space-y-3 text-[14px] text-gray-300 font-medium'>
							<li>
								<Link
									to='/services'
									className='hover:text-white transition-all inline-block hover:translate-x-1 duration-300'
								>
									Services
								</Link>
							</li>
							<li>
								<Link
									to='/special'
									className='hover:text-white transition-all inline-block hover:translate-x-1 duration-300'
								>
									Special
								</Link>
							</li>
							<li>
								<Link
									to='/procurement'
									className='hover:text-white transition-all inline-block hover:translate-x-1 duration-300'
								>
									Procurement
								</Link>
							</li>
							<li>
								<Link
									to='/'
									className='hover:text-white transition-all inline-block hover:translate-x-1 duration-300'
								>
									About
								</Link>
							</li>
						</ul>
					</div>

					{/* SERVICES */}
					<div>
						<h4 className='text-[11px] font-black uppercase tracking-[0.2em] text-[#AD1C42] mb-7'>
							Services
						</h4>
						<ul className='space-y-3 text-[14px] text-gray-300 font-medium'>
							<li>
								<Link
									to='/services'
									className='hover:text-white transition-all inline-block hover:translate-x-1 duration-300'
								>
									Air Freight
								</Link>
							</li>
							<li>
								<Link
									to='/services'
									className='hover:text-white transition-all inline-block hover:translate-x-1 duration-300'
								>
									Sea Freight
								</Link>
							</li>
							<li>
								<Link
									to='/services'
									className='hover:text-white transition-all inline-block hover:translate-x-1 duration-300'
								>
									Road Freight
								</Link>
							</li>
							<li>
								<Link
									to='/services'
									className='hover:text-white transition-all inline-block hover:translate-x-1 duration-300'
								>
									Rail Freight
								</Link>
							</li>
						</ul>
					</div>

					{/* CONTACTS */}
					<div>
						<h4 className='text-[11px] font-black uppercase tracking-[0.2em] text-[#AD1C42] mb-7'>
							Contacts
						</h4>
						<div className='space-y-6'>
							<div className='group'>
								<p className='text-[10px] uppercase text-gray-300 mb-1 tracking-widest'>
									Email
								</p>
								<Link
									to='mailto:info@ma-va.net'
									className='text-sm font-bold group-hover:text-[#AD1C42] transition-colors'
								>
									info@ma-va.net
								</Link>
							</div>
							<div className='group'>
								<p className='text-[10px] uppercase text-gray-300 mb-1 tracking-widest'>
									Phone
								</p>
								<Link
									to='tel:+993 62 200285'
									className='text-sm font-bold text-white group-hover:text-[#AD1C42] transition-colors'
								>
									+993 62 200285
								</Link>
							</div>
						</div>
					</div>
				</div>

				{/* BOTTOM SECTION */}
				<div className='pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6'>
					<p className='text-[10px] uppercase tracking-[0.3em] text-gray-300'>
						© 2026 MAVA Logistics. All rights reserved.
					</p>

				</div>
			</div>
		</footer>
	)
}

export default Footer
