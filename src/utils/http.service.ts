import _ from 'lodash';
import { getLanguageKey, message, translate } from '@/utils';
import { getToken } from '@/utils/storage';
import { STORAGE_KEY } from '@/constants';
import { history } from 'umi';
import { env } from "@/env";

const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
  'Accept-Language': getLanguageKey(),
});

const buildParams = (params: any) => {
  return Object.keys(params).length
    ? `?${Object.keys(params)
        .map((key: string) => `${key}=${encodeURIComponent(params[key])}`)
        .join('&')}`
    : '';
};

const handleError = (response: any) => {
  if (response?.status === 401) {
    localStorage.removeItem(STORAGE_KEY);
    history.replace({ pathname: '/user/login' });
    message.config({ maxCount: 1 });
    message.error(translate('form.message.tokenExpired'));
    return false;
  }
  if (response?.status === 403) {
    // message.error(translate('form.message.403'));
    return false;
  }
  return response;
};

export const HttpService = {
  get: async (path: string, queryParams?: any, options?: any) => {
    try {
      const params: any = {};
      const paramKeys: any[] = Object.keys(queryParams || {});
      if (paramKeys?.length) {
        paramKeys.forEach((key: string) => {
          if (key === 'current') {
            params.pageIndex = queryParams[key];
          } else if (_.isArray(queryParams[key])) {
            if (queryParams[key]?.length) params[key] = queryParams[key];
          } else if (queryParams[key] || queryParams[key] === false || queryParams[key] === 0) {
            params[key] = queryParams[key];
          }
        });
      }

      const optionsKeys: any[] = Object.keys(options || {});
      if (optionsKeys?.length) {
        const sortBy = optionsKeys[0];
        params.sortBy = optionsKeys[0];
        params.sortType = { ascend: 1, descend: -1 }[options[sortBy]];
      }

      const response = await fetch(`${env.BASE_API_URL}${path}${buildParams(params)}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (response.status !== 200) {
        handleError(response);
      }
      return response.json();
    } catch (err) {
      return handleError(err);
    }
  },
  post: async (path: string, data: any) => {
    try {
      const response = await fetch(`${env.BASE_API_URL}${path}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
        handleError(response);
      }
      return response.json();
    } catch (err) {
      return handleError(err);
    }
  },
  put: async (path: string, data?: any) => {
    try {
      const response = await fetch(`${env.BASE_API_URL}${path}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
        handleError(response);
      }
      return response.json();
    } catch (err) {
      return handleError(err);
    }
  },
  delete: async (path: string, data?: any) => {
    try {
      const response = await fetch(`${env.BASE_API_URL}${path}`, {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
        handleError(response);
      }
      return response.json();
    } catch (err) {
      return handleError(err);
    }
  },
  getFile: async (path: string) => {
    const fileHeaders = {
      Authorization: `Bearer ${getToken()}`,
    };
    try {
      const response = await fetch(`${env.FILE_API_URL}${path}`, {
        method: 'GET',
        headers: fileHeaders,
      });
      if (response.status !== 200) {
        handleError(response);
      }
      const fileName = path.split('/').pop();
      if (fileName) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },
  fileUpload: async (path: string, files: any) => {
    const fileHeaders = {
      Authorization: `Bearer ${getToken()}`,
    };
    const form = new FormData();
    if (files.length > 0) {
      files.forEach((file: any) => {
        form.append('file', file);
      });
    } else form.append('file', files);
    const options = {
      method: 'POST',
      body: form,
      headers: fileHeaders,
    };
    try {
      const response = await fetch(`${env.FILE_API_URL}${path}`, options);
      if (response.status !== 200) {
        handleError(response);
      }
      return response.json();
    } catch (err) {
      return handleError(err);
    }
  },
  getFileBlob: async (path: string) => {
    const fileHeaders = {
      Authorization: `Bearer ${getToken()}`,
    };
    try {
      const response = await fetch(`${env.BASE_API_URL}${path}`, {
        method: 'GET',
        headers: fileHeaders,
      });
      if (response.status !== 200) {
        handleError(response);
      }
      const fileName = path.split('/').pop();
      if (fileName) {
        const blob = await response.blob();
        return window.URL.createObjectURL(blob);
      }
      return response;
    } catch (err) {
      return false;
    }
  },
  downloadFileBlob: async (path: string) => {
    const fileHeaders = {
      Authorization: `Bearer ${getToken()}`,
    };
    try {
      const response = await fetch(`${env.BASE_API_URL}${path}`, {
        method: 'GET',
        headers: fileHeaders,
      });
      if (response.status !== 200) {
        handleError(response);
      }
      const filename =
        response.headers.get('Content-Disposition')?.split('filename=')?.[1] ||
        path.split('/').pop();
      if (filename) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return true;
      }
      return response;
    } catch (err) {
      return false;
    }
  },

  postBase: async (path: string, data: any) => {
    try {
      const response = await fetch(`${path}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      if (response.status !== 200) {
        handleError(response);
      }
      return response.json();
    } catch (err) {
      return handleError(err);
    }
  },

  uploadKycFile: async (files: any) => {
    const fileHeaders = {
      Authorization: `Bearer ${getToken()}`,
      'Accept-Language': getLanguageKey()
  };
    const form = new FormData();
    if (files.length > 0) {
      files.forEach((file: any) => {
        form.append('file', file);
      });
    } else form.append('file', files);
    const options = {
      method: 'POST',
      body: form,
      headers: fileHeaders,
    };
    try {
      const response = await fetch(`${env.UPLOAD_FILE_E_KYC_URL}/addFile`, options);
      console.log(response)
      if (response.status !== 200) {
        handleError(response);
      }
      return response.json();
    } catch (err) {
      return handleError(err);
    }
  },
};
