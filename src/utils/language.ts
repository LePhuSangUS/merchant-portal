import { getLocale, formatMessage } from '@@/plugin-locale/localeExports';

// get current language key
// vi-VN => vi, en-US => en...
export const getLanguageKey = () => {
  const lang = getLocale();
  const arr = lang?.split("-");
  return arr?.[0];
}

export const translate = (id: string, defaultMessage?: string, params?: any) => {
  return (
    formatMessage(
      {
        id,
        defaultMessage: defaultMessage || ''
      },
      {...params}
    )
  )
}
