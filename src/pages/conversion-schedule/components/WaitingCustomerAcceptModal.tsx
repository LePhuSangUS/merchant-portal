import React, { useEffect, useState, useRef } from "react"
import { Modal, Title, Progress } from "@/components"
import { translate } from "@/utils"

// TODO: waiting to add api
const initProgess = 10
const WaitingCustomerAcceptModal: React.FC<any> = (props) => {
    const [progress, setProgress] = useState(initProgess)
    let timerId = useRef<any>()

    useEffect(() => {
        timerId.current = setInterval(() => {
            setProgress(prev => prev - 1)
        }, 1000)

        return () => {
            clearInterval(timerId.current)
        }
    }, [])

    useEffect(() => {
        if (progress === 0) {
            clearInterval(timerId.current)

            if (Math.round(Math.random() * 2) === 0) {
                props?.onCancel()
            } else {
                props?.onOk()
            }
        }

    }, [progress])

    const formatProgess = (val: any) => {
        return Math.round(val / (100 / initProgess)) + 's'
    }

    const calculatePercent = () => {
        return ((100 / initProgess) * (progress)).toFixed(2)
    }

    return (
        <Modal {...props}>
            <div style={{ textAlign: 'center' }}>
                <Title level={4}>{translate("investment.conversionScheduleDetail.modal.waitingContent")}</Title>
                <br />
                <Progress strokeColor="orange" percent={calculatePercent()} format={formatProgess} />
            </div>
        </Modal>
    )
}

export default WaitingCustomerAcceptModal;