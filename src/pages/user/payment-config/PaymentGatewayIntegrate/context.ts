import { createContext } from "react"

interface ProfileContextProps {
    pgConfig: any;
    toggleConfig: () => void;
    getPaymentGateway: () => void;
}

export const profileContextInit = {
    pgConfig: {},
    toggleConfig: () => {},
    getPaymentGateway: () => {},
}

export const ProfileContext = createContext<ProfileContextProps>(profileContextInit)