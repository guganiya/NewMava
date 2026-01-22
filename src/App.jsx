import React, { useState, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/home/Home.jsx'
import SpecialPage from './pages/SpecialPage/SpecialPage.jsx'
import ProcurementPage from './pages/Procurement/ProcurementPage.jsx'
import ContactPage from './pages/ContactPage/ContactPage.jsx'
import ServicesPage from './pages/services/Services.jsx'
import CustomsPage from './pages/Customs/CustomsPage.jsx'
import Progressbar from "./components/progressbar.jsx"
import Navbar from "./components/Navbar.jsx"

export default function App() {
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation() // Следит за изменением страницы

    useEffect(() => {
        // Включаем лоадер при переходе
        setIsLoading(true)

        // Увеличиваем время задержки.
        // 3000ms (3 секунды) хватит, чтобы шкала дошла до конца,
        // превратилась в "M" и немного "повисела" для красоты.
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 3000)

        return () => clearTimeout(timer)
    }, [location.pathname]) // Запускается КАЖДЫЙ РАЗ, когда меняется адрес страницы

    return (
        <>
            {/* Если isLoading true — показываем лоадер, иначе — контент */}
            {isLoading ? (
                <Progressbar />
            ) : (
                <div className="fade-in"> {/* Можно добавить CSS класс для плавного появления контента */}
                    <Navbar />
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/special' element={<SpecialPage />} />
                        <Route path='/procurement' element={<ProcurementPage />} />
                        <Route path='/contacts' element={<ContactPage />} />
                        <Route path='/services' element={<ServicesPage />} />
                        <Route path='/customs' element={<CustomsPage />} />
                    </Routes>
                </div>
            )}
        </>
    )
}