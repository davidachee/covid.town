import { useEffect, useState } from "react"

export function useCovidData() {
    const [deaths, setDeaths] = useState<number | null>(null)

    useEffect(() => {
        async function fetchData() {
            const res = await fetch('https://api.covidtracking.com/v1/us/current.json')
            const json = await res.json() as unknown
            if (json && Array.isArray(json) && json[0] && json[0].death) {
                setDeaths(json[0].death)
            }
        }
        fetchData()
    }, [setDeaths])

    return deaths
}
