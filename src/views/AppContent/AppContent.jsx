import React, { Fragment, Suspense } from "react";
import { Routes, Route, } from "react-router-dom";
import CustomizedSnackbars from "../../views/Snackbar/CustomSnackbar";
// import { useSelector } from "react-redux";

// const PrivateRoute = (props) => {
//   const { virtualId } = useSelector((state) => state.user);
//   const navigate = useNavigate();
//   useEffect(() => {
//     if (!virtualId && props.requiresAuth) {
//       // navigate("/");
//     }
//   }, [virtualId]);

//   return <>{props.children}</>;
// };
const AppContent = ({ routes }) => {
  // const navigate = useNavigate();
  // const location = useLocation();

  return (
    <Fragment>
      <CustomizedSnackbars />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={
                // <PrivateRoute requiresAuth={route.requiresAuth}>
                <route.component />
                // </PrivateRoute>
              }
            />
          ))}
        </Routes>
      </Suspense>
    </Fragment>
  );
};

export default AppContent;
