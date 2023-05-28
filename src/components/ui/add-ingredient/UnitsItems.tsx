import { MenuItem } from '@mui/material'
import { Units } from 'enums/Units'
import { useTranslation } from 'react-i18next';

const useUnitItems = () => {
  const { t } = useTranslation('d');

  const units = [
    { key: Units.Item, label: 'Pieces' },
    { key: Units.Cup, label: 'Caps' },
    { key: Units.Gram, label: 'Grams' },
    { key: Units.Kilogram, label: 'Kilograms' },
    { key: Units.Liter, label: 'Liters' },
    { key: Units.Milliliter, label: 'Milliliters' },
    { key: Units.Ounce, label: 'Ounces' },
    { key: Units.Pint, label: 'Pints' },
  ]

  return units
}


export default useUnitItems