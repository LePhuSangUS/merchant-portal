import { useWindowSize } from "@/hooks"
import { ProFormSelect } from "@ant-design/pro-form"
import { ProFormSelectProps } from "@ant-design/pro-form/lib/components/Select";
import { ModalFuncProps } from "antd";
import FormSelectMobile from "./FormSelectMobile"

interface FormSelectResponsiveProps extends ProFormSelectProps {
    onChange: (...args: any[]) => void;
    modalProps?: ModalFuncProps;
}

const FormSelectResponsive = (props: FormSelectResponsiveProps) => {
    const { width: windowWidth } = useWindowSize()
    const Comp = windowWidth < 768 ? FormSelectMobile : ProFormSelect
    return <Comp {...props}/>
}

export default FormSelectResponsive