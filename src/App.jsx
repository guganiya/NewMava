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

// Функция ожидания отрисовки (гарантирует, что DOM готов)
const raf2 = () =>
    new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

// Улучшенная функция ожидания картинок
const waitForImages = (root) => {
    if (!root) return Promise.resolve()

    // Ищем все картинки и фоновые изображения (через вычисляемые стили)
    const imgs = Array.from(root.querySelectorAll('img'))

    const promises = imgs.map((img) => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve()
        return new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true })
            img.addEventListener('error', resolve, { once: true }) // Ошибка тоже считается "завершением"
        })
    })

    return Promise.all(promises)
}

export default function App() {
    const [isLoading, setIsLoading] = useState(true)
    const [routeReady, setRouteReady] = useState(false)
    const location = useLocation()
    const pageRef = useRef(null)

    useEffect(() => {
        let cancelled = false

        // При каждой смене пути включаем состояние "подготовки"
        setIsLoading(true)
        setRouteReady(false)

        const run = async () => {
            // 1. Ждем два кадра, чтобы React успел отрисовать скрытые компоненты в DOM
            await raf2()

            if (cancelled) return

            // 2. Ждем шрифты
            const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()

            // 3. Ждем все картинки внутри pageRef
            const imgsReady = waitForImages(pageRef.current)

            // 4. Ждем выполнения всех условий (с таймаутом на всякий случай 15 сек)
            await Promise.race([
                Promise.all([fontsReady, imgsReady]),
                new Promise((r) => setTimeout(r, 15000))
            ])

            if (!cancelled) {
                // Даем команду Progressbar, что можно завершаться (доходить до 100%)
                setRouteReady(true)
            }
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

            {/* ВАЖНО: Контент всегда в DOM, но opacity: 0.
                Это позволяет waitForImages найти картинки, которые еще не видны.
            */}
            <motion.div
                ref={pageRef}
                key="page-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{ visibility: isLoading ? 'hidden' : 'visible' }}
                className={isLoading ? 'fixed inset-0 overflow-hidden' : ''}
            >
                <Navbar />
                <main>
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<Home />} />
                        <Route path="/special" element={<SpecialPage />} />
                        <Route path="/procurement" element={<ProcurementPage />} />
                        <Route path="/contacts" element={<ContactPage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/customs" element={<CustomsPage />} />
                    </Routes>
                </main>
            </motion.div>
        </>
    )
}