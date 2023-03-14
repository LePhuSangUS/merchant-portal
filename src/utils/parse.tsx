import React from "react";
import _ from "lodash";
import { PROVINCE, DISTRICT, WARD } from '@/constants/location';
import { getLanguageKey } from "@/utils";
import { languages } from "@/constants";
import { env } from "@/env";
import { icAvatarDefault } from '@/assets/icons/table';

const defaultLang = "vi";

// Text parser (to HTML format)
export const parseDOM = (str: any) => (
  <div
    className="dangerouslyHTML"
    dangerouslySetInnerHTML={{ __html: str || '' }}
  />
)

// print value from field depend on current language
// if current language empty => return default language or null
export const parseValue = (item: any, isBoolean?: boolean) => {
  const currLang = getLanguageKey();
  const val = (
    _.isObject(item)
      ? (item?.[currLang] || item?.[defaultLang])
      : item
  );
  return String(isBoolean ? val : (val || ""));
}

// parse options list for select
// depend on opts list, valueKey & labelKey
// return [{ value: 'value', label: 'label' }]
export const parseOptions = (opts: any, valueKey?: string, labelKey?: string) => (
  opts?.length
    ? opts.map((i: any) => (
      {
        value: i?.[valueKey || 'value'],
        label: parseValue(i?.[labelKey || 'label'])
      }
    ))
    : []
)

// use to parse options list for Select Component
// depend on opts list, valueKey & labelKey
// return [{ value: 'value', label: 'label' }]
export const parseLanguages = (opts: any) => {
  const currLang = getLanguageKey();
  return (
    opts?.length
      ? opts.map((o: any) => {
        const lang = languages.find(l => l.value === o)
        return lang?.label?.[currLang] || lang?.label?.[defaultLang] || null;
      })
      : []
  )
}

// covert hex to rgba color
export const hexToRGBA = (hex: string, alpha?: number) => {
  if (!hex) return '';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (
    `rgba(${r}, ${g}, ${b}, ${alpha || 1})`
  );
}

// using to print address string
export const parseAddress = (address: any = {}) => {
  const residence = address?.residence || []
  const province = address?.province || (
    PROVINCE?.length
      ? PROVINCE.find((i: any) => i?.id === residence?.[0])
      : null
  )
  const district = address?.district || (
    DISTRICT?.length
      ? DISTRICT.find((i: any) => i?.id === residence?.[1])
      : null
  )
  const ward = address?.ward || (
    WARD?.length
      ? WARD.find((i: any) => i?.id === residence?.[2])
      : null
  )
  const detail = address?.detail || ''
  const ppName = province?.name || province?.label
  const ddName = district?.name || district?.label
  const wwName = ward?.name || ward?.label
  return (
    `${detail ? `${detail}, ` : ''
    }${wwName ? `${wwName}, ` : ''
    }${ddName ? `${ddName}, ` : ''
    }${ppName || ''}`
  );
}

// using to convert address object
export const covertAddress = (addObj: any = {}) => {
  return ({
    detail: addObj?.detail || '',
    province: {
      id: addObj?.province?.id || '',
      name: addObj?.province?.name || ''
    },
    district: {
      id: addObj?.district?.id || '',
      name: addObj?.district?.name || ''
    },
    ward: {
      id: addObj?.ward?.id || '',
      name: addObj?.ward?.name || ''
    }
  })
}

// 7.123.000 => 7123000 | 7.123.000,12 => 7123000
export const parseCurrencyToIntNumber = (currency: string) => currency ? parseInt(currency.replace(/,/, '#')?.replace(/\./g, '')?.replace(/#/, '.')) : currency
// 7123000 => 7.123.000
export const parseNumberToCurrency = (value: number | string) => value && /[0-9]/g.test(`${value}`) ? `${value}`.replace(/\./, ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.') : `${value}`

export const parseOptionsSysConfig = (config: Record<string, any>[]) => parseOptions(config, 'key', 'value')

export const parseImgUrl = (imageName: string, iconDefault?: any) => {
  return imageName ? `${env.FILE_API_URL}/img/${imageName}` : (iconDefault||icAvatarDefault)
}

export const b64toBlob = (b64Data: string, contentType: string = '', sliceSize: number = 512) => {
  if (window === undefined || !b64Data) return null

  const byteCharacters = window?.atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}


export const parseNumberToCurrencyMultipleLanguage = (value: number | string) => {

  try {
    const currLang = getLanguageKey();
    let thousand = ".";
    let decimal = ","
    if (currLang === "en") {
      thousand = ",";
      decimal = "."
    }
    return value && /[0-9]/g.test(`${value}`) ? `${value}`.replace(/\./, decimal).replace(/\B(?=(\d{3})+(?!\d))/g, thousand) : `0`
  } catch (error) {
  }
}

export const replaceAllSpace = (digit="",source=" ",destination="" )=> {
  try {
      return digit.replaceAll(source, destination)
    
  } catch (error) {
    return ""
    
  }
}
