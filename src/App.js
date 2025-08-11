import React, { useState, useEffect } from 'react';
import './assets/styles/App.css';
import { animateScroll as scroll, scroller } from 'react-scroll';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import GuitarPage from './pages/GuitarPage';
import MicrophonePage from './pages/MicrophonePage';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const toggleSearchBar = () => {
    setIsSearchVisible(prev => {
      const next = !prev;
      if (!next) setCurrentSection('');
      return next;
    });
  };

  const scrollToTop = () => {
    scroll.scrollToTop({ duration: 600, smooth: 'easeInOutQuart' });
  };

  const scrollToSection = (sectionId) => {
    scroller.scrollTo(sectionId, {
      duration: 600,
      delay: 0,
      smooth: 'easeInOutQuart',
      offset: -60,
    });
  };

  useEffect(() => {
    if (location.pathname === '/') {
      if (!['home', 'events', 'other'].includes(currentSection)) {
        setCurrentSection('home');
      }
    } else if (location.pathname.startsWith('/search')) {
      setCurrentSection('search');
    } else {
      setCurrentSection('');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isHomePage && isSearchVisible) {
      setIsSearchVisible(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const searchBarEl = document.querySelector('.search-bar-wrapper');
      const searchButtonEl = document.querySelector('[aria-label="Search"]');

      if (
          isSearchVisible &&
          searchBarEl &&
          !searchBarEl.contains(e.target) &&
          searchButtonEl &&
          !searchButtonEl.contains(e.target)
      ) {
        setIsSearchVisible(false);
        setCurrentSection('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchVisible]);

  return (
      <div className="App">
        <NavBar
            currentSection={currentSection}
            setCurrentSection={setCurrentSection}
            scrollToTop={scrollToTop}
            scrollToSection={scrollToSection}
            toggleSearchBar={toggleSearchBar}
        />

        <div className="header-bottom-fixed">
          <img src={require('./assets/torn-paper.png')} alt="Torn Paper" />
        </div>

        {isHomePage && isSearchVisible && (
            <SearchBar hideSearchBar={() => setIsSearchVisible(false)} />
        )}

        <Routes>
          <Route
              path="/"
              element={
                <main className="main-content">
                  <section className="section" id="section1" name="section1">Section 1</section>
                  <section className="section" id="section2" name="section2">Section 2</section>
                  <section className="section" id="section3" name="section3">Section 3</section>
                  <section className="section" id="section4" name="section4">Section 4</section>
                  <section className="section" id="section5" name="section5">Section 5</section>
                </main>
              }
          />
          <Route path="/search" element={<SearchResults/>}/>
          <Route path="/guitar" element={<GuitarPage/>}/>
          <Route path="/microphone" element={<MicrophonePage/>}/>
        </Routes>

        <footer className="footer">
          © 2024 heyolivia | we're not affiliated with olivia rodrigo
        </footer>
      </div>
  );
}

export default App;