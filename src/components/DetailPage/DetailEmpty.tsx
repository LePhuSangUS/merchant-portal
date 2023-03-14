import { translate } from "@/utils"
import { Button, Empty, Space } from "antd"
import { FC } from "react"

interface DetailEmptyProps {
    onBack?: () => void;
    onReload?: () => void;
}

export const DetailEmpty: FC<DetailEmptyProps> = ({onBack, onReload}) => {
    return <div>
        <Empty>
            <Space size={10} >
            {onBack && <Button onClick={() => onBack?.()}>{translate('form.button.back')}</Button>}
            {onReload && <Button type='primary' onClick={() => onReload?.()}>{translate('form.button.reload')}</Button>}
            </Space>
        </Empty>
    </div>
}
