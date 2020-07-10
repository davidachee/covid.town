import React, { CSSProperties, useCallback, useMemo, useState } from 'react'
import './App.css'
import { useCovidData } from './hooks/useCovidData'
import { useIpLocation } from './hooks/useIpLocation'
import populationData from './populations.json'
import { distanceInMiles } from './utils/haversine'

const MAPS_API_KEY = 'AIzaSyC0K7dVWG5tYhu05ij1HwODzC4ZPgsuBpI'
const MAX_LOCATION_LENGTH = 15

function App() {
  const deaths = useCovidData()
  const { userLocation, userLocationAttempted } = useIpLocation()
  const [viewedLocations, setViewedLocations] = useState<string[]>([])

  const nearestPopulations = useMemo(() => {
    if (deaths) {
      return populationData.reduce((acc: typeof populationData, currentLocation) => {
        if (currentLocation.population > deaths) {
          return acc
        }
        if (acc.length === 0) {
          return [...acc, currentLocation]
        }
        if (Math.abs(currentLocation.population - deaths) < Math.abs(acc[acc.length -1].population - deaths)) {
          if (acc.length < MAX_LOCATION_LENGTH) {
            return [...acc, currentLocation]
          } else {
            return [...acc.slice(1), currentLocation]
          }
        }
        return acc
      }, [])
    }
  }, [deaths])

  const displayCity = useMemo(() => {
    if (userLocationAttempted && nearestPopulations?.length) {
      const filteredPopulations = nearestPopulations.filter((population) => {
        return viewedLocations.indexOf(population.id) === -1
      })
      if (userLocation) {
        return filteredPopulations.reduce((previousLocation, currentLocation) => {
          const previousDistance = distanceInMiles(previousLocation.lat, previousLocation.lng, userLocation.lat, userLocation.lng)
          const currentDistance = distanceInMiles(currentLocation.lat, currentLocation.lng, userLocation.lat, userLocation.lng)
          if (viewedLocations.indexOf(currentLocation.id) > -1) {
            return previousLocation
          }
          if (previousDistance < currentDistance) {
            return previousLocation
          }
          return currentLocation
        })
      } else {
        return filteredPopulations[filteredPopulations.length - 1]
      }
    }
    return null
  }, [userLocationAttempted, userLocation, nearestPopulations, viewedLocations])

  const onButtonClick = useCallback(() => {
    if (displayCity) {
      if (viewedLocations.length === MAX_LOCATION_LENGTH - 1) {
        setViewedLocations([])
      } else {
        setViewedLocations([...viewedLocations, displayCity.id])
      }
    }
  }, [displayCity, viewedLocations])

  const style = useMemo(() => {
    const style: CSSProperties = {}
    if (displayCity) {
      style.backgroundImage = `url('https://maps.googleapis.com/maps/api/staticmap?center=${displayCity.city},${displayCity.state}&zoom=13&size=1280x1280&scale=2&format=png&maptype=satellite&key=${MAPS_API_KEY}')`
    }
    return style
  }, [displayCity])

  return (
    <div className="App">
      <header className="App-header" style={style}>
        <p>
          {deaths?.toLocaleString()} people have died of COVID-19 in the United States.<br />
          <span className="App-header-emphasis">That's more than the population of <a href={`https://www.google.com/search?q=${displayCity?.city}, ${displayCity?.state}`}>{displayCity?.city}, {displayCity?.state}</a>: {displayCity?.population.toLocaleString()} people.</span>
        </p>
        <button onClick={onButtonClick}>
          View Another City
        </button>
      </header>
      <footer className="App-footer">
      COVID-19 data is provided by <a href="https://covidtracking.com">The COVID tracking project</a>.<br/>
      Population data provided by <a href="https://www.census.gov">The United States Census Bureau</a>.
      </footer>
    </div>
  )
}

export default App
