import { MERCHANT_NAME_REGEX } from '@/constants/common.constant';
import { translate } from '@/utils';
import { curry } from './curry';


let letterRegex = /[a-zA-Z]/g;
let letterVNRegex = /[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/g; 

let numberRegex = /[0-9]/g; 
let specialCharRegex = /[!@#$%^&*(),.?":{}|<>\s]/g;

let numOfLetters =(text:string)=> (text.match(letterRegex) || []).length; 
let numOfLettersVN =(text:string)=> (text.match(letterVNRegex) || []).length; 
let numOfNumbers = (text:string)=>(text.match(numberRegex) || []).length; 
let numOfSpecialChars = (text:string)=>(text.match(specialCharRegex) || []).length; 

/** Form rule */
export const rejectOnlySpace = () => ({
    validator(_: any, value: any) {
        return value && !value.trim()
            ? Promise.reject(new Error(translate('form.message.field.onlySpace')))
            : Promise.resolve();
    },
})

export const requiredField = () => ({ required: true, message: translate('Please enter information.') })
export const requiredSelect = () => ({ required: true, message: translate('form.message.select.required') })
export const checkMaxLength = (max?: number, message?: string) => () => ({ max: max, message: message || translate('form.message.field.max', '', {max: max}) })
export const checkMinLength = (min?: number, message?: string) => () => ({ min: min, message: message || translate('form.message.field.min', '', {min: min}) })
export const requiredUpload = () => ({ required: true, message: translate('form.message.upload.required') })
export const requiredWithMessage = (message: string) => ({ required: true, message })
export const requiredRangeDate = () => ({
    type: 'array' as const,
    required: true,
    message: translate('form.message.select.required')
})

export const checkPattern = curry((pattern: RegExp, message: string) => ({ pattern, message}))

/** SPECIFIC */
export const checkEmailSpecialCharacter = () => ({
    validator(_: any, value: any) {
        // only letters (a-z), numbers (0-9), and periods (.) are allowed
        const pattern = /[^a-zA-Z0-9@.]/g
        return value && pattern.test(value) 
            ? Promise.reject(new Error(translate('form.message.field.email.characterError')))
            : Promise.resolve();
    },
})
export const twoSpace = () => ({
    validator(_: any, value: any) {
        // only letters (a-z), numbers (0-9), and periods (.) are allowed
        const pattern = /[^a-zA-Z0-9@.]/g
        return value && pattern.test(value) 
            ? Promise.reject(new Error(translate('form.message.field.email.characterError')))
            : Promise.resolve();
    },
})
export const checkMerchantName = () => checkPattern(MERCHANT_NAME_REGEX, translate('merchant_name_format'))
export const merchantNameRules = () => [
    requiredField,
    {
        validator(_: any, value: any) {
            const valueTrim = value?.trim();            
            if (valueTrim &&
                (numOfLettersVN(valueTrim) < 5 ||
                    valueTrim.length > 50 ||
                    (!valueTrim.match(MERCHANT_NAME_REGEX)) ||
                    valueTrim?.includes("  ")
                ))
                return Promise.reject(new Error(translate('Validation: merchant name invalid')))
             return Promise.resolve()
        },
    }
]

export const phoneNumberRules = () => [
    requiredField,
    {
        validator(_: any, value: any) {
            const valueTrim = value?.replaceAll(" ", "");            
            //Số điện thoại là trống
            if (!valueTrim) {
                return Promise.reject(new Error( translate('Please enter information.')))       
            }
            //Số điện thoại < 8 || > 11 thì không hợp lệ
            if( valueTrim.length < 8 || valueTrim.length > 11 || (/[^\d]/g).test(valueTrim) )
                return Promise.reject(new Error(translate('InputValidation.Invalid_Phone_Number')))
             return Promise.resolve()
        },
    }
]
export const emailRules = () => [
    requiredField,
    {
        validator(_: any, value: any) {
            const valueTrimAll = value?.replaceAll(" ", "");            
            const valueTrim = value?.trim();            
            if (!valueTrimAll) {
                return Promise.reject(new Error( translate('Please enter information.')))       
            }
            return valueTrim &&
            !String(valueTrim)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
                ? Promise.reject(new Error(translate('Validation: email  invalid')))
                : Promise.resolve();
        },
    }
]



//Validation
export const checkPhoneNumber = () => [
    {
        validator(_: any, value: any) {
            const valueTrim = value?.replaceAll(" ", "");            
            //Số điện thoại là trống
            if (!value) {
                return Promise.reject(new Error( translate('InputValidation.Please_Enter_The_Phone_Number')))       
            }
            //Số điện thoại < 8 || > 11 thì không hợp lệ
            if( valueTrim.length < 8 || valueTrim.length > 11 || (/[^\d]/g).test(valueTrim) )
                return Promise.reject(new Error(translate('InputValidation.Invalid_Phone_Number')))
             return Promise.resolve()
        },
    }
]
export const checkTaxCode = () => [
    {
        validator(_: any, value: any) {
            var format = /^[A-Za-z0-9-]*$/;
            //tax code là trống
            if (!value) {
                return Promise.reject(new Error( translate('InputValidation.Please_Enter_Tax_Code')))       
            }
            //Số điện thoại < 10 thì không hợp lệ
            if( value.length < 10)
                return Promise.reject(new Error(translate('InputValidation.Tax_Code_Must_Be_At_Least_10_Characters')))
            if( value.length > 14)
                return Promise.reject(new Error(translate('InputValidation.Tax_Code_Up_To_14_Characters')))
            //Chứa kí tự đặc biệt || chưa upper case            
            if(!format.test(value) || (value.toUpperCase() !== value))
                return Promise.reject(new Error(translate('InputValidation.Invalid_Tax_Code')))
             return Promise.resolve()
        },
    }
]
export const checkEmailValid = () => ({
    validator(_: any, value: any) {
        // only letters (a-z), numbers (0-9), and periods (.) are allowed
        const pattern = /^[a-z0-9_.]+@[a-z]+\.[a-z]{2,3}/ig;
        return value && pattern.test(value)
            ? Promise.resolve()
            : Promise.reject(new Error(translate('InputValidation.Email_Invalid')))
    },
})

export const checkDirectory = () => [
    {
        validator(_: any, value: any) {
            var format = /^(\/[\w^ ]+)+\/?$/;     
            if (!value?.trim() || !value) {
                
                return Promise.reject(new Error(translate("Validation: Please enter {name}","",{name:translate("Directory path")})))

            }
            else if(!format.test(value))
                return Promise.reject(new Error(translate('Validation: {name} incorrect format',"",{name:translate("Directory path")})))
             return Promise.resolve()
        },
    }
]
export const checkHostName = () => [
    {
        validator(_: any, value: any) {
            var format = /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/;    
            if (!value?.trim() || !value) {
                
                return Promise.reject(new Error(translate("Validation: Please enter {name}","",{name:translate("Host name")})))

            }
            else if(!format.test(value))
                return Promise.reject(new Error(translate('Validation: {name} incorrect format',"",{name:translate("Host name")})))
             return Promise.resolve()
        },
    }
]
