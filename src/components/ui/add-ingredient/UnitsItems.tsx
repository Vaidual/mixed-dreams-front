import { MenuItem } from '@mui/material'
import { Units } from 'enums/Units'
import { useTranslation } from 'react-i18next';

const useUnitItems = () => {
  const { t } = useTranslation(['ingredients']);

  const units = [
    { key: Units.Item, label: t(`units.${Units[Units.Item]}`) },
    { key: Units.Cup, label: t(`units.${Units[Units.Cup]}`) },
    { key: Units.Gram, label: t(`units.${Units[Units.Gram]}`) },
    { key: Units.Kilogram, label: t(`units.${Units[Units.Kilogram]}`) },
    { key: Units.Liter, label: t(`units.${Units[Units.Liter]}`) },
    { key: Units.Milliliter, label: t(`units.${Units[Units.Milliliter]}`) },
    { key: Units.Ounce, label: t(`units.${Units[Units.Ounce]}`) },
    { key: Units.Pint, label: t(`units.${Units[Units.Pint]}`) },
  ]

  return units
}


export default useUnitItems