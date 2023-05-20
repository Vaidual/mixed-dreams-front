import { FC } from 'react'
import { Outlet } from 'react-router-dom';

const AuthForm: FC = () => {

  return (
    <div className=' mx-auto'>
      <Outlet/>
    </div>
  )
}

export default AuthForm