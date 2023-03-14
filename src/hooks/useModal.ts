import { useState } from "react"

function useModal(defaultValue?: boolean): [boolean, () => void, () => void] {
    const [showModal, setShowModal] = useState<boolean>(defaultValue || false)
    const closeModal = () => {
        setShowModal(false)
    }
    const openModal = () => {
        setShowModal(true)
    }

    return [showModal, openModal, closeModal]
}

export default useModal