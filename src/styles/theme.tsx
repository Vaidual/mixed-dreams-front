import { ThemeOptions, createTheme } from "@mui/material/styles"
import { createContext, forwardRef, useMemo, useState } from "react"
import ThemeModes from "enums/ThemeModes"
import StorageTypes from "constants/StorageTypes"
import {
	Link as RouterLink,
	LinkProps as RouterLinkProps
} from "react-router-dom"
import { LinkProps } from "@mui/material/Link"
import { enUS as grid_ukUA, ukUA as grid_enUS } from "@mui/x-data-grid";
import { ukUA, enUS } from '@mui/material/locale';
import { ukUA as pickers_ukUA, enUS as pickers_enUS } from '@mui/x-date-pickers/locales';
import { useTranslation } from "react-i18next"

const LinkBehavior = forwardRef<
	HTMLAnchorElement,
	Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] }
>((props, ref) => {
	const { href, ...other } = props
	// Map href (Material UI) -> to (react-router)
	return <RouterLink ref={ref} to={href} {...other} />
})

export const themeOptions = (mode: ThemeModes) => {
	return {
		palette: {
			mode,
			...(mode === ThemeModes.Dark
				? {
					primary: {
						main: "#ed884e"
					},
					secondary: {
						main: "#ba68c8"
					},
					background: {
						default: "#2d282b",
						paper: "#1a1a1b",
						paperHover: "#303030"
					}
				}
				: {
					primary: {
						main: "#fc9c2f"
					},
					secondary: {
						main: "#c1358e"
					},
					background: {
						default: "#fbfbfb",
						paper: "#F5F5F5",
						paperHover: "#eeeeee"
					},
					text: {
						grey: "#a0a0a0"
					}
				})
		},
		typography: {
			button: {
				textTransform: "none"
			}
		},
		components: {
			MuiLink: {
				defaultProps: {
					component: LinkBehavior
				} as LinkProps
			},
			MuiButtonBase: {
				defaultProps: {
					LinkComponent: LinkBehavior
				}
			},
			MuiOutlinedInput: {
				styleOverrides: {
					input: {
						'&:-webkit-autofill': {
							'WebkitBoxShadow': `0 0 0 100px ${mode === ThemeModes.Light ? '#fce1ff' : '#5d3a63'} inset`,
							'WebkitTextFillColor': `${mode === ThemeModes.Light ? '#2e2e2e' : '#f4f4f4'}`
						}
					}
				}
			},
			MuiPopover: {
				defaultProps: {
					container: document.getElementById("root"),
				},
			},
			MuiPopper: {
				defaultProps: {
					container: document.getElementById("root"),
				},
			},
			MuiDialog: {
				defaultProps: {
					container: document.getElementById("root"),
				},
			},
			MuiModal: {
				defaultProps: {
					container: document.getElementById("root"),
				},
			},
		},
	}
}

export const ColorModeContext = createContext({
	toggleColorMode: () => { }
})

export const useToggleMode = () => {
	let preferredMode: ThemeModes = localStorage.getItem(
		StorageTypes.ThemeMode
	) as ThemeModes
	if (!preferredMode)
		preferredMode = window.matchMedia("(prefers-color-scheme: dark)")
			? ThemeModes.Dark
			: ThemeModes.Light

	const [mode, setMode] = useState(preferredMode)
	const toggleColorMode = useMemo(
		() => ({
			toggleColorMode: () => setMode((prevMode) => {
				const newMode = prevMode === ThemeModes.Light ? ThemeModes.Dark : ThemeModes.Light
				localStorage.setItem(StorageTypes.ThemeMode, newMode)
				return newMode
			})
		})
		, []);

	const { i18n } = useTranslation();
	let lang: any;
	switch (i18n.language) {
		case 'en':
			lang = [enUS, grid_enUS, pickers_enUS]
			break;
		case 'ua':
			lang = [ukUA, grid_ukUA, pickers_ukUA]
			break;
		default:
			lang = [enUS, grid_enUS, pickers_enUS]
			break;
	}

	const theme = useMemo(
		() => createTheme(themeOptions(mode) as ThemeOptions, ...lang),
		[mode, lang]
	)
	return { mode, theme, toggleColorMode }
}
