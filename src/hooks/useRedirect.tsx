import { useLocation, useNavigate } from "react-router-dom";

export const useRedirect = (): () => void => {
  const location = useLocation();
  const navigate = useNavigate();
  return () => {
    if (location.state?.from && (location.state.from as string).search(process.env.REACT_APP_CLIENT_URL!)) {
      navigate(location.state.from)
    }
    else {
      navigate('/')
    }
  }
}