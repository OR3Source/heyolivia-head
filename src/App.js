import './assets/styles/App.css';
import './assets/styles/NavBar.css';
import './assets/styles/sections/Section.css';
import './assets/styles/SearchBar.css';
import NavBar from './components/NavBar';
import SearchPage from './pages/SearchPage';
import Footer from './components/Footer';
import './assets/styles/sections/Section2.css';
import './assets/styles/sections/Section1.css';
import './assets/styles/sections/Section3.css';
import './assets/styles/sections/Section4.css';
import './assets/styles/sections/Section5.css';
import Section2 from './components/Section2';
import Section3 from './components/Section3';
import Section4 from './components/Section4';
import Section5 from './components/Section5';
import FallingStars from './components/FallingStars';
import './assets/styles/HeroSection.css';
import './assets/styles/HeroSection.css';
import Section1 from './components/Section1';
import FormPage from './pages/forms/FormPage';
import NotFoundPage from './pages/errors/404';
import {Routes, Route, useLocation} from 'react-router-dom';
import {useEffect} from 'react';

function App() {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/' && location.state?.scrollToSection2) {
            const timeout = setTimeout(() => {
                const section = document.getElementById('section2');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
            }, 300);

            return () => clearTimeout(timeout);
        }
    }, [location]);

    return (
        <div className="App">
            <div className="message-container">
                <div className="message-content">
                   heylivies is coming soon.
                </div>
            </div>
            <FallingStars enabled={true}/>
            <NavBar/>
            <Routes>
                <Route
                    path="/"
                    element={
                        <main className="main-content">
                            <section className="section1" id="section1">
                                <Section1/>
                            </section>
                            <section className="section2" id="section2">
                                <Section2/>
                            </section>
                            <section className="section3" id="section3">
                                <Section3/>
                            </section>
                            <section className="section4" id="section4">
                                <Section4/>
                            </section>
                            <section className="section5" id="section5">
                                <Section5/>
                            </section>
                        </main>
                    }
                />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/forms" element={<FormPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer/>
        </div>
    );
}


export default App;