import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "hooks/useAuth";
import { FC, ReactElement, ReactNode } from "react";
import { JsxElement } from "typescript";

type RequireRolesProps = {
  allowedRoles: string[],
  children: JSX.Element,
}

export const RequireRoles = ({ children, allowedRoles }: RequireRolesProps): JSX.Element => {
  const location = useLocation()
  const user = useAuth();

  return (!!user && user.roles.some(role => allowedRoles.includes(role)))
    ? children
    : (<Navigate to="/login" state={{ from: location }} replace />)
}

export const RequireAuth: FC<{children: JSX.Element}> = ({children} ) => {
  const location = useLocation()
  const user = useAuth();

  return (!!user)
    ? children
    : (<Navigate to="/login" state={{ from: location }} replace />)
}