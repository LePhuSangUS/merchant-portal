import { useEffect, useState } from "react";
import { message, translate } from "@/utils";

type UseRequestAPIProps = {
    requestFn: (...args: any[]) => void | Promise<any>,
    messageSuccess?: string,
    messageError?: string,
    pageName?: string,
    handleError?: (...args: any[]) => void,
    handleSuccess?: (...args: any[]) => void,
    internalCall?: boolean,
    callDepndencies?: any[]
}

type ReturnRequestAPIProps<T> = {
    isLoading: boolean,
    resp: T | undefined,
    request: (...args: any[]) => Promise<any>,
}

function useRequestAPI<T>({
    requestFn,
    messageSuccess,
    messageError,
    pageName = '',
    handleError,
    handleSuccess,
    internalCall = false,
    callDepndencies = [],
}: UseRequestAPIProps, ...args: any[]): ReturnRequestAPIProps<T> {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [resp, setResp] = useState<T>();

    const request = async (...iArgs: any) => {
        try {
            setIsLoading(true);
            const response = await requestFn(...iArgs);
            if (response?.success) {
                handleSuccess?.(response);
                if (messageSuccess) message.success(messageSuccess);
            }
            else {
                handleError?.(response);
                if (response?.message === 'Failed to fetch') { // internet disconnected
                    message.error(translate('message.request.internetDisconnectedError', '', { pageName }));
                }
                else {
                    message.error(messageError || translate('message.request.getError'));
                }
            }

            setIsLoading(false);
            setResp(response);
            return response;
        } catch (error) {
            handleError?.(error);
            message.error(translate('message.request.internetDisconnectedError', '', { pageName }));
            setIsLoading(false);
            return false;
        }
    }

    useEffect(() => {
        if(internalCall) request(...args)
    }, [...callDepndencies])

    return { isLoading, resp, request }
}

export default useRequestAPI;