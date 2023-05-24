import { FC, useContext, useEffect, useRef, useState } from "react"
import {
	Button,
	IconButton,
	Menu,
	MenuItem,
	useTheme
} from "@mui/material"
import Link from "@mui/material/Link"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import { ColorModeContext } from "styles/theme"
import Brightness7Icon from "@mui/icons-material/Brightness7"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import { useTranslation } from "react-i18next"
import Language from "types/Languge"
import LanguageIcon from "@mui/icons-material/Language"
import { useAppSelector } from "hooks/userAppSelector"
import { AuthService } from "services/auth/auth.service"
import { logout } from "store/user/user.slice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store/store"

const Languages: { id: Language; name: string }[] = [
	{ id: "ua", name: "Українська" },
	{ id: "en", name: "English" }
]

const Header: FC = () => {
	const menuRef = useRef<HTMLDivElement>(null);
	const [isOpened, setIsOpened] = useState(false);
	useEffect(() => {
		if (isOpened) menuRef.current?.classList.remove("hidden");
		else menuRef.current?.classList.add("hidden");
	}, [isOpened]);
	const handleClick = () => setIsOpened(prev => !prev);

	const colorMode = useContext(ColorModeContext);
	const theme = useTheme();
	const { t } = useTranslation('common\\header');
	const user = useAppSelector((state) => state.user.user);

	const dispatch = useDispatch<AppDispatch>();
	const handleLogout = () => {
		dispatch(logout())
	}

	return (
		<header className="w-full border-b border-gray-400 fixed">
			<div className="max-width-container inset-x-0 top-0 z-50">
				<nav
					className="flex w-full items-center justify-between p-6 lg:px-8"
					aria-label="Global"
				>
					<div className="">
						<Link href="/" className="">
							<span className="sr-only">Mixed Dreams Logo</span>
							<img
								className="h-10"
								src="https://placekitten.com/144/144"
								alt=""
							/>
						</Link>
					</div>
					<div ref={menuRef} className="hidden flex-row md:flex">
						<div className="flex flex-col gap-x-5 md:flex-row">
							<Link
								underline="none"
								href="#"
								className="text-sm font-semibold leading-6"
							>
								{t('navLinks.product')}
							</Link>
							<Link
								underline="none"
								href="#"
								className="text-sm font-semibold leading-6"
							>
								{t('navLinks.features')}
							</Link>
							<Link
								underline="none"
								href="#"
								className="text-sm font-semibold leading-6"
							>
								{t('navLinks.tryNow')}
							</Link>
						</div>
					</div>
					<div className="flex flex-row items-center gap-x-5">
						<IconButton onClick={colorMode.toggleColorMode}>
							{theme.palette.mode === "dark" ? (
								<Brightness7Icon />
							) : (
								<Brightness4Icon />
							)}
						</IconButton>
						<LangDropDown />
						{user !== null ? 
						<Button onClick={handleLogout} variant="contained" className="rounded-3xl">{t('actions.logout')}</Button> :
						<Link className="whitespace-nowrap no-underline" href="/login">
							{t('actions.logIn')} &rarr;
						</Link>}
					</div>
					<Button
						onClick={handleClick}
						className="-m-2.5 rounded-md p-2.5 md:hidden"
					>
						<span className="sr-only">Toggle menu</span>
						{isOpened ? <CloseIcon /> : <MenuIcon />}
					</Button>
				</nav>
			</div>
		</header>
	)
}

const LangDropDown = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	const { i18n } = useTranslation()
	const onLangChange = (lang: Language) => {
		i18n.changeLanguage(lang)
		handleClose()
	}

	const theme = useTheme()

	let menuItems = Languages.map(lang => {
		return (
			<MenuItem
				sx={{
					cursor: "pointer",
					padding: "0.7em 0.5em",
					margin: "0.3em 0",
					":hover": { color: theme.palette.text.primary },
					".active": { color: "deepskyblue" },
					color:
						lang.id === i18n.language
							? theme.palette.primary.main
							: theme.palette.text.primary
				}}
				key={lang.id}
				onClick={() => {
					onLangChange(lang.id)
				}}
				className={`${lang.id === i18n.language && "active"}`}
			>
				{lang.name}
			</MenuItem>
		)
	})

	return (
		<div>
			<IconButton
				id="basic-button"
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
			>
				<LanguageIcon />
			</IconButton>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button"
				}}
			>
				{menuItems}
			</Menu>
		</div>
	)
}

export default Header
