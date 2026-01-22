import React, { useState, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import SpecialPage from './pages/SpecialPage/SpecialPage.jsx'
import ProcurementPage from './pages/Procurement/ProcurementPage.jsx'
import ContactPage from './pages/ContactPage/ContactPage.jsx'
import ServicesPage from './pages/Services/Services.jsx'
import CustomsPage from './pages/Customs/CustomsPage.jsx'
import Progressbar from "./components/progressbar.jsx"
import Navbar from "./components/Navbar.jsx"
import { AnimatePresence, motion } from 'framer-motion'

export default function App() {
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation()

    useEffect(() => {
        // При переходе между страницами включаем лоадер
        setIsLoading(true)
    }, [location.pathname])

    return (
        <>
            {/* AnimatePresence позволяет компонентам плавно исчезать при удалении из DOM */}
            <AnimatePresence mode="wait">
                {isLoading && (
                    <Progressbar
                        key="mava-loader"
                        onComplete={() => setIsLoading(false)}
                    />
                )}
            </AnimatePresence>

            {/* Контент рендерится всегда, но мы управляем его видимостью,
                чтобы Routes не "сбрасывались" внутри AnimatePresence */}
            {!isLoading && (
                <motion.div
                    key="page-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Navbar />
                    <Routes location={location} key={location.pathname}>
                        <Route path='/' element={<Home />} />
                        <Route path='/special' element={<SpecialPage />} />
                        <Route path='/procurement' element={<ProcurementPage />} />
                        <Route path='/contacts' element={<ContactPage />} />
                        <Route path='/services' element={<ServicesPage />} />
                        <Route path='/customs' element={<CustomsPage />} />
                    </Routes>
                </motion.div>
            )}
        </>
    )
}