import { CSSProperties, useMemo } from "react"
import { DisplayCity } from "../types/DisplayCity"
import { useInnerHeight } from "./useInnerHeight"

const MAPS_API_KEY = 'AIzaSyC0K7dVWG5tYhu05ij1HwODzC4ZPgsuBpI'

export function useStyle(displayCity: DisplayCity | null) {
    const height = useInnerHeight()

    return useMemo(() => {
        const style: CSSProperties = {
            height
        }

        if (displayCity) {
            style.backgroundImage = `url('https://maps.googleapis.com/maps/api/staticmap?center=${displayCity.city},${displayCity.state}&zoom=13&size=1280x1280&scale=2&format=png&maptype=satellite&key=${MAPS_API_KEY}')`
        }

        return style
    }, [displayCity, height])
}
