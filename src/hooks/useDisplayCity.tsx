import { useMemo } from "react"
import { DisplayCity } from "../types/DisplayCity"
import { distanceInMiles } from "../utils/haversine"
import { useIpLocation } from "./useIpLocation"

export function useDisplaceCity(nearestPopulations: DisplayCity[] | null, viewedLocations: string[]) {
    const { userLocation, userLocationAttempted } = useIpLocation()

    return useMemo(() => {
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
}
