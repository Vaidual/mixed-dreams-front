import { useLocation, useNavigate } from "react-router-dom";

export const useRedirect = (): () => void => {
  const location = useLocation();
  const navigate = useNavigate();
  return () => {
    if (location.state?.from) {
      navigate(location.state.from)
    }
    else {
      navigate('/')
    }
  }
}