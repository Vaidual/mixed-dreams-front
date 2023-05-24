import "./App.css"
import Header from "./components/layout/header/Header"
import { Outlet } from "react-router-dom"
import { ColorModeContext, useToggleMode } from "styles/theme"
import { ThemeProvider } from "@mui/material/styles"
import { CssBaseline, StyledEngineProvider } from "@mui/material"
import { NotificationProvider } from "providers/NotificationContext"
import { SnackbarProvider } from "providers/Snackbar.provider"

function App() {
	const { theme, toggleColorMode } = useToggleMode()
	return (
		<StyledEngineProvider injectFirst>
			<ColorModeContext.Provider value={toggleColorMode}>
				<ThemeProvider theme={theme}>
					<NotificationProvider>
						<SnackbarProvider>
							<CssBaseline enableColorScheme />
							<div className="App">
								<Header />
								<main className="max-width-container px-4 pt-32">
									<Outlet />
								</main>
							</div>
						</SnackbarProvider>
					</NotificationProvider>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</StyledEngineProvider>
	)
}

export default App
