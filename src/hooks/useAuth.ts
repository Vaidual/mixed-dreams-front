import { useAppSelector } from "./userAppSelector";

const useAuth = () => useAppSelector(state => state.user)