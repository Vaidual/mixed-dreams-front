import { FC } from 'react'
import styles from './AuthForm.module.css';
import { Outlet } from 'react-router-dom';

const AuthForm: FC = () => {
  return (
    <div className={styles.formWrapper}>
      <Outlet/>
    </div>
  )
}

export default AuthForm