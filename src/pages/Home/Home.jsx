import Navbar from '../../components/Navbar.jsx'
import Hero from '../Home/Hero/Hero.jsx'
import MainSections from '../Home/MainSections/MainSections.jsx'
import Footer from '../../components/Footer.jsx'
import ScrollProgressCircle from '../../components/ScrollProgressCircle.jsx' // Импортируй его

export default function Home() {
	return (
		<>
			<Navbar />
			<main>
				<Hero />
				<MainSections />
				<Footer />
			</main>

			{/* Укажи адрес следующей страницы в nextTarget */}
		</>
	)
}
