import React from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Route, Redirect } from "react-router-dom";
import { loginFirst } from '../constants/otherConstants'
// import { isOwner, isAdmin } from "../core/UserRoleCheck";

function PrivateRoute({ children, login, ...rest }) {
  return (
    <Route
      {...rest}
      render={() => {
        if (Object.keys(login).length > 0) {
          return children;
        } else {
          // console.log("window.location.pathname", window.location.pathname);
          toast.error(loginFirst);
          return <Redirect to="/login" />;
        }
      }}
    ></Route>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state) => {
  return {
    login: state.login,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
