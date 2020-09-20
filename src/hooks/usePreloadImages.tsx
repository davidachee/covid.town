import { useRef } from "react";
import { MAPS_API_KEY } from "../data/constants";
import { DisplayCity } from "../types/DisplayCity";

export function usePreloadImages(nearestPopulations: DisplayCity[] | null, displayCity: DisplayCity | null) {
    const preloadedCities = useRef<Set<string>>(new Set())

    if (displayCity) {
        nearestPopulations?.forEach((unloadedCity) => {
            const { id } = unloadedCity
            if (!preloadedCities.current.has(id)) {
                const preloadImage = new Image()
                preloadImage.src = `https://maps.googleapis.com/maps/api/staticmap?center=${unloadedCity.city},${unloadedCity.state}&zoom=13&size=1280x1280&scale=2&format=png&maptype=satellite&key=${MAPS_API_KEY}`
                preloadedCities.current.add(id)
            }
        })
    }
}
