import { ThemeProvider, useTheme } from "@emotion/react"
import { CssBaseline, StyledEngineProvider } from "@mui/material"
import Header from "components/layout/header/Header"
import { FC } from "react"
import { useRouteError } from "react-router-dom"
import { ColorModeContext, useToggleMode } from "styles/theme"

const ErrorPage: FC = () => {
  const { theme, toggleColorMode } = useToggleMode()
	const error: any = useRouteError()
	return (
		<StyledEngineProvider injectFirst>
			<ColorModeContext.Provider value={toggleColorMode}>
				<ThemeProvider theme={theme}>
					<CssBaseline enableColorScheme />
					<div>
						<Header />
						<main className="flex items-center justify-center min-h-screen">
							<div
								id="error-page"
								className="-mt-12 flex flex-col items-center justify-center"
							>
								<h1>Oops!</h1>
								<p>Sorry, an unexpected error has occurred.</p>
								<p>
									<i>{error.statusText || error.message}</i>
								</p>
							</div>
						</main>
					</div>
				</ThemeProvider>
			</ColorModeContext.Provider>
		</StyledEngineProvider>
	)
}

export default ErrorPage
