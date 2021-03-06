import { startCase } from 'lodash'
import React, { useCallback, useState } from 'react'
import './App.css'
import { MAX_LOCATION_LENGTH } from './data/constants'
import { useCovidData } from './hooks/useCovidData'
import { useDisplaceCity } from './hooks/useDisplayCity'
import { useNearestPopulations } from './hooks/useNearestPopulations'
import { usePreloadImages } from './hooks/usePreloadImages'
import { useStyle } from './hooks/useStyle'

function App() {
  const deaths = useCovidData()
  const [viewedLocations, setViewedLocations] = useState<string[]>([])
  const nearestPopulations = useNearestPopulations(deaths)
  const displayCity = useDisplaceCity(nearestPopulations, viewedLocations)
  const style = useStyle(displayCity)

  usePreloadImages(nearestPopulations, displayCity)

  const onButtonClick = useCallback(() => {
    if (displayCity) {
      if (viewedLocations.length === MAX_LOCATION_LENGTH - 1) {
        setViewedLocations([])
      } else {
        setViewedLocations([...viewedLocations, displayCity.id])
      }
    }
  }, [displayCity, viewedLocations])

  return (
    <div className="App">
      <header className="App-header" style={style}>
        <p>
          {deaths?.toLocaleString()} people have died of COVID-19 in the United States.<br />
          <span className="App-header-emphasis">That's more than the population of <a href={`https://www.google.com/search?q=${displayCity?.city}, ${displayCity?.state}`}>{startCase(displayCity?.city)}, {displayCity?.state}</a>: {displayCity?.population.toLocaleString()} people.</span>
        </p>
        <button onClick={onButtonClick}>
          View Another City
        </button>
      </header>
      <footer className="App-footer">
      COVID-19 data is provided by <a href="https://covidtracking.com">The COVID Tracking Project</a>.<br/>
      Population data provided by <a href="https://www.census.gov">The United States Census Bureau</a>.
      </footer>
    </div>
  )
}

export default App
