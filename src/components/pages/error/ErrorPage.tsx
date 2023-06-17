import { ThemeProvider, useTheme } from "@emotion/react"
import {Button, CssBaseline, Link, StyledEngineProvider} from "@mui/material"
import Header from "components/layout/header/Header"
import React, { FC } from "react"
import {useNavigate, useRouteError} from "react-router-dom"
import { ColorModeContext, useToggleMode } from "styles/theme"
import {Trans, useTranslation} from "react-i18next";

const ErrorPage: FC = () => {
	const error: any = useRouteError()
	const navigate = useNavigate();
	const {t} = useTranslation(["notFound"])

	return (
		<div
			id="error-page"
			className="mt-28 flex flex-col w-full"
		>
			<span className="text-6xl">{t("title")}</span>
			<p className="font-bold text-4xl">{t("subtitle")}</p>
			<p>
				<i>{t("description")}</i>
			</p>
			<p><Trans t={t} i18nKey="links">Try our <Link onClick={()=>navigate("/home")}>homepage</Link> or <Link onClick={()=>navigate(-1)}>back</Link></Trans></p>
		</div>
	)
}

export default ErrorPage
