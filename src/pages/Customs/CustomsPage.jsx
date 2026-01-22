import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import CustomsHero from "./components/CustomsHero.jsx";
import CustomsProcess from "./components/CustomsProcess.jsx";
import BackgroundRibbons from '../../components/BackgroundRibbons.jsx'
import ContactSection from './components/ContactSection.jsx'

export default function CustomsPage () {
    return (
        <>

            <Navbar />
            <CustomsHero />
            <CustomsProcess />
            <ContactSection />
            <Footer />

            {/* Укажи адрес следующей страницы в nextTarget */}
        </>
    )
}
