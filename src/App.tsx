import "./App.css"
import Header from "./components/layout/header/Header"
import { Outlet } from "react-router-dom"
import { ColorModeContext, useToggleMode } from "styles/theme"
import { ThemeProvider } from "@emotion/react"
import { CssBaseline, StyledEngineProvider } from "@mui/material"

function App() {
	const {theme, toggleColorMode} = useToggleMode();
	return (
		<StyledEngineProvider injectFirst>
			<ColorModeContext.Provider value={toggleColorMode}>
				<ThemeProvider theme={theme}>
					<CssBaseline enableColorScheme />
					<div>
						<Header />
						<main className="px-4 pt-20">
							<Outlet />
						</main>
					</div>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</StyledEngineProvider>
	)
}

export default App
