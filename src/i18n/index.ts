import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import zhTW from './locales/zh-TW.json'

const stored = localStorage.getItem('lang')

function syncHtmlLang(lng: string) {
  document.documentElement.lang = lng === 'en' ? 'en' : 'zh-Hant'
}

i18n.use(initReactI18next).init({
  resources: {
    'zh-TW': { translation: zhTW },
    en: { translation: en },
  },
  lng: stored === 'en' || stored === 'zh-TW' ? stored : 'zh-TW',
  fallbackLng: 'zh-TW',
  interpolation: { escapeValue: false },
})

syncHtmlLang(i18n.language)

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng)
  syncHtmlLang(lng)
})

export default i18n
