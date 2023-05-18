import { IOptionalRegisterCompany } from "@/interfaces/IRegisterCompany";
import { Context, Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState } from "react";

interface IFormContext {
  readonly formState: IOptionalRegisterCompany | null;
  readonly setFormState: Dispatch<SetStateAction<IOptionalRegisterCompany | null>>;
}

export const FormStateContext = createContext<IFormContext>({
  formState: null,
  setFormState: () => null
});

export function FormProvider ({ children } : {children: ReactNode}) {
  const [formState, setFormState] = useState<IOptionalRegisterCompany | null>(null);
  return (
    <FormStateContext.Provider value={{formState, setFormState}}>
      {children}
    </FormStateContext.Provider>
  );
}
 
export function useFormState(): {formState: IOptionalRegisterCompany | null, setFormState: Dispatch<SetStateAction<IOptionalRegisterCompany | null>>} {
  const context = useContext(FormStateContext);
  if (!context) {
    throw new Error("useFormState must be used within the AppProvider");
  }
  return {...context};
}