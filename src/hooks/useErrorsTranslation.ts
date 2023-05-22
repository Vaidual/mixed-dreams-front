import { useTranslation } from "react-i18next";

const useErrorsTranslation = () => {
  const { t } = useTranslation('common\\form');
  return function getTranslate(key?: string, values?: object) {
    if (key === undefined)
      return undefined
    if (values !== undefined)
      return t(key, values);
    return t(key);
  }
}

export default useErrorsTranslation