import { FC } from 'react'
import { Sidebar as ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import SellIcon from '@mui/icons-material/Sell';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar: FC = () => {
  const theme = useTheme();

  return (
    <ProSidebar className='border-none mt-2' backgroundColor={theme.palette.background.default}>
      <Menu menuItemStyles={{
        button: {
          '&:hover': {
            backgroundColor: 'transparent',
            color: theme.palette.primary.main
          },
        },
      }}>
        <MenuItem icon={<SellIcon />} component={<Link to={'/products'}/>}> Products </MenuItem>
        <MenuItem icon={<ReceiptIcon />} component={<Link to={'/orders'}/>}> Orders </MenuItem>
        <MenuItem icon={<BarChartIcon />} component={<Link to={'/statistic'}/>}> Statistic </MenuItem>
      </Menu>
    </ProSidebar>
  )
}

export default Sidebar