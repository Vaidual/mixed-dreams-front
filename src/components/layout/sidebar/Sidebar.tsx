import { FC, ReactNode, useState } from 'react'
import { Sidebar as ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import SellIcon from '@mui/icons-material/Sell';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';

type Item = {
  label: string,
  to: string,
  icon: ReactNode
}

const Sidebar: FC = () => {
  const theme = useTheme();

  const location = useLocation();

  const menuItems: Item[] = [
    { label: "Products", to: "/products", icon: <SellIcon /> },
    { label: "Orders", to: "/orders", icon: <ReceiptIcon /> },
    { label: "Statistic", to: "/statistic", icon: <BarChartIcon /> },
    { label: "Locations", to: "/locations", icon: <StorefrontIcon /> }
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