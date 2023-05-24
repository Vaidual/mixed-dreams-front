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

function App() {
	const { theme, toggleColorMode } = useToggleMode()
	const roles = useAppSelector((state) => state.user.user?.roles);

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
									{roles?.some(role => [Roles.Company].includes(role)) && <Sidebar />}
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
