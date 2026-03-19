import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import en from "./translations/en";
import fr from "./translations/fr";

export const i18n = new I18n({ en, fr });
i18n.enableFallback = true;

export function setI18nLanguage(lang) {
  i18n.locale = lang;
}

export function initI18n(defaultLang) {
  const deviceLang = Localization.getLocales()[0]?.languageCode ?? "en";
  i18n.locale = defaultLang ?? deviceLang;
}

export function useTranslation(lang) {
  if (lang) i18n.locale = lang;
  return {
    t: (key, options) => i18n.t(key, options),
  };
}