import { useExportModal, useWindowSize } from "@/hooks"
import { translate } from "@/utils"
import { ProFormSelect } from "@ant-design/pro-form"
import { ProFormSelectProps } from "@ant-design/pro-form/lib/components/Select"
import { Modal, ModalFuncProps } from "antd"
import { useCallback, useState } from "react"
import { FormItem } from "../Form"
import style from './FormSelectMobile.less'

interface SelectMobileProps extends ProFormSelectProps {
    onChange: any;
    modalProps?: ModalFuncProps
}

const FormSelectMobile = ({ onChange, modalProps, ...props }: SelectMobileProps) => {
    const [selectedOption, setSelectedOption] = useState<any>()
    const [showModal, openModal, closeModal] = useExportModal()

    const handleClickOption = useCallback((option: any, form: any) => {
        const inputName = props?.name as string
        form?.setFieldValue?.({ [inputName]: option.value })
        onChange?.(option.value)
        setSelectedOption(option)
        closeModal()
    }, [])
    return (
        <FormItem shouldUpdate>
            {(form: any) => (
                <>
                    <ProFormSelect
                        {...props}
                        fieldProps={{
                            ...props?.fieldProps,
                            dropdownStyle: { display: 'none' },
                            onClick() {
                                openModal()
                            },
                            value: selectedOption?.value,
                        }}
                    />
                    <Modal
                        visible={showModal}
                        onCancel={closeModal}
                        className={style?.modalSelectContainer}
                        {...modalProps}
                        footer={[
                            <div className='close-select-option-modal' onClick={closeModal}>
                                {translate('form.button.close')}
                            </div>
                        ]}
                    >
                        {
                            props?.options?.map((option: any) => {
                                return (
                                    <div
                                        onClick={() => {
                                            handleClickOption(option, form);
                                        }}
                                        className={style?.optionItem}
                                    >
                                        {option?.label}
                                    </div>
                                )
                            })
                        }
                    </Modal>
                </>
            )}

        </FormItem>
    )
}

export default FormSelectMobile