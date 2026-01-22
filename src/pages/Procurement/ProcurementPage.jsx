import Navbar from '../../components/Navbar.jsx'
import ScrollProgressCircle from '../../components/ScrollProgressCircle.jsx' // Импортируй его
import ProcurementHero from './components/ProcurementHero.jsx'
import ProcurementSystem from './components/ProcurementSteps.jsx'
import Footer from '../../components/Footer.jsx'
import BackgroundRibbons from '../../components/BackgroundRibbons.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import FaqAndCta from './components/FaqAndCta.jsx'

export default function ProcurementPage() {
	return (
		// Обязательно bg-[#eeeeee] здесь, а не внутри секций
		<main className='relative bg-[#eeeeee] min-h-screen'>
			{/* Ленты теперь сзади (z-[-1]) */}
			<BackgroundRibbons count={10} />

			{/* Контент принудительно выводим вперед (z-10) */}
			<div className='relative z-10'>
				<Navbar />
				<ProcurementHero />
				<ProcurementSystem />
				<HowItWorks />
				<FaqAndCta />
				<Footer />
			</div>
		</main>
	)
}
