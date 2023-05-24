import React, { Suspense } from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import reportWebVitals from "./reportWebVitals"
import {
	RouterProvider,
	createBrowserRouter
} from "react-router-dom"
import App from "./App"
import ErrorPage from "./components/pages/error/Error"
import Home from "./components/pages/home/Home"
import Login from "./components/pages/auth/login/Login"
import RegisterWrapper from "components/pages/auth/register/registerWrapper/Register"
import AuthForm from "components/pages/auth/auth/AuthForm"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import "./i18n"
import { yupLocale } from "utils/yupLocale"
import * as yup from 'yup';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Provider } from "react-redux"
import { store } from "store/store"

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <Home />
			},
			{
				element: <AuthForm />,
				children: [
					{
						path: "/login",
						element: <Login />
					},
					{
						path: "/signup",
						element: <RegisterWrapper />
					}
				]
			}
		]
	}
])

yup.setLocale(yupLocale);
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false
		}
	}
})

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
	<React.StrictMode>
		<Suspense>
			<Provider store={store}>
				<QueryClientProvider client={queryClient}>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<RouterProvider router={router} />
					</LocalizationProvider>
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</Provider>
		</Suspense>
	</React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
