import {FC, ReactNode} from "react";
import { Outlet } from "react-router-dom";


type Props = {
    children: ReactNode
}
const AppLayout: FC<Props> = ({ children }) => {
    return (
        <>
            {children ?? <Outlet />}
        </>
    )
}

export default AppLayout;