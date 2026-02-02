import React, { useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import SpecialPage from './pages/SpecialPage/SpecialPage.jsx'
import ProcurementPage from './pages/Procurement/ProcurementPage.jsx'
import ContactPage from './pages/ContactPage/ContactPage.jsx'
import ServicesPage from './pages/Services/Services.jsx'
import CustomsPage from './pages/Customs/CustomsPage.jsx'
import Progressbar from './components/progressbar.jsx'
import Navbar from './components/Navbar.jsx'
import { AnimatePresence, motion } from 'framer-motion'

const raf2 = () =>
    new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

const waitForImages = (root, timeoutMs = 12000) => {
    if (!root) return Promise.resolve()

    const imgs = Array.from(root.querySelectorAll('img'))
    if (!imgs.length) return Promise.resolve()

    const pending = imgs.filter((img) => !(img.complete && img.naturalWidth > 0))
    if (!pending.length) return Promise.resolve()

    return new Promise((resolve) => {
        let done = false
        const finish = () => {
            if (done) return
            done = true
            resolve()
        }

        const t = setTimeout(finish, timeoutMs)

        let left = pending.length
        const onOne = () => {
            left -= 1
            if (left <= 0) {
                clearTimeout(t)
                finish()
            }
        }

        pending.forEach((img) => {
            img.addEventListener('load', onOne, { once: true })
            img.addEventListener('error', onOne, { once: true })
        })
    })
}

export default function App() {
    const [isLoading, setIsLoading] = useState(true)
    const [routeReady, setRouteReady] = useState(false)

    const location = useLocation()
    const pageRef = useRef(null)

    useEffect(() => {
        let cancelled = false

        setIsLoading(true)
        setRouteReady(false)

        const run = async () => {
            // дать React смонтировать страницу и начать грузить ресурсы
            await raf2()

            const fontsReady =
                document.fonts?.ready?.catch?.(() => undefined) ?? Promise.resolve()

            const imgsReady = waitForImages(pageRef.current, 12000)

            // если что-то зависло — все равно отпускаем (но обычно успевает)
            await Promise.race([
                Promise.all([fontsReady, imgsReady]),
                new Promise((r) => setTimeout(r, 13000)),
            ])

            if (!cancelled) setRouteReady(true)
        }

        run()

        return () => {
            cancelled = true
        }
    }, [location.pathname])

    return (
        <>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <Progressbar
                        key="mava-loader"
                        ready={routeReady}
                        onComplete={() => setIsLoading(false)}
                    />
                )}
            </AnimatePresence>

            {/* контент ВСЕГДА смонтирован, но скрыт, пока идет лоадер */}
            <motion.div
                ref={pageRef}
                key="page-content"
                initial={false}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={isLoading ? 'pointer-events-none select-none' : ''}
            >
                <Navbar />
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route path="/special" element={<SpecialPage />} />
                    <Route path="/procurement" element={<ProcurementPage />} />
                    <Route path="/contacts" element={<ContactPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/customs" element={<CustomsPage />} />
                </Routes>
            </motion.div>
        </>
    )
}
