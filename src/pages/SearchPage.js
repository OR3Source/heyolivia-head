import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import hlPagesData from '../data/hl-pages.json'
import '../assets/styles/SearchPage.css'

import cutout1 from '../assets/images/search-page/search-page-cutouts-1.svg'
import cutout2 from '../assets/images/search-page/search-page-cutouts-2.svg'
import cutout3 from '../assets/images/search-page/search-page-cutouts-3.svg'
import cutout4 from '../assets/images/search-page/search-page-cutouts-4.svg'
import cutout5 from '../assets/images/search-page/search-page-cutouts-5.svg'
import cutout6 from '../assets/images/search-page/search-page-cutouts-6.svg'

const cutouts = [cutout1, cutout2, cutout3, cutout4, cutout5, cutout6]

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function SearchPage() {
  const urlQuery = useQuery().get('q')
  const [query, setQuery] = useState(urlQuery || '')
  const [error, setError] = useState('')
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const navigate = useNavigate()

  const matchingEntries = urlQuery
    ? hlPagesData.filter((entry) =>
        Array.isArray(entry.tags) &&
        entry.tags.some((tag) =>
          tag.toLowerCase().includes(urlQuery.toLowerCase())
        )
      )
    : hlPagesData

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    } else {
      setError('Please enter a search term')
    }
  }

  const getCutoutForIndex = (index) => cutouts[index % cutouts.length]

  return (
    <div className={`main-search ${matchingEntries.length === 0 ? 'no-results' : ''}`}>
      <div className="embedded-search-container">
        <div className="embedded-search-wrapper">
          <form className="embedded-search-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="embedded-search-input"
              placeholder=""
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="embedded-search-button">
              <SearchIcon />
            </button>
          </form>
          {error && <div className="search-error">{error}</div>}
        </div>
      </div>

      <div className="search-results">
        {urlQuery ? (
          matchingEntries.length > 0 ? (
            <div className="results-wrapper">
              <h2>SEARCH RESULTS ({matchingEntries.length} FOUND)</h2>
              <div className="results-grid">
                {matchingEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="result-entry"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div
                      className="result-image-container"
                      style={{
                        backgroundImage: `url(${hoveredIndex === index ? entry.backImage : entry.frontImage})`,
                        maskImage: `url(${getCutoutForIndex(index)})`,
                        WebkitMaskImage: `url(${getCutoutForIndex(index)})`
                      }}
                    />
                    <div className="result-text">
                      <h3 className="result-title">{entry.title}</h3>
                      <p className="result-description">{entry.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <h2>No entries found for "{urlQuery}"</h2>
          )
        ) : (
          <div className="results-wrapper">
            <h2>All Entries</h2>
            <div className="results-grid">
              {hlPagesData.map((entry, index) => (
                <div
                  key={index}
                  className="result-entry"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div
                    className="result-image-container"
                    style={{
                      backgroundImage: `url(${hoveredIndex === index ? entry.backImage : entry.frontImage})`,
                      maskImage: `url(${getCutoutForIndex(index)})`,
                      WebkitMaskImage: `url(${getCutoutForIndex(index)})`
                    }}
                  />
                  <div className="result-text">
                    <h3 className="result-title">{entry.title}</h3>
                    <p className="result-description">{entry.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchPage;
