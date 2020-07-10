import { useEffect, useState } from "react"

type IpInfoResponse = {
    loc: string
}

type latLngObject = {
    lat: number
    lng: number
}

export function useIpLocation() {
    const [userLocation, setUserLocation] = useState<latLngObject | null>(null)
    const [userLocationAttempted, setUserLocationAttempted] = useState<boolean>(false)

    useEffect(() => {
        async function getUserLocation() {
            try {
                const res = await fetch('https://ipinfo.io?token=704e1fdf28f533')
                const json = await res.json() as IpInfoResponse

                if (json) {
                    const parsedLocation = json.loc.split(',')
                    if (parsedLocation.length === 2) {
                        setUserLocation({
                            lat: parseFloat(parsedLocation[0]),
                            lng: parseFloat(parsedLocation[1])
                        })
                    }
                }

                setUserLocationAttempted(true)
            } catch(_e) {
                setUserLocationAttempted(true)
            }
        }

        getUserLocation()
    }, [])

    return {
        userLocation,
        userLocationAttempted
    }
}
