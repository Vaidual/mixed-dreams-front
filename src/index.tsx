import React, {Suspense} from "react"
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
import RegisterWrapper from "components/pages/auth/register/registerWrapper/RegisterWrapper"
import AuthForm from "components/pages/auth/form/AuthForm"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import "./i18n"
import { yupLocale } from "utils/yupLocale"
import * as yup from 'yup';

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

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
	<React.StrictMode>
		<Suspense>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<RouterProvider router={router}/>
			</LocalizationProvider>
		</Suspense>
	</React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
