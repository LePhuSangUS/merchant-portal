import _ from  "lodash"
import { message, notification } from "./common";
import * as format from "./format";
import { formatAddress, formatCode } from "./format";
import { getLanguageKey, translate } from "./language";
import * as parse from "./parse";
import { hexToRGBA, parseDOM, parseLanguages, parseOptions,
  parseValue, covertAddress, parseAddress } from "./parse";
import * as storage from "./storage";
import { clearStorage, getUser, getToken, getProfile, getRoutes,
  setUser, removeUser, removeAuthority
} from "./storage";
import { checkPasswordPolicy, getPicklistsByPageRoutePath,
  generateRandomStringCustom, renderField,  getSelectOptionsFromConstant,
  rangeDateLimitSelect,nonAccentVietnamese,validateEmail } from "./utils";
  import * as validation from './validation';

  export const checkChangeForm = (objectOrigin:{},objectChange:{}) => {
    for (const key in objectChange) {
        if (!_.isEqual(objectChange?.[key], objectOrigin?.[key])) {
            return (true);
        }
    }
  return false;

}




export {
  message,
  notification,
  translate,
  getLanguageKey,
  parse,
  parseDOM,
  parseValue,
  parseOptions,
  parseLanguages,
  hexToRGBA,
  format,
  formatCode,
  formatAddress,
  storage,
  getUser,
  getToken,
  getProfile,
  getRoutes,
  setUser,
  removeUser,
  removeAuthority,
  clearStorage,
  checkPasswordPolicy,
  getPicklistsByPageRoutePath,
  generateRandomStringCustom,
  covertAddress,
  parseAddress,
  renderField,
  getSelectOptionsFromConstant,
  rangeDateLimitSelect,
  nonAccentVietnamese,
  validation,
  validateEmail
};

