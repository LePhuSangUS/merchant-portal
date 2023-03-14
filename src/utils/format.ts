import _ from "lodash";

const moment = require("moment");

export const formatCode = (code: string) => {
  return String(code?.replace(/\s/g, ''));
};

export const formatAddress = (address: any) => {
  if (!address) return null;
  const { addressDetail, district, province, ward } = address;
  return `${addressDetail ? addressDetail + ', ' : ''} ${district ? district + ', ' : ''} ${ward ? ward + ', ' : ''} ${province ? province : ''}`
};

const isValid = (str: any) => (
  !_.isNull(str)
  || !_.isEmpty(str)
  || !_.isUndefined(str)
);

const DEFAULT_DATE_FORMAT = {
  vi: "DD/MM/YYYY",
  en: "MM/DD/YYY",
};
const DEFAULT_DATETIME_FORMAT = {
  vi: "DD/MM/YYYY HH:mm",
  en: "MM/DD/YYYY HH:mm",
};
const DEFAULT_DATETIMES_FORMAT = {
  vi: "DD/MM/YYYY HH:mm:ss",
  en: "MM/DD/YYYY HH:mm:ss",
};

export const date = (str: any, fm?: string) => {
  if (!isValid(str)) {
    return false;
  }
  const format = fm || DEFAULT_DATE_FORMAT.vi;
  const d = moment(str);
  // check if str is datetime string
  if (d.isValid()) {
    return d.format(format);
  }
  const dd = moment(str, "x");
  // check if str is miliseconds
  if (dd.isValid()) {
    return dd.format(format);
  }
  return false;
};

export const datetime = (str: any, fm?: string) => {
  const format = fm || DEFAULT_DATETIME_FORMAT.vi;
  return (
    isValid(str)
      ? date(str, format) : false
  );
};

export const datetimes = (str: any, fm?: string) => {
  const format = fm || DEFAULT_DATETIMES_FORMAT.vi;
  return (
    isValid(str)
      ? date(str, format) : false
  );
};

export const toDateString = (str: any) => (
  isValid(str)
    ? moment(str).toISOString().substr(0, 10) : false
);

export const toISOString = (str: any) => (
  isValid(str)
    ? moment(str).toISOString() : false
);

export const currency = (number: any, unit?: any) => {  
  if (!isValid(number) || typeof number !== 'number') {
    return number;
    
  }
    var p = number.toFixed(2).split(".");
    const convert= p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return num + (num != "-" && i && !(i % 3) ? "." : "") + acc;
    }, "") + "," + p[1];
    if (convert.match(/\,/)) {
     return `${convert.replace(/\,?0+$/, '')} ${unit||""}`;
    }  
  return `${convert} ${unit||""}`
};
export const decimal = (number: any,fixed=1) => {
  if (!isValid(number) || typeof number !== 'number') {
    return number;
    
  }
    var p = number.toFixed(fixed).split(".");
    const convert= p[0].split("").reverse().reduce(function(acc, num, i, orig) {
        return num + (num != "-" && i && !(i % 3) ? "." : "") + acc;
    }, "") + "," + p[1];
    if (convert.match(/\,/)) {
     return convert.replace(/\,?0+$/, '');
    }
  return convert
};
    

export const phone = (str: any) => {
  if (!isValid(str)) {
    return false;
  }
  const cleaned = (`${str}`).replace(/\D/g, "");
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  }
  const match = cleaned.match(/^(\d{0,})(\d{2})(\d{3})(\d{4})$/);
  if (match) {
    const intl1 = (match[1] ? `(+${match[1]}) ` : "");
    return [intl1, "", match[2], " ", match[3], " ", match[4]].join("");
  }
  return cleaned;
};

export const removeSpace = (string: any) => {  
    if (string) {
      return string.replace(/\s/g, '')
    }
    return "";

}
export const formatPhoneNumber = (digit: any) => {

  const MAX_PHONE = 11;
  if (!digit) {
    return 
  }
  let number = digit.replaceAll(" ", "")
  console.log(number);

  if ((/[^\d]/g).test(number) || number.length> MAX_PHONE) {
    return number;
  }

  let regex = /(\d{3})(\d{3})(\d{4}})/;
  switch (number.length) {
      case 8:
          regex =  /(\d{3})(\d{3})(\d{2})/;
          break;
      case 9:
          regex =  /(\d{3})(\d{3})(\d{3})/;
          break;

      case 10:
          regex =  /(\d{3})(\d{3})(\d{4})/;
          break;

      case 11:
          regex =  /(\d{3})(\d{3})(\d{5})/;
          break;
      default:
          break;
  }
  number = number.replace( regex, '$1 $2 $3');
  return number;
}


export const renderMaskCardNumber = (cardNumber: string) => {
  return cardNumber?cardNumber.replace(/.{4}(?=.{2}$)/gm, "****"): ""
}
export const convertFromDateToDateToISOString = (frDate: any, toDate: any) => {
  return {
    dateFr: moment(frDate).startOf("date").toISOString(),
    dateTo: moment(toDate).endOf("date").toISOString()
  }
}