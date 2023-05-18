import { FC } from "react"
import styles from "./Header.module.css"
import { Button } from "@mui/material"
import { Link } from "react-router-dom"

const Header: FC = () => {
  return (
    <header className={styles.header}>
      <Link to="/signup">
        <Button>Signup</Button>
      </Link>
    </header>
  )
}

export default Header