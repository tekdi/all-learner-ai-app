import React, { useEffect, Fragment } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import CustomizedSnackbars from "../../views/Snackbar/CustomSnackbar";
import { getParameter } from "../../utils/constants";
import PropTypes from "prop-types";

const PrivateRoute = (props) => {
  let virtualId;

  if (getParameter("virtualId", window.location.search)) {
    virtualId = getParameter("virtualId", window.location.search);
  } else {
    virtualId = localStorage.getItem("virtualId");
  }

  const navigate = useNavigate();
  useEffect(() => {
    if (!virtualId && props.requiresAuth) {
      navigate("/login");
    }
  }, [virtualId]);

  return <>{props.children}</>;
};
const AppContent = ({ routes }) => {
  return (
    <Fragment>
      <CustomizedSnackbars />
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.id}
            path={route.path}
            element={
              <PrivateRoute requiresAuth={route.requiresAuth}>
                <route.component />
              </PrivateRoute>
            }
          />
        ))}
      </Routes>
    </Fragment>
  );
};
PrivateRoute.propTypes = {
  requiresAuth: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired,
};
AppContent.propTypes = {
  routes: PropTypes.object.isRequired,
};

export default AppContent;
