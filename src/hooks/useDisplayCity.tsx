import { useMemo } from "react"
import { MAX_LOCATION_LENGTH } from "../data/constants"
import populationData from '../data/populations.json'
import { distanceInMiles } from "../utils/haversine"
import { useIpLocation } from "./useIpLocation"

export function useDisplaceCity(deaths: number | null, viewedLocations: string[]) {
    const { userLocation, userLocationAttempted } = useIpLocation()

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

    return displayCity
}
