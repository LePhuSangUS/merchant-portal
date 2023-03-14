import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = Partial<ProSettings> & {
  pwa: boolean;
  btnBorderRadiusBase: string,
  btnBorderRadiusSM: string,
  borderRadiusBase: string,
  //Button Config
  btnFontWeight: string,

  btnPrimaryBg: string,
  btnPrimaryColor: string,
  // btnDefaultBg:string,
  // btnDefaultColor:string
  //Input
  inputBg: string,
  inputBorderColor: string,
  inputPlaceholderColor: string
  //Select
  selectBorderColor: string
  selectBackground: string
  //Error
  errorColor: string,
  //Picker
  pickerBg: string,
  //Height Base
  // heightBase:string

  //Tabs
  tabsBarMargin: string;
  siderWidth?: number;

};

const proSettings: DefaultSettings = {
  navTheme: 'light',
  primaryColor: '#764cf0',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  title: '', // title top sidebar
  pwa: false,
  iconfontUrl: '',
  headerHeight: 65,
  splitMenus: false,
  siderWidth: 256,

  borderRadiusBase: "0.313rem",


  //Button Config
  btnBorderRadiusBase: "6px",
  btnBorderRadiusSM: "6px",


  btnFontWeight: "bold",

  btnPrimaryBg: "#fed07f",
  btnPrimaryColor: "#2f2f2f",

  // btnDefaultBg:"#fdbd39",
  // btnDefaultColor:"#000"

  //Input
  inputBorderColor: "transparent",
  inputBg: "#f6f7fa",
  inputPlaceholderColor: "#9CA6B9",
  //Select
  selectBorderColor: "transparent",
  selectBackground: "#f6f7fa",
  //Error
  errorColor: "#f76176",

  //Picker
  pickerBg: "#f6f7fa",

  //Height Base
  // heightBase: "46px",
  // @height-lg: 40px;
  // @height-sm: 24px;

  //Tabs
  tabsBarMargin: "0 0 30px 0"
};

export type { DefaultSettings };

export default proSettings;
