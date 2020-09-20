import { useMemo } from "react"
import { MAX_LOCATION_LENGTH } from "../data/constants"
import populationData from '../data/populations.json'

export function useNearestPopulations(deaths: number | null) {
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

    return nearestPopulations || null
}
