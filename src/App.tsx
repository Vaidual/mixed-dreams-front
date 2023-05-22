import "./App.css"
import Header from "./components/layout/header/Header"
import { Outlet } from "react-router-dom"
import { ColorModeContext, useToggleMode } from "styles/theme"
import { ThemeProvider } from "@mui/material/styles"
import { CssBaseline, StyledEngineProvider } from "@mui/material"
import { useTranslation } from "react-i18next"

function App() {
	const { theme, toggleColorMode } = useToggleMode()

	return (
		<StyledEngineProvider injectFirst>
			<ColorModeContext.Provider value={toggleColorMode}>
				<ThemeProvider theme={theme}>
					<CssBaseline enableColorScheme />
					<div>
						<Header />
						<main className="max-width-container px-4 pt-32">
							<Outlet />
						</main>
					</div>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</StyledEngineProvider>
	)
}

export default App
