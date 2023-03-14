import { FC } from "react"
import { PageLoading } from '@/components'
import { DetailEmpty } from "./DetailEmpty";

interface DetailPageProps {
    isLoading?: boolean;
    hasData?: boolean;
    onBack?: () => void
    onReload?: () => void
}

export const DetailPage: FC<DetailPageProps> = ({ children, isLoading, hasData, onBack, onReload }) => {
    return (
        <>
            {
                isLoading ? <PageLoading active={isLoading} /> : (hasData ? children : <DetailEmpty onBack={onBack} onReload={onReload} />)
            }
        </>
    )
}