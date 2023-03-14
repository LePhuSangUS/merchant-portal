declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';

// google analytics interface
type GAFieldsObject = {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  nonInteraction?: boolean;
};

interface Window {
  ga: (
    command: 'send',
    hitType: 'event' | 'pageview',
    fieldsObject: GAFieldsObject | string,
  ) => void;
  reloadAuthorized: () => void;
  socket?: any,
  env: any
}

declare let ga: () => void;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;


/**
 * Every update EnvType, still update file public/config/env.js
 * Every remove/add EnvType, still remove/add file src/env.ts
 */
type EnvType = {
  REACT_APP_ROUTE: '/merchant/portal' | '/portal';
  REACT_APP_ENV: 'dev' | 'uat' | 'prod';
  BASE_API_URL: string;
  FILE_API_URL: string;
  SOCKET_IO_URL: string;
  UPLOAD_FILE_E_KYC_URL: string;
  API_E_KYC_URL: string;
  SITE_KEY: string;
}

type ObjectType = Record<string, any>
