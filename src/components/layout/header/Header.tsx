import { FC } from "react"
import styles from "./Header.module.css"
import { Button } from "@mui/material"
import { Link } from "react-router-dom"

const Header: FC = () => {
  return (
    <header className={styles.header}>
      <Link to="/login">
        <Button>Sign in</Button>
      </Link>
    </header>
  )
}

export default Header