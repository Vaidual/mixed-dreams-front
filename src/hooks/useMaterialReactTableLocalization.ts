import { MRT_Localization_UK } from 'material-react-table/locales/uk';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { useTranslation } from 'react-i18next';
import { MRT_Localization } from 'material-react-table';

export const useMaterialReactTableLocalization = () => {
  const { i18n } = useTranslation();
  let lang: MRT_Localization;
  switch (i18n.language) {
		case 'en':
			lang = MRT_Localization_EN
			break;
		case 'ua':
			lang = MRT_Localization_UK
			break;
		default:
			lang = MRT_Localization_EN
			break;
	}
  
  return lang;
} 