/**
 * Declare duplicate with EnvType, use for run development
 * Every remove/add/update, should update for run development and EnvType in src/typings.d.ts
 */
declare const REACT_APP_ROUTE: '/merchant/portal' | '/portal';
declare const REACT_APP_ENV: 'dev' | 'uat' | 'prod';
declare const BASE_API_URL: string;
declare const FILE_API_URL: string;
declare const SOCKET_IO_URL: string;
declare const UPLOAD_FILE_E_KYC_URL: string;
declare const API_E_KYC_URL: string;
declare const SITE_KEY: string;

export const env: EnvType = REACT_APP_ENV === 'prod' ? { ...process.env, ...window.env } : {
    ...process.env,
    // env variable for run node development, not for build prod
    REACT_APP_ROUTE,
    REACT_APP_ENV,
    BASE_API_URL,
    FILE_API_URL,
    SOCKET_IO_URL,
    UPLOAD_FILE_E_KYC_URL,
    API_E_KYC_URL,
    SITE_KEY,
}