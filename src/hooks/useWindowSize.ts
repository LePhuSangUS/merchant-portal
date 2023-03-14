
import { useState } from 'react'
import useEventListener from './useEventListener'
import useIsClient from './useIsClient'

function useWindowSize(initialWidth: number = 0, initialHeight: number = 0) {
    const isClient = useIsClient()
    const [windowSize, setWindowSize] = useState({
        width: isClient ? window.innerWidth : initialWidth,
        height: isClient ? window.innerHeight : initialHeight,
    })

    useEventListener('resize', () => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        })
    })

    return windowSize
}

export default useWindowSize