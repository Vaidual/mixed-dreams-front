import { FC, useContext, useEffect, useRef, useState } from "react"
import { Button, IconButton, useTheme } from "@mui/material"
import Link from "@mui/material/Link"
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { ColorModeContext } from "styles/theme";
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
const Header: FC = () => {
	const colorMode = useContext(ColorModeContext);
	const theme = useTheme()
	const menuRef = useRef<HTMLDivElement>(null);
	const [isOpened, setIsOpened] = useState(false);

	useEffect(() => {
		if (isOpened)
			menuRef.current?.classList.remove("hidden")
		else
		menuRef.current?.classList.add("hidden")
	}, [isOpened])
	const handleClick = () => setIsOpened((prev) => !prev);
	return (
		<header className="max-width-container fixed inset-x-0 top-0 z-50" color={theme.palette.background.default}>
			<nav className="flex items-center justify-between p-6 lg:px-8 w-full" aria-label="Global">
				<div className="">
					<Link href="/" className="">
						<span className="sr-only">Mixed Dreams Logo</span>
						<img className="h-10" src="https://placekitten.com/144/144" alt=""/>
					</Link>
				</div>
				<div ref={menuRef} className='hidden md:flex flex-row'>
					<div className="flex flex-col gap-x-5 md:flex-row">
							<Link underline="none" href="#" className="text-sm font-semibold leading-6">Product</Link>
							<Link underline="none" href="#" className="text-sm font-semibold leading-6">Features</Link>
							<Link underline="none" href="#" className="text-sm font-semibold leading-6">Try now</Link>
					</div>
				</div>
				<div className="flex flex-row items-center gap-x-5">
					<IconButton onClick={colorMode.toggleColorMode}>
						{theme.palette.mode === 'dark' ? <Brightness7Icon/> : <Brightness4Icon/>}
					</IconButton>
					<Link className="no-underline whitespace-nowrap" href="/login">
							Log in &rarr;
					</Link>
				</div>
				<Button onClick={handleClick} className="-m-2.5 rounded-md p-2.5 md:hidden">
            <span className="sr-only">Toggle menu</span>
            {isOpened ? <CloseIcon/> : <MenuIcon/> }
          </Button>
    	</nav>
		</header>
	)
}

export default Header
