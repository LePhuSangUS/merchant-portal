import { useEffect, useState } from "react"
import { getSysConfig } from "@/services/sysconfig/api"
import { message, translate } from '@/utils'

const useGetSysConfig = (key: string) => {
    const [sysData, setSysData] = useState<any[]>([])

    useEffect(() => {
        const getPaymentMethod = async () => {
            try {
                const resp = await getSysConfig(key)
                if(resp?.success)
                    setSysData(resp?.data)
                else 
                    message.error(translate('message.hooks.sysconfig.error'))
            } catch (error) {
                message.error(translate('message.hooks.sysconfig.error'))
                console.error('[Get system config error] ', error)
            }
        }
        if(key) getPaymentMethod()
    }, [])

    return sysData
}

export default useGetSysConfig