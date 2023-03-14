import { useEffect, useRef } from 'react'

import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect'

function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback)

    // Remember the latest callback
    useIsomorphicLayoutEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // Set up the interval
    useEffect(() => {
        if (!delay && delay !== 0) return
        const id = setInterval(() => savedCallback.current(), delay)

        return () => {
            clearInterval(id)
        }
    }, [delay])
}

export default useInterval