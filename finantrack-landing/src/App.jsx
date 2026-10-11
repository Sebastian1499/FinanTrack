import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Proposal from './components/Proposal';
import ImpactStats from './components/ImpactStats';
import Gallery from './components/Gallery';
import AboutUs from './components/AboutUs';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Proposal />
        <ImpactStats />
        <Gallery />
        <AboutUs />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}

export default App;
