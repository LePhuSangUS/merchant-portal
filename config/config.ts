import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const REACT_APP_ENV = process.env.REACT_APP_ENV || 'prod';
const REACT_APP_ROUTE = process.env.REACT_APP_ROUTE || '/merchant/portal';

export default defineConfig({
  hash: true,
  base: `${REACT_APP_ROUTE}`,
  publicPath: `${REACT_APP_ROUTE}/`,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'browser',
  },
  locale: {
    default: 'vi-VN',
    antd: true,
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user/login',
              name: 'Login',
              component: './user/login',
            },
            {
              path: '/user/register',
              name: 'Sign up',
              component: './user/register',
            },
            {
              path: '/user/registration-update/:id',
              name: 'Registration update',
              component: './user/registration-update',
            },
            {
              path: '/user/activation/:token',
              name: 'Account activation',
              component: './user/activation',
            },
            {
              path: '/user/reset-password/:id/:token',
              name: 'Reset password',
              component: './user/reset-password',
            },
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/CustomLayout',
          Routes: ['src/pages/Authorized'],
          authority: ['admin', 'user'],
          routes: [],
        },
      ],
    },
  ],
  theme: {
    'primary-color': defaultSettings.primaryColor,
    'btn-border-radius-base': defaultSettings?.btnBorderRadiusBase,
    'btn-border-radius-sm': defaultSettings?.btnBorderRadiusSM,
    'border-radius-base': defaultSettings?.borderRadiusBase,

    'btn-font-weight': defaultSettings.btnFontWeight,

    'btn-primary-bg': defaultSettings.btnPrimaryBg,
    'btn-primary-color': defaultSettings.btnPrimaryColor,

    // "btn-default-bg":defaultSettings.btnDefaultBg,
    // "btn-default-color":defaultSettings.btnDefaultColor,

    //Input
    'input-border-color': defaultSettings.inputBorderColor,
    'input-bg': defaultSettings.inputBg,
    'input-placeholder-color': defaultSettings.inputPlaceholderColor,
    //Select
    'select-background': defaultSettings.selectBackground,
    'select-border-color': defaultSettings.selectBorderColor,

    //Error
    'error-color': defaultSettings.errorColor,

    //Picker
    'picker-bg': defaultSettings.pickerBg,
    //Height Base
    // "height-base":defaultSettings.heightBase

    //Tabs
    'tabs-bar-margin': defaultSettings.tabsBarMargin,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV],
  manifest: {
    basePath: `${REACT_APP_ROUTE}`,
    publicPath: `${REACT_APP_ROUTE}/`,
  },
  esbuild: {},
  define: {
    REACT_APP_ENV,
    REACT_APP_ROUTE,
  },
});
