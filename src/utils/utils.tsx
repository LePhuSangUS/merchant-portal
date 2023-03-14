import React from 'react';
import { parse } from 'querystring';
import randomize from 'randomatic';
import { parseValue, format,getLanguageKey } from '@/utils';
import moment from 'moment';
import type { Moment } from 'moment';
import { STORAGE_KEY } from '@/constants';
import _ from 'lodash';
import { curry, trim } from './curry';
const MAX_DAYS_SELECT = 31

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const checkPasswordPolicy = (pwdPolicy: any = {}, pwd: string = '') => {
  const result: any = { valid: true, messages: [] };
  Object.keys(pwdPolicy).map((field: any) => {
    switch (field) {
      case 'minLength':
        if (pwd.length < pwdPolicy.minLength) {
          result.valid = false;
          result.messages.push({
            vi: `Mật khẩu phải ít nhất ${pwdPolicy.minLength} kí tự`,
            en: `Password must be at least ${pwdPolicy.minLength} characters`,
          });
        }
        break;
      case 'maxLength':
        if (pwd.length > pwdPolicy.maxLength) {
          result.valid = false;
          result.messages.push({
            vi: `Mật khẩu chỉ tối đa ${pwdPolicy.maxLength} kí tự`,
            en: `Maxinum password length is ${pwdPolicy.maxLength} characters`,
          });
        }
        break;
      case 'number':
        if (!pwd.match(/\d+/g) && pwdPolicy.number) {
          result.valid = false;
          result.messages.push({
            vi: `Mật khẩu phải chứa ký tự số`,
            en: `Password require at least one number`,
          });
        }
        break;
      case 'upperCase':
        if (!/[A-Z]/.test(pwd) && pwdPolicy.upperCase) {
          result.valid = false;
          result.messages.push({
            vi: `Mật khẩu phải chứa chữ in hoa`,
            en: `Password require at least one uppercase letter`,
          });
        }
        break;
      case 'lowerCase':
        if (!/[a-z]/.test(pwd) && pwdPolicy.lowerCase) {
          result.valid = false;
          result.messages.push({
            vi: `Mật khẩu phải chứa chữ in thường`,
            en: `Password require at least one lowercase letter`,
          });
        }
        break;
      case 'specialChars':
        if (!/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(pwd) && pwdPolicy.specialChars) {
          result.valid = false;
          result.messages.push({
            vi: `Mật khẩu phải chứa ký tự đặc biệt`,
            en: `Password require at least one symbol character`,
          });
        }
        break;
      case 'blacklist':
        if (pwdPolicy[field].includes(pwd)) {
          result.valid = false;
          result.messages.push({
            vi: `Bạn cần đặt mật khẩu phức tạp hơn`,
            en: `You need to be set more complex password`,
          });
        }
        break;
      default:
        return result;
    }
    return result;
  });
  return result;
};

export const getPicklistsByPageRoutePath = (pageRoutePath: string) => {
  const picklists: any[] = [];
  try {
    let user: any = localStorage.getItem(STORAGE_KEY||"MERCHANT_PORTAL");
    if (user) user = JSON.parse(user);
    const routes = user?.routes;
    const module = routes.find((i: any) => i?.pages.some((p: any) => p?.path === pageRoutePath));
    const page = module.pages.find((p: any) => p?.path === pageRoutePath) || {};
    return (
      page?.pickLists?.length
        ? page.pickLists.map((item: any) => (
          {
            ...item,
            label: parseValue(item?.label),
            options: (
              item?.options?.length
                ? item.options.map((opt: any) => (
                  {
                    ...opt,
                    label: parseValue(opt?.label)
                  }
                ))
                : []
            )
          }
        ))
        : []
    );
  } catch (err) {
    // console.log(err);
  }
  return picklists;
};

export const hasBalanceManagement = () => {
  let user: any = localStorage.getItem(STORAGE_KEY||"MERCHANT_PORTAL");
  if (!user) return false;
  else user = JSON.parse(user);
  const routes = user?.routes || [];
  if (!routes || !routes?.length) return false;
  const ddMenu = routes.find((i: any) => i?.id === 'DROPDOWN_MENU')
  return (
    ddMenu?.pages?.length
      ? !!ddMenu.pages.find((i: any) => i?.id === 'balance-management')
      : false
  )
};

export const copyToClipboard = (val: any) => {
  const el = document.createElement('textarea');
  el.value = val;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const generateRandomStringCustom = (pattern: any, length: number, option: any = {}, startString: string = "", endString: string = "", delimiter: string = "") => {
  try {
    const stringGen = randomize(pattern, length, option);
    return `${startString}${delimiter}${stringGen}${delimiter}${endString}`;
  } catch (e) {
    return "";
  }
}

export const renderField = (val: any, type?: any, unit?: string) => {
  if (val === 0) return 0
  if (!val) return '-';   
  return (
    <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-line', flex:"0 0 100%" }}>
      {
        parseValue(
          type && ['phone', 'date', 'datetime', 'datetimes', 'currency'].includes(type)
            ? format[type](val,unit)
            : val
        )
      }
    </div>
  )
}

export const getItemFromListByValue = (value: any, list: any[]) => {
  if (!list?.length) return null
  return list.find((i: any) => i?.value === value)
}


export const getSelectOptionsFromConstant = (options: any[]) => options.map((option) => ({
  value: option?.value,
  label: option?.label[getLanguageKey()],
}))

export const rangeDateLimitSelect = (dates: Moment[], maxDaySelect: number = MAX_DAYS_SELECT) => (current: Moment): boolean => {
  if (!dates || dates.length === 0 || maxDaySelect < 1) {
    return false
  }
  const tooLate = dates[0] && current.diff(dates[0], 'days') > (maxDaySelect - 1)
  const tooEarly = dates[1] && dates[1].diff(current, 'days') > (maxDaySelect - 1)
  return tooEarly || tooLate
}
export const rageDateLimitPast = (type: 'days'|'months'|'years', amount: number) => (current: Moment): boolean => current && current <= moment().subtract(amount, type)

export const  nonAccentVietnamese=(str: string): string =>{
  if(typeof str !== 'string') return '';
  let newStr = str.toLowerCase();
//     We can also use this instead of from line 11 to line 17
//     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
//     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
//     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
//     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
//     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
//     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
//     str = str.replace(/\u0111/g, "d");
  newStr = newStr.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  newStr = newStr.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  newStr = newStr.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  newStr = newStr.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  newStr = newStr.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  newStr = newStr.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  newStr = newStr.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  newStr = newStr.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
  newStr = newStr.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return newStr;
}

export const shortString = (str: string|undefined, length: number, replacement?: string|undefined) => str && str?.length > length ? (str?.substring(0, length) + (replacement||'')) : str
export const sortObjectArrayByArray = (objArray: Record<string, any>, arr: any[], keyName: string) => objArray?.sort((a: any, b: any) => arr?.indexOf(a?.[keyName]) - arr?.indexOf(b?.[keyName]))
export const validateEmail = (email: string) => {
  return (email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export function create_UUID() {
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

export const isEmptyString = (str: string) => typeof str === 'string' && !str
export const removeEmptyStringInObject = (obj: ObjectType) => _.omitBy(obj, isEmptyString)
export const momentFormat = curry((fm: string, momentObj: Moment) => momentObj?.format?.(fm))
export const protectObject = (object: Record<string, string | number>) => {
  let protectedObject = {}
  _.forEach(object, function(value, key){
      protectedObject = {...protectedObject, [encodeURIComponent(key)]: encodeURIComponent(value)}
  })
  return protectedObject
}
export const removeUndefinedInObject = (obj: ObjectType) => _.omitBy(obj, item => item === undefined)
export const trimObjectValue = (obj: ObjectType): any => _.mapValues(obj, trim)
export const getFileNameFromUrl = (url: string) => typeof url === 'string' ? url.split("/").pop() : url;

export const isMeaninglessMessage = (msg: string): boolean => {
  if(typeof msg !== 'string') return true;
  // "Failed to fetch" always return from antd cause internet connection
  // 'Process failed' always return from BE
  const meaninglessMessage = ['Failed to fetch', 'Process failed'];
  if(meaninglessMessage?.includes(msg)) return true;

  // Error code always return from BE: ERR_AUTH, SYS_ERR, VALIDATOR_ERROR, ...
  if(/^([A-Z0-9]{1,}_?){1,}$/g.test(msg)) return true;
  return false;
}

/** check have boolean and number */
export const isEmpty = (value: any) => (!_.isNumber(value) || (_.isNumber(value) && _.isNaN(value))) && !_.isBoolean(value) && _.isEmpty(value);