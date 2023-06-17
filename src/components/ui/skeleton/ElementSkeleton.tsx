import {FC, ReactNode} from 'react'
import {Skeleton} from "@mui/material";

type Props = {
    children: ReactNode,
    isLoading: boolean
};
const ElementSkeleton: FC<Props> = ({children,isLoading}) => {
    return isLoading ? (
        <Skeleton>
            {children}
        </Skeleton>
    ) : (
        <>
            {children}
        </>
    )
}

export default ElementSkeleton