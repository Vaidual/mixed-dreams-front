import "./App.css"
import Header from "./components/layout/header/Header"
import { Outlet } from "react-router-dom"
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
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store/store"
import { logout } from "store/user/user.slice"
import _ from "underscore"


function App() {
	const { theme, toggleColorMode } = useToggleMode()

	const dispatch = useDispatch<AppDispatch>();
	const [authToken, setAuthToken] = useState(Cookies.get(CookiesTypes.AccessToken));
	useEffect(() => {
		if (authToken === undefined) {
			dispatch(logout())
		}
	}, [authToken, dispatch]);

	return (
		<StyledEngineProvider injectFirst>
			<ColorModeContext.Provider value={toggleColorMode}>
				<ThemeProvider theme={theme}>
					<NotificationProvider>
						<SnackbarProvider>
							<CssBaseline enableColorScheme />
							<div className="App flex flex-row h-full">
								<Header />
								<div className="flex pt-[72px] w-full">
									<Sidebar />
									<main className="flex max-width-container px-4 pt-10 flex-grow justify-center">
										<Outlet />
									</main>
								</div>
							</div>
						</SnackbarProvider>
					</NotificationProvider>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</StyledEngineProvider>
	)
}

export default App
