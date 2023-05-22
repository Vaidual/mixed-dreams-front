import useErrorsTranslation from "hooks/useErrorsTranslation";
import ValidationError from "types/ValidationError";

export interface ErrorMessageProps {
  error: ValidationError | string | undefined;
  field?: string;
}

export const ErrorMessage = ({ error, field }: ErrorMessageProps) => {
  const getTranslate = useErrorsTranslation();

  if (error === undefined) {
      return <></>;
  } else if (typeof error === 'string') {
      return <span className="error-text">{getTranslate(error)}</span>;
  } else {
      return <span className="error-text">{getTranslate(error.key, {...error.values, field })}</span>;
  }
};