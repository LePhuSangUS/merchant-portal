import { message, translate } from '@/utils'
import { useCallback, useState } from "react"

function useExport(exportExcelFunc: (params: any) => void | boolean, cb: ((...args: any[]) => void|any) = () => { }): [boolean, (params: any) => void] {
    const [isExporting, setIsExporting] = useState<boolean>(false)
    const exportExcel = useCallback(async (params: any) => {
        try {
            setIsExporting(true)
            const isSuccess = await exportExcelFunc?.(params)
            setIsExporting(false)
            if (isSuccess) cb?.()
        } catch (e) {
            setIsExporting(false)
            message?.error(translate('form.message.excel-export.fail'))
            console.error('[Export error]', e)
        }
    }, [])

    return [isExporting, exportExcel]
}

export default useExport