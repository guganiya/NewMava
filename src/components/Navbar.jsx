import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [isOpen])

    const navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'SERVICES', path: '/services' },
        { name: 'SPECIAL', path: '/special' },
        { name: 'PROCUREMENT', path: '/procurement' },
        { name: 'CUSTOMS', path: '/customs' },
        { name: 'CONTACTS', path: '/contacts' },
    ]

    const fontStyle = {
        fontFamily: '"Segoe Variable Display", "Segoe UI", system-ui, sans-serif',
    }

    return (
        <nav
            style={fontStyle}
            className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-500 ${
                isScrolled
                    ? 'bg-zinc-900/70 backdrop-blur-lg shadow-lg pt-2' // Более светлый при скролле
                    : 'bg-gradient-to-b from-zinc-900/80 to-transparent pt-6' // Мягкий градиент
            }`}
        >
            <div className='max-w-full mx-auto px-6 md:px-12'>
                <div className='flex items-center justify-between h-20 md:h-24'>

                    <Link to='/' className='relative z-[10000] flex-shrink-0'>
                        <img
                            src='/logo.png'
                            alt='Logo'
                            className='h-12 md:h-17 w-auto object-contain transition-transform duration-300 hover:scale-105'
                        />
                    </Link>

                    <div className='hidden md:block'>
                        <div className='flex items-center space-x-1 lg:space-x-4'>
                            {navLinks.map(link => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className='relative text-white text-[14px] font-semibold tracking-[0.2em] transition-all duration-300 group px-6 py-4'
                                >
                                    <span className='absolute top-0 left-6 right-6 h-[3px] bg-[#AD1C42] scale-x-0 transition-transform duration-300 origin-right group-hover:scale-x-100 opacity-60'></span>
                                    <span className='relative z-10 drop-shadow-lg'>{link.name}</span>
                                    <span className='absolute bottom-0 left-6 right-6 h-[3px] bg-[#AD1C42] scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100 opacity-60'></span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className='md:hidden relative z-[10000]'>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className='text-white p-2 transition-transform active:scale-90 outline-none'
                        >
                            {isOpen ? <X size={35} /> : <Menu size={35} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            <div
                className={`md:hidden fixed inset-0 w-full h-screen z-[9998] transition-all duration-500 ease-in-out ${
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
            >
                {/* Изменен цвет: вместо черного используем полупрозрачный Zinc-900 */}
                <div
                    className="absolute inset-0 bg-zinc-900/80 backdrop-blur-2xl transition-opacity duration-500"
                    onClick={() => setIsOpen(false)}
                />

                <div className='relative flex flex-col items-center justify-center h-full space-y-10 px-6'>
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-white text-2xl font-light tracking-[0.4em] text-center transition-all duration-700 transform ${
                                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                            }`}
                            style={{
                                transitionDelay: isOpen ? `${index * 80}ms` : '0ms',
                                ...fontStyle
                            }}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}

export default Navbar