import { FormProvider } from 'hooks/useFormState';
import { FC } from 'react'
import { Outlet } from 'react-router-dom';

const AuthForm: FC = () => {

  return (
    <div className='mx-auto self-center -mt-52'>
      <FormProvider>
        <Outlet/>
      </FormProvider>
    </div>
  )
}

export default AuthForm