import { StepButton } from '@mui/material';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import { Dispatch, FC, SetStateAction, useCallback } from 'react'
import Contact from '../account/Account';
import Business from '../business/Business';
import { IOptionalRegisterCompany } from 'interfaces/auth.interface';
import { AuthService } from 'services/auth/auth.service';
import { produce } from 'immer';
import { useFormState } from 'hooks/useFormState';
import { format } from 'date-fns';
import { useRedirect } from 'hooks/useRedirect';

export interface IRegisterStepsProps {
  formState: IOptionalRegisterCompany
  setFormState: Dispatch<IOptionalRegisterCompany>
  setNextBtnIsDisabled: Dispatch<SetStateAction<boolean>>
}

type FormStepType = {
  label: string,
  element: JSX.Element
}

const RegisterWrapper: FC = () => {
  const { formState, setFormState, resetFormState } = useFormState();

  const next = useCallback(() => {
    setFormState(
      produce((form) => {
        form.selectedIndex += 1;
      })
    );
  }, [setFormState]);
 
  const prev = useCallback(() => {
    setFormState(
      produce((form) => {
        form.selectedIndex -= 1;
      })
    );
  }, [setFormState]);
 
  const setSelectedIndex = useCallback(
    (index: number) => {
      setFormState(
        produce((form) => {
          form.selectedIndex = index;
        })
      );
    },
    [setFormState]
  );
 
  const redirect = useRedirect();
  const onComplete = useCallback(async () => {
    const {birthday, firstName, lastName, companyName, ...address} = formState.steps.business.value;
    console.log({birthday, firstName, lastName, companyName, ...address})
    const response = await AuthService.registerCompany({...formState.steps.account.value, birthday: format(birthday!, 'yyyy-MM-dd'), firstName, lastName, companyName, ...address})
    console.log(response)
    resetFormState()
    redirect()
  }, [formState, redirect, resetFormState]);
  
  const registerSteps: FormStepType[] = [
    {label: 'Your account', element: <Contact onNext={next}/>}, 
    {label: 'Business information', element: <Business onComplete={onComplete} onPrev={prev}/>}
  ];

  return (
    <>
    <div className='mt-10 mx-auto max-w-lg'>
      <Stepper activeStep={formState.selectedIndex}>
        {registerSteps.map((step, index) => (
          <Step key={step.label} completed={index < formState.selectedIndex}>
            <StepButton className='m-0' color="inherit" 
              disabled={!Object.values(formState.steps)
                .slice(0, index)
                .every((step) => step.valid && !step.dirty)} 
              onClick={() => setSelectedIndex(index)}>
              {step.label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      {registerSteps[formState.selectedIndex].element}
    </div>
    </>
  )
}

export default RegisterWrapper