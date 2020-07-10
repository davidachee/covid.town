function degreesToRadians(degrees: number) {
    return degrees * Math.PI / 180
}

export function distanceInMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
    const earthRadiusMiles = 3959

    const dLat = degreesToRadians(lat2 - lat1)
    const dLon = degreesToRadians(lon2-lon1)

    const rad1 = degreesToRadians(lat1)
    const rad2 = degreesToRadians(lat2)

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(rad1) * Math.cos(rad2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return earthRadiusMiles * c
}
