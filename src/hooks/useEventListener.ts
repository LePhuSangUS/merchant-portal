
import { useRef, useEffect } from 'react'
import useIsClient from './useIsClient'

function useEventListener(eventName: string, handler: (...args: any[]) => void, element?: any) {
    const savedHandler = useRef<any>()
    const isClient = useIsClient()

    // init element, default is window
    if (!element) {
        element = isClient ? window : undefined
    }

    useEffect(() => {
        savedHandler.current = handler
    }, [handler])

    useEffect(() => {
        // Make sure element supports addEventListener
        const isSupported = element && element.addEventListener
        if (!isSupported) return

        const eventListener = (event: Event) => savedHandler.current(event)
        element.addEventListener(eventName, eventListener)

        return () => {
            element.removeEventListener(eventName, eventListener)
        }
    }, [eventName, element])
}

export default useEventListener