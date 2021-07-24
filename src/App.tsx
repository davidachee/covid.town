
import { useCallback, useState } from 'react'
import { MAX_LOCATION_LENGTH } from './data/constants'
import { useCovidData } from './hooks/useCovidData'
import { useDisplaceCity } from './hooks/useDisplayCity'
import { useNearestPopulations } from './hooks/useNearestPopulations'
import { usePreloadImages } from './hooks/usePreloadImages'
import { useStyle } from './hooks/useStyle'
import { getDisplayCityName } from './utils/getDisplayCityName'

import './App.css'

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
          {displayCity && <span className="App-header-emphasis">That's more than the population of <a href={`https://www.google.com/search?q=${displayCity.city}, ${displayCity.state}`}>{getDisplayCityName(displayCity.city, displayCity.state)}</a>: {displayCity.population.toLocaleString()} people.</span>}
        </p>
        <button onClick={onButtonClick}>
          View Another City
        </button>
      </header>
      <footer className="App-footer">
      COVID-19 data is provided by <a href="https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html">The New York Times</a>.<br/>
      Population data provided by <a href="https://www.census.gov">The United States Census Bureau</a>.
      </footer>
    </div>
  )
}

export default App
