import { IOptionalRegisterCompany } from "interfaces/auth.interface";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

interface IFormContext {
  readonly formState: IOptionalRegisterCompany;
  readonly setFormState: Dispatch<SetStateAction<IOptionalRegisterCompany>>;
}

export const FormStateContext = createContext<IFormContext>({
  formState: {} as IOptionalRegisterCompany,
  setFormState: () => null
});

export function FormProvider ({ children } : {children: ReactNode}) {
  const [formState, setFormState] = useState<IOptionalRegisterCompany>({} as IOptionalRegisterCompany);
  return (
    <FormStateContext.Provider value={{formState, setFormState}}>
      {children}
    </FormStateContext.Provider>
  );
}
 
export function useFormState(): {formState: IOptionalRegisterCompany, setFormState: Dispatch<SetStateAction<IOptionalRegisterCompany>>} {
  const context = useContext(FormStateContext);
  console.log(context)
  if (!context) {
    throw new Error("useFormState must be used within the AppProvider");
  }
  return {...context};
}