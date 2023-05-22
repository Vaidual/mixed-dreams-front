import { useLocation } from "react-router-dom";

// export const RequireRoles = ({ allowedRoles}) => {
//   const location = useLocation()
//   const {roles} = useAuth();

//   return (
//       roles.some(role => allowedRoles.includes(role))
//           ? <Outlet/>
//           : <Navigate to="/" state={{from: location}} replace/>
//   )
// }

// export const RequireAuth = () => {
//   const location = useLocation()
//   const {userId} = useAuth();

//   if (userId == null) {
//       return <Outlet/>;
//   } else {
//       return (
//           <Navigate to="/" state={{from: location}} replace/>
//       );
//   }

// }