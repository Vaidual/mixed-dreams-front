import i18n from "i18next"
import {initReactI18next} from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"
import {format as formatDate, isDate} from 'date-fns';
import {enUS as en, uk as ua} from "date-fns/locale";
import Language from "../types/Language";

export const i18nToFnslocales: Record<Language, Locale> = {
    "en": en,
    "uk": ua
};

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
        interpolation: {
            format: (value, format = "P", lng = "en") => {
                if (isDate(value)) {
                    const locale = i18nToFnslocales[lng as Language];
                    console.log(formatDate(value, format, {locale}))
                    return formatDate(value, format, {locale});
                }
                console.log(111)
                return value
            },
            escapeValue: false
        },
        // interpolation: {
        // 	format: function(value, format) {
        // 		console.log(value)
        // 		if (format === 'dateFormat') return formatDate(value, 'yyyy-MM-dd');
        // 		return value;
        // 	}
        // },
        // interpolation: {
        // 	formatSeparator: ',',
        // 	format: function(value, formatting, lng){
        // 		 if (value instanceof Date && !!formatting) {
        // 			return formatDate(value, formatting);
        // 		 }
        // 		 return value.toString();
        // 	}
        // },
        supportedLngs: ["en", "uk"],
        fallbackLng: "uk",
        detection: {
            order: ["path", "localStorage", "querystring", "navigator", "htmlTag"],
            caches: ["localStorage"]
        },
        backend: {
            loadPath: "/assets/locales/{{ns}}/{{lng}}.json"
        },
        // Used for nested namespaces
        //interpolation: { escapeValue: false }
    })
export default i18n
