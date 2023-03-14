import React, { useEffect, useState } from 'react'
import { FormItem, FormField, FormText, Cascader, FormSelect } from '@/components';
import { PROVINCE, DISTRICT, WARD } from '@/constants/location'
import { parseOptions, translate } from '@/utils';
import { rejectOnlySpace } from '@/utils/rules'
import { useWindowSize } from '@/hooks';
import styles from './FormAddress.less'
import { icArrowUp } from "@/assets/icons/table";
interface AddressProps {
  name?: any,
  label?: string,
  disabled?: boolean,
  allowClear?: boolean,
  required?: boolean,
  initialValue?: any,
  size?: undefined | "large" | "middle" | "small"
  onChange?: (addObj: any) => void,
  responsive?: boolean,
  sizeSwitchMode?: number,
  noSelect?: boolean,
}

const FormAddress: React.FC<AddressProps> = (
  {
    name = 'address',
    label = '',
    disabled = false,
    allowClear = false,
    required = false,
    initialValue,
    onChange,
    size,
    responsive = false,
    sizeSwitchMode = 668,
    noSelect = false,
  }
) => {
  const [districts, setDistricts] = useState<any[]>([])
  const [options, setOptions] = useState<any[]>([])
  const [residence, setResidence] = useState<any[]>([])
  const { width: windowWidth } = useWindowSize()

  const [province, setProvince] = useState();
  const [district, setDistrict] = useState();
  const [ward, setWard] = useState();

  const convertResidence = (obj: any) => {
    if (!obj) return []
    const provinceId = obj?.province?.id || obj?.province?.value || ''
    const districtId = obj?.district?.id || obj?.district?.value || ''
    const wardId = obj?.ward?.id || obj?.ward?.value || ''
    if (provinceId || districtId || wardId) {
      return [provinceId, districtId, wardId]
    }
    if (Array.isArray(obj?.residence)) {
      return obj.residence
    }
    return []
  }

  const generateAddress = (addArr: any[], detail: string = '') => {
    if (!addArr?.length && !detail) return null
    if (!addArr?.length) {
      return {
        detail,
        province: '',
        district: '',
        ward: ''
      }
    }
    const pp = addArr?.[0]
    const dd = addArr?.[1]
    const ww = addArr?.[2]
    return {
      detail,
      province: (
        pp ? {
          id: pp?.id || '',
          name: pp?.name || ''
        } : ''
      ),
      district: (
        dd ? {
          id: dd?.id || '',
          name: dd?.name || ''
        } : ''
      ),
      ward: (
        ww ? {
          id: ww?.id || '',
          name: ww?.name || ''
        } : ''
      ),
    }
  }

  const initOptions = () => {
    setDistricts(
      DISTRICT?.length
        ? DISTRICT.map((i: any) => (
          {
            id: i?.id,
            name: i?.name,
            level: 2,
            isLeaf: false
          }
        ))
        : []
    )
    if (!PROVINCE?.length) {
      setOptions([]);
    } else {
      const district: any[] = (
        DISTRICT?.length
          ? DISTRICT.map((item: any) => {
            const dd = (
              WARD?.length
                ? WARD.filter((i: any) => i?.district === item?.id)
                : null
            )
            return {
              ...item,
              children: dd
            }
          })
          : []
      )
      const fullAddress = (
        PROVINCE?.length
          ? PROVINCE.map((item: any) => {
            const dd = (
              district?.length
                ? district.filter((i: any) => i?.province === item?.id)
                : null
            )
            return {
              ...item,
              children: dd
            }
          })
          : []
      )
      setOptions(fullAddress)
    }
  }

  const handleLoad = (selectedOptions: any) => {
    const level = selectedOptions.length
    const targetOption = {
      ...selectedOptions?.[selectedOptions.length - 1],
      loading: true
    }

    // load options lazily
    setTimeout(() => {
      let currentData = []
      if (level === 1) {
        currentData = districts.filter((d: any) => d?.province === selectedOptions?.[0].id)
      }
      if (level === 2) {
        currentData = WARD.filter((w: any) => w?.district === selectedOptions?.[0].id)
      }
      targetOption.loading = false
      targetOption.children = currentData
      setOptions([...options])
    }, 1)
  }

  useEffect(() => {
    initOptions()
  }, [])

  useEffect(() => {
    setResidence(convertResidence(initialValue))
  }, [initialValue])

  const handleChange = (value: any, selectedOptions: any, form: any) => {
    const addObj = generateAddress(
      selectedOptions,
      form?.getFieldValue?.([name, 'detail'])
    )
    form?.setFieldsValue?.({ [name]: addObj })
    if (onChange) onChange?.(addObj)
    setResidence(value)
  }

  const validateField = (_: any, val: any, isRequired: boolean) => {
    if (!isRequired)
      return Promise.resolve()
    if (!val?.province?.id)
      return Promise.reject(new Error(translate('form.message.location.required')))
    return Promise.resolve()
  }

  const isMobileMode = responsive && windowWidth < sizeSwitchMode

  return (
    <div className={styles.component}>
      {
          !noSelect &&
          <FormItem
            noStyle
            shouldUpdate={(prevVal: any, nextVal: any) => (
              prevVal?.[name]?.province?.id !== nextVal?.[name]?.province?.id
            )}

          >
            {
              (form: any) => {
                return (
                  <FormField
                    name={name}
                    label={label}
                    required
                    rules={[{ validator: (_: any, val: any) => validateField(_, val, required) }]}
                    formItemProps={{
                      style: { marginBottom: '.75em' },

                    }}

                  >
                    <Cascader
                      className={isMobileMode ? styles?.formAddress : null}
                      dropdownClassName={isMobileMode ? styles?.formAddressDropdown : null}
                      fieldNames={{ value: 'id', label: 'name' }}
                      allowClear={allowClear}
                      suffixIcon={<img src={icArrowUp} alt="icon" />}
                      disabled={disabled}
                      loadData={handleLoad}
                      options={options}
                      value={residence}
                      size={size ? size : "middle"}
                      onChange={(val: any, selectedOpts: any) => handleChange(val, selectedOpts, form)}
                      placeholder={translate('form.placeholder.location.detail')}
                      notFoundContent={translate('form.placeholder.location.detail')}
                      displayRender={(lbs: any, selectedOptions: any) => (
                        selectedOptions
                          && selectedOptions?.length
                          ? lbs.join(' / ')
                          : (
                            <span style={{ opacity: '.5' }}>
                              {translate('form.placeholder.location.detail')}
                            </span>
                          )
                      )}
                    />
                  </FormField>
                )
              }
            }
          </FormItem>
      }
      <FormText
        name={[name, 'detail']}
        disabled={disabled}
        label={noSelect ? label : null}
        placeholder={translate('form.placeholder.address.detail')}
        fieldProps={{
          size: 'large'
        }}
        rules={[
          { required: required, message: translate('form.message.address.required') },
          { max: 250, message: translate('form.message.field.length') },
          ...([required ? rejectOnlySpace : {}])
        ]}
      />
    </div>
  )
}

export default FormAddress
