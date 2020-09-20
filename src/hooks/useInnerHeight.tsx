import { useEffect, useState } from "react";

export function useInnerHeight(): string {
    const [height, setHeight] = useState<number | null>(window.innerHeight)

    useEffect(() => {
        const onResize = () => {
            setHeight(window.innerHeight)
        }

        window.addEventListener('resize', onResize)

        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [])

    return `${height}px`
}
