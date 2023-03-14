import { useState } from "react"

function useExportModal(): [boolean, () => void, () => void] {
    const [showExportModal, setShowExportModal] = useState<boolean>(false)
    const closeExportModal = () => {
        setShowExportModal(false)
    }
    const openExportModal = () => {
        setShowExportModal(true)
    }

    return [showExportModal, openExportModal, closeExportModal]
}

export default useExportModal