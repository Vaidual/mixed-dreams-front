import { useAppSelector } from "./userAppSelector";

export const useAuth = () => useAppSelector(state => state.user.user)