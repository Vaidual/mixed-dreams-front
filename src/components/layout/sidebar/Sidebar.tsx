import { FC, ReactNode, useState } from 'react'
import { Sidebar as ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import SellIcon from '@mui/icons-material/Sell';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useAppSelector } from 'hooks/userAppSelector';
import Roles from 'constants/Roles';
import EggIcon from '@mui/icons-material/Egg';
import { useTranslation } from 'react-i18next';

type Item = {
  label: string,
  to: string,
  icon: ReactNode
}

const Sidebar: FC = () => {
  const {t} = useTranslation("common\\sidebar");
  const roles = useAppSelector((state) => state.user.user?.roles);
  const theme = useTheme();
  const location = useLocation();

  if (!roles?.some(role => [Roles.Company].includes(role))) {
    return null;
  }

  const menuItems: Item[] = [
    { label: t("products"), to: "/products", icon: <SellIcon /> },
    // { label: "Ingredients", to: "/ingredients", icon: <EggIcon /> },
    // { label: "Orders", to: "/orders", icon: <ReceiptIcon /> },
    // { label: "Statistic", to: "/statistic", icon: <BarChartIcon /> },
    // { label: "Locations", to: "/locations", icon: <StorefrontIcon /> }
  ]
  return (
    <ProSidebar className='border-none mt-2' backgroundColor={theme.palette.background.default}>
      <Menu menuItemStyles={{
        button: {
          '&:hover': {
            backgroundColor: 'transparent',
            color: theme.palette.primary.main
          },
          '&.ps-active': {
            color: theme.palette.secondary.main
          }
        },
      }}>
        {menuItems.map(i =>
          <MenuItem 
            key={i.label}
            icon={i.icon} 
            component={<Link to={i.to} />}
            active={location.pathname.startsWith(i.to)}> 
              {i.label} 
          </MenuItem>)}
      </Menu>
    </ProSidebar>
  )
}

export default Sidebar