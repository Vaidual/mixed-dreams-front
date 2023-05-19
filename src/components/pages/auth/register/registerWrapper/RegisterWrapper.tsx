import { Button, StepLabel } from '@mui/material';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import { Dispatch, FC, SetStateAction, useState } from 'react'
import Contact from '../account/Account';
import Business from '../business/Business';
import { IOptionalRegisterCompany, IRegisterCompany } from 'interfaces/auth.interface';
import { AuthService } from 'services/auth/auth.service';

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
  const [formState, setFormState] = useState<IOptionalRegisterCompany>({} as IOptionalRegisterCompany);
  const [formData, setFormData] = useState<IOptionalRegisterCompany>()
  const [activeStep, setActiveStep] = useState<number>(0);
  const [nextBtnIsDisabled, setNextBtnIsDisabled] = useState(true);

  const stepProps: IRegisterStepsProps = {formState, setFormState, setNextBtnIsDisabled}

  const registerSteps: FormStepType[] = [
    {label: 'Your account', element: <Contact {...stepProps}/>}, 
    {label: 'Business information', element: <Business {...stepProps}/>}
  ];

  const handleNext = async () => {
    if (activeStep === registerSteps.length - 1) {
      const response = await AuthService.registerCompany({...formState, ...formData} as IRegisterCompany)
      console.log(response)
    }
    else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  }

  const handleBack = () => {
    setFormState({...formState, ...formData})
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
    <Stepper activeStep={activeStep}>
      {registerSteps.map((step, index) => (
        <Step key={step.label} completed={index <= activeStep}>
          <StepLabel color="inherit">
            {step.label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
    {registerSteps[activeStep].element}
    <div>
      <Button
        color="inherit"
        disabled={activeStep === 0}
        onClick={handleBack}
      >
        Back
      </Button>
      <Button onClick={handleNext} disabled={nextBtnIsDisabled}>
        {activeStep === registerSteps.length - 1 ? 'Finish' : 'Next'}
      </Button>
    </div>
    </>
  )
}

export default RegisterWrapper