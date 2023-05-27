import { StepButton } from '@mui/material';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import { Dispatch, FC, SetStateAction, useCallback, useContext } from 'react'
import Contact from '../account/Account';
import Business from '../business/Business';
import { IOptionalRegisterCompany, IRegisterCompany } from 'interfaces/auth.interface';
import { produce } from 'immer';
import { useFormState } from 'hooks/useFormState';
import { format } from 'date-fns';
import { useRedirect } from 'hooks/useRedirect';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'hooks/userAppSelector';
import { useDispatch } from 'react-redux';
import { registerCompany } from 'store/user/user.actions';
import { AppDispatch } from 'store/store';
import { IStandardError } from 'interfaces/responseError.interface';
import { ErrorCodes } from 'enums/ErrorCodes';
import { SnackbarContext } from 'providers/Snackbar.provider';

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

  const { t } = useTranslation(['register', 'common\\errors']);
  const isLoading = useAppSelector((state) => state.user.isLoading);
  const redirect = useRedirect();
  const dispatch = useDispatch<AppDispatch>();
  const { setSnack } = useContext(SnackbarContext);

  const onComplete = useCallback(async () => {
    const { birthday, firstName, lastName, companyName, ...address } = formState.steps.business.value;
    const data: IRegisterCompany =
    {
      ...formState.steps.account.value,
      birthday: format(birthday!, 'yyyy-MM-dd'),
      firstName,
      lastName,
      companyName,
      ...address
    }
    try {
      await dispatch(registerCompany(data)).unwrap()
      resetFormState()
      redirect()
    } catch (e) {
      const error = e as IStandardError;
      setSnack({ message: t(`common\\errors:${ErrorCodes[error.errorCode]}`), color: 'error', open: true })
    }
  }, [dispatch, redirect, resetFormState, t, setSnack, formState.steps.account.value, formState.steps.business.value]);

  const registerSteps: FormStepType[] = [
    { label: t('steps.account.label'), element: <Contact onNext={next} /> },
    { label: t('steps.business.label'), element: <Business onPrev={prev} onComplete={onComplete} isLoading={isLoading} /> }
  ];

  return (
    <>
      <div className='mx-auto max-w-lg'>
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