import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import Backend from "i18next-http-backend"

i18n
	.use(initReactI18next)
	.use(LanguageDetector)
	.use(Backend)
	.init({
		supportedLngs: ["en", "ua"],
		fallbackLng: "ua",
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
