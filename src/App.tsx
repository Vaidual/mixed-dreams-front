import "./App.css"
import Header from "./components/layout/header/Header"
import {Outlet, useNavigate} from "react-router-dom"
import { ColorModeContext, useToggleMode } from "styles/theme"
import { ThemeProvider } from "@mui/material/styles"
import { CssBaseline, StyledEngineProvider } from "@mui/material"
import { NotificationProvider } from "providers/NotificationContext"
import { SnackbarProvider } from "providers/Snackbar.provider"
import Sidebar from "components/layout/sidebar/Sidebar"
import { useAppSelector } from "hooks/userAppSelector"
import Roles from "constants/Roles"
import CookiesTypes from "constants/CookiesTypes"
import Cookies from "js-cookie"
import React, {ReactNode, useEffect, useMemo, useState} from "react"
import { useDispatch } from "react-redux"
import {AppDispatch, store} from "store/store"
import { logout } from "store/user/user.slice"
import _ from "underscore"
import {AxiosError} from "axios/index";
import {removeTokens} from "./services/auth/auth.helper";
import {instance} from "./api/api.interceptor";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {useTranslation} from "react-i18next";
import {i18nToFnslocales} from "./localization/i18n";
import Language from "./types/Language";

type Props = {
	children?: ReactNode
}
function App({children} :Props) {
	const { theme, toggleColorMode } = useToggleMode()
	const {i18n} = useTranslation()

	const dispatch = useDispatch<AppDispatch>();
	const [authToken, setAuthToken] = useState(Cookies.get(CookiesTypes.AccessToken));
	useEffect(() => {
		if (authToken === undefined) {
			dispatch(logout())
		}
	}, [authToken, dispatch]);

	const navigate = useNavigate();
	useMemo(() => {
		instance.interceptors.response.use(
			response => response,
			async (error: AxiosError) => {
				if (error.response?.status === 401) {
					removeTokens()
					store.dispatch(logout());
					navigate("/login")
				}
				return Promise.reject(error.response?.data ?? error);
			})
	},[])

	return (
		<StyledEngineProvider injectFirst>
			<ColorModeContext.Provider value={toggleColorMode}>
				<ThemeProvider theme={theme}>
					<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={i18nToFnslocales[i18n.language as Language]}>
						<NotificationProvider>
							<SnackbarProvider>
								<CssBaseline enableColorScheme />
								<div className="App flex flex-row h-full">
									<Header />
									<div className="flex pt-[72px] w-full">
										<Sidebar />
										<main className="flex max-width-container px-4 pt-10 flex-grow">
											{children ??  <Outlet />}
										</main>
									</div>
								</div>
							</SnackbarProvider>
						</NotificationProvider>
					</LocalizationProvider>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</StyledEngineProvider>
	)
}

export default App
