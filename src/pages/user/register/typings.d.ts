type StepType = number

type SubmitTraceStep1 = {
    businessType: string,
    merchantEmail: string,
    merchantPhone: string,
    merchantAddress: {
        detail: string,
        province: {
            id: number,
            name: string
        },
        district: {
            id: number,
            name: string
        },
        ward: {
            id: number,
            name: string
        }
    },
    merchantName: string,
    businessLine: string,
    approval: boolean
}

type SubmitTraceStep2 = {
    img_back: string,
    img_face: string,
    img_front: string,
}

type SubmitTraceStep3 = {
    identityName: string,
    identityNumber: string,
    identityDob: string,
    identityAddress: string,
    gender: string,
    identityIssuedBy: string,
    identityIssuedDate: string,
    identityType: string,
}

type RequestTrackingProps = {
    reqId: string,
    state: string,
    step: StepType,
    stepInfo?: SubmitTraceStep1 | SubmitTraceStep2 | SubmitTraceStep3 | undefined,
}