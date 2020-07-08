import React, { CSSProperties, useEffect, useMemo, useState } from 'react'
import './App.css'
import populationData from './populations.json'

const MAPS_API_KEY = 'AIzaSyC0K7dVWG5tYhu05ij1HwODzC4ZPgsuBpI'

function App() {
  const [deaths, setDeaths] = useState<number | null>(null)
  const [location, setLocation] = useState<typeof populationData[0] | null>(null)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('https://covidtracking.com/api/v1/us/current.json')
      const json = await res.json() as unknown
      if (json && Array.isArray(json) && json[0] && json[0].death) {
        setDeaths(json[0].death)
      }
    }
    fetchData()
  }, [setDeaths])

  useEffect(() => {
    if (deaths) {
      const closest = populationData.reduce((a, b) => {
        if (b.population > deaths) {
          return a
        }
        return Math.abs(b.population - deaths) < Math.abs(a.population - deaths) ? b : a
      })
      setLocation(closest)
    }
  }, [deaths])

  const style = useMemo(() => {
    const style: CSSProperties = {}
    if (location) {
      style.backgroundImage = `url('https://maps.googleapis.com/maps/api/staticmap?center=${location.city},${location.state}&zoom=13&size=1280x1280&scale=2&format=png&maptype=satellite&key=${MAPS_API_KEY}')`
    }
    return style
  }, [location])

  return (
    <div className="App">
      <header className="App-header" style={style}>
        <p>
          {deaths?.toLocaleString()} people have died of COVID-19 in the United States.<br />
          That's more than the population of <a href={`https://www.google.com/search?q=${location?.city}, ${location?.state}`}>{location?.city}, {location?.state}</a>: {location?.population.toLocaleString()} people.
        </p>
      </header>
      <footer className="App-footer">
      COVID-19 data is provided by <a href="https://covidtracking.com">The COVID tracking project</a>.
      Population data provided by <a href="https://www.census.gov">The United States Census Bureau</a>.
      </footer>
    </div>
  )
}

export default App
