import axios from "axios";
import { getLanguageKey, message, translate } from '@/utils';
import { getToken } from '@/utils/storage';
import { env } from "@/env";
import _ from "lodash"
import { history } from 'umi';
const accessToken = getToken();

const service = axios.create({
  baseURL: env.BASE_API_URL, 
});

service.interceptors.request.use(
  (config) => {

    const accessToken = getToken();
    
      function _trimObjValues(obj) {
        return Object.keys(obj).reduce((acc, curr) => {
          if (acc && _.isString(obj?.[curr])) {
            acc[curr] = obj?.[curr].trim()
          }
          return acc;
        }, {});
      }
      
    
    const omitEmptyParams=_.omitBy(config?.params, (v) => _.isUndefined(v) || _.isNull(v) || v === '');
    const omitEmptyData = _.omitBy(config?.data, (v) => _.isUndefined(v) || _.isNull(v) || v === ''); 
    
      
    config.params={...omitEmptyParams}
    config.data={...omitEmptyData}
      config.headers = {

      ...config.headers,
      'Content-Type': 'application/json',
      'Accept-Language': getLanguageKey(),
      Authorization: `Bearer ${accessToken}`,
      } 
  
    return config;
  },
  (error) => {
    console.log(error); // for debug
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    // console.log(response);
    return {
      ...(response?.data || {}),
      success: response?.data?.code === 1,
    }
  },
  (error) => {
    console.log("======Interceptors Error===========" + error.response?.status); // for debug;
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEY);
      history.replace({ pathname: '/user/login' });
    }
    return Promise.reject(error);
  }
);

export default service;
