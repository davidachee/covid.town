import { startCase } from 'lodash'

export function getDisplayCityName(city: string, state: string) {
    if (city !== state) {
        return `${startCase(city)}, ${state}`
    }
    return state
}