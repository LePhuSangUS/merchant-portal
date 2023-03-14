import _ from "lodash"
import { trackingOnboarding } from "@/services/user/api"
import { getLocalStorage as getStorage, removeLocalStorage as removeStorage, setLocalStorage as setStorage } from "@/utils/storage"
import { create_UUID } from "@/utils/utils"
import { env } from "@/env";

export const REGISTER_DATA_STEP_KEY = {
    1: 'REGISTER_DATA_STEP_1',
    2: 'REGISTER_DATA_STEP_2',
    3: 'REGISTER_DATA_STEP_3',
}
export const REGISTER_STEP = 'REGISTER_STEP'
export const REGISTER_UUID = 'REGISTER_UUID'
export const TRACKING_STATE = {
    0: 'REQ_STARTED',
    1: 'REQ_BASIC_INFO_ENTERED',
    2: 'REQ_KYC_PASSED',
    3: 'REQ_SUBMITED',
}
export const TRACKING_STEP = 'TRACKING_STEP'
const OCR_DATA_KEY = 'ocr_data'
const OCR_EDITED_KEY = 'ocr_data_edited'

// general
export const parseStrObj = (data: string) => {
    try {
        return JSON.parse(data) || {}
    } catch (error) {
        return {}
    }
}

const generateImgUrl = (file: ObjectType): string => file ? `${env.FILE_API_URL}/img/${file?.fileName}.${file?.fileType}` : ''

// register uuid
export const setRegisterUUID = () => {
    const uuid = getRegisterUUID()
    if (!uuid) {
        setStorage(REGISTER_UUID, create_UUID())
    }
}
export const getRegisterUUID = (): string => {
    return getStorage(REGISTER_UUID)
}
export const removeRegisterUUID = () => {
    removeStorage(REGISTER_UUID)
}


// step data
export const setStepData = (step: StepType, value: ObjectType) => {
    const old = getStepData(step)

    // delete storage value to avoid merge array value of cascader component
    if(value?.hasOwnProperty('businessLine')) {
        delete old.businessLine
    }
    setStorage(REGISTER_DATA_STEP_KEY[step], _.merge(old, value))
}

export const removeStepData = (step: StepType) => {
    removeStorage(REGISTER_DATA_STEP_KEY[step])
    if (step == 3) {
        removeOcrEdited()
        removeOcrData()
    }
}

export const getStepData = (step: StepType) => parseStrObj(getStorage(REGISTER_DATA_STEP_KEY[step]))

export const removeAllStepData = () => {
    Object.values(REGISTER_DATA_STEP_KEY)?.forEach((key: string) => {
        removeStorage(key)
    })
    removeStep()
    removeRegisterUUID()
    removeTrackedStep()
    removeOcrData()
    removeOcrEdited()
}

// step
export const getCurrentStep = (): StepType => Number(getStorage(REGISTER_STEP))
export const setStep = (step: StepType) => setStorage(REGISTER_STEP, step)
export const removeStep = () => {
    removeStorage(REGISTER_STEP)
}

// tracking step
export const setTrackedStep = (step: StepType) => setStorage(TRACKING_STEP, `tracked-step-${step}`)
export const getTrackedStep = () => getStorage(TRACKING_STEP)
export const removeTrackedStep = () => {
    removeStorage(TRACKING_STEP)
}

// other
export const handleSubmitStep = async (step: StepType, data: ObjectType | null, urlQuery: ObjectType) => {
    try {
        const reqParams: ObjectType & RequestTrackingProps = {
            ...urlQuery,
            step: step,
            reqId: getRegisterUUID(),
            state: TRACKING_STATE[step],
        }
        if (!_.isEmpty(data)) reqParams.stepInfo = getStepInfo(step, data)
        trackingOnboarding(reqParams)
        setTrackedStep(step)
    } catch (error) {
        console.error('trackingOnboarding ERROR:', error)
    }
}

const getStepInfo = (step: StepType, data: ObjectType | null): SubmitTraceStep1 | SubmitTraceStep2 | SubmitTraceStep3 | undefined => {
    switch (step) {
        case 1:
            return { ...data, businessLine: data?.businessLine?.pop() } as SubmitTraceStep1
        case 2:
            return {
                img_back: generateImgUrl(data?.data_back),
                img_face: generateImgUrl(data?.data_face),
                img_front: generateImgUrl(data?.data_front),
            }
        case 3:
            return { ...data } as SubmitTraceStep3
        default:
            return undefined
    }
}

// ocr data
export const getOcrData = () => parseStrObj(getStorage(OCR_DATA_KEY))
export const setOcrData = (data: ObjectType) => setStorage(OCR_DATA_KEY, data)
export const removeOcrData = () => {
    removeStorage(OCR_DATA_KEY)
}

// ocr edited
export const getOcrEdited = () => parseStrObj(getStorage(OCR_EDITED_KEY))
export const setOcrEdited = (data: ObjectType) => setStorage(OCR_EDITED_KEY, data)
export const removeOcrEdited = () => {
    removeStorage(OCR_EDITED_KEY)
}
