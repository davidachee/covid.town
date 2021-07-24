import papa from 'papaparse';
import { useEffect, useState } from "react"

interface CovidData {
    data: [{ deaths: string }]
}

function isCovidData(parsedCSV: unknown): parsedCSV is CovidData {
    return !!parsedCSV && !!(parsedCSV as CovidData).data && !!(parsedCSV as CovidData).data[0].deaths
  }

export function useCovidData() {
    const [deaths, setDeaths] = useState<number | null>(null)

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us.csv')
            const rawData = await res.text()
            const parsed = await papa.parse(rawData, { header: true }) as unknown
            if (isCovidData(parsed)) {
                setDeaths(parseInt(parsed.data[0].deaths))
            }
        }
        fetchData()
    }, [setDeaths])

    return deaths
}
