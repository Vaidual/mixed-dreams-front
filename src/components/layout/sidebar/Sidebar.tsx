import { FC, ReactNode, useEffect, useState } from 'react'
import { Sidebar as ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import SellIcon from '@mui/icons-material/Sell';
import BarChartIcon from '@mui/icons-material/BarChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { Badge, useTheme } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useAppSelector } from 'hooks/userAppSelector';
import Roles from 'constants/Roles';
import EggIcon from '@mui/icons-material/Egg';
import { useTranslation } from 'react-i18next';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import { getAccessToken } from 'services/auth/auth.helper';
import jwt_decode from "jwt-decode";
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import Topics from 'constants/Topics';
import { ICompanyClaims } from 'interfaces/claims.interface';

type Item = {
  label: string,
  to: string,
  icon: ReactNode,
  suffix?: ReactNode
}

const Sidebar: FC = () => {
  const { t } = useTranslation("common\\sidebar");
  const roles = useAppSelector((state) => state.user.user?.roles);
  const theme = useTheme();
  const location = useLocation();

  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [notificationsCount, setNotificationsCount] = useState(0);
  useEffect(() => {
    if (roles?.some(role => [Roles.Company].includes(role))) {
      try {
        const newConnection = new HubConnectionBuilder()
          .withUrl(process.env.REACT_APP_API_NOTIFICATION_HUB as string)
          .withAutomaticReconnect()
          .build();

        setConnection(newConnection);
      } catch (error) {
        console.log('Connection failed: ', error)
      }
    }
  }, [roles]);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(result => {
          console.log('Connected!');

          const token = getAccessToken() as string;
          var decodedHeader: ICompanyClaims = jwt_decode(token);
          connection.invoke(Topics.JoinGroup, decodedHeader.TenantId);

          connection.on(Topics.LowWaterNotification, message => {
            console.log(message);
            setNotificationsCount((prev) => prev + 1);
          });
        })
        .catch(e => console.log('Connection failed: ', e));
    }
  }, [connection]);

  if (!roles?.some(role => [Roles.Company].includes(role))) {
    return null;
  }

  const menuItems: Item[] = [
    { label: t("products"), to: "/products", icon: <SellIcon /> },
    // {
    //   label: "Devices", to: "/devices", icon: <DeviceHubIcon />, suffix: notificationsCount > 0 ? <Badge badgeContent={notificationsCount} color='warning' /> : null
    // },
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
        {menuItems.map(i => {
          const { label, to, ...rest } = i;
          return (
            <MenuItem
              key={label}
              {...rest}
              component={<Link to={to} />}
              active={location.pathname.startsWith(to)}>
              {label}
            </MenuItem>
          )
        }
        )}
      </Menu>
    </ProSidebar>
  )
}

export default Sidebar