// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  // plugins: [
  //   'react-dev-inspector/plugins/umi/react-inspector',
  // ],
  // inspectorConfig: {
  //   exclude: [],
  //   babelPlugins: [],
  //   babelOptions: {},
  // },
  define: {
    REACT_APP_ROUTE: '/',
    BASE_API_URL: 'https://dev-portal.neopay.vn/merchant/api/v1',
    FILE_API_URL: 'https://dev-api.neopay.vn/storage/api',
    SOCKET_IO_URL: 'https://dev-portal.neopay.vn/merchant/io',
    UPLOAD_FILE_E_KYC_URL: "https://dev-api.neopay.vn/storage/api/eKyc/merchant/file-service/v1",
    API_E_KYC_URL: "https://dev-api.neopay.vn/storage/api/eKyc/merchant/ai/v1",
    SITE_KEY:"6LcgpvEgAAAAAOI8JbuFok3XkUuhPNxbGZxhqYdk"
  }
});
