
import { ReactNode, createContext, useContext, useState } from "react";
import { boolean, number, string } from "yup";

type FormStateType = {
  selectedIndex: number,
  steps: {
    account: {
      hadError: boolean,
      valid: boolean,
      dirty: boolean,
      value: {
        email: string,
        password: string,
        confirmPassword: string,
      },
    },
    business: {
      hadError: boolean,
      valid: boolean,
      dirty: boolean,
      value: {
        birthday: Date | null,
        companyName: string,
        firstName: string,
        lastName: string,
        address: {
          city: string,
          street: string,
          zipCode: string,
          country: string,
          state: string,
          apartment: string | null,
        }
      },
    },
  },
};

const FORM_STATE: FormStateType = {
  selectedIndex: 0,
  steps: {
    account: {
      hadError: false,
      valid: false,
      dirty: false,
      value: {
        email: '',
        password: '',
        confirmPassword: '',
      },
    },
    business: {
      hadError: false,
      valid: false,
      dirty: false,
      value: {
        birthday: null,
        companyName: '',
        firstName: '',
        lastName: '',
        address: {
          city: '',
          street: '',
          zipCode: '',
          country: '',
          state: '',
          apartment: null,
        }
      },
    },
  },
};

const FormStateContext = createContext({
  formState: FORM_STATE,
  setFormState: (form: FormStateType | ((form: FormStateType) => FormStateType)) => {},
});

export function FormProvider ({ children } : {children: ReactNode}) {
  const [formState, setFormState] = useState<FormStateType>(FORM_STATE);

  return (
    <FormStateContext.Provider value={{formState, setFormState}}>
      {children}
    </FormStateContext.Provider>
  );
}
 
export function useFormState(): {formState: FormStateType, setFormState: (form: FormStateType | ((form: FormStateType) => FormStateType)) => void} {
  const context = useContext(FormStateContext);
  if (!context) {
    throw new Error("useFormState must be used within the AppProvider");
  }
  return {...context};
}