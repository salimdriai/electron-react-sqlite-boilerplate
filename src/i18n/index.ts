import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getFromLocalStorage } from 'utils/local-storage';

import fr from './fr.json';
import en from './en.json';

const settings: any = getFromLocalStorage('settings');
const lng = settings?.lang || 'en';

const resources = {
  en: {
    translation: en.translation,
  },
  fr: {
    translation: fr.translation,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng,

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
