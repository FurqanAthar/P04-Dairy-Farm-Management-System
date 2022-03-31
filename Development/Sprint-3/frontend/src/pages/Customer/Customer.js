import axios from "axios";
import { connect } from "react-redux";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import { getCustomerData } from "../../services/apiServices";

function Customer(props) {
  const { id } = useParams();

  useEffect(() => {
    async function getData() {
      await getCustomerData(id, props.login.loginInfo.token);
    }
  }, []);

  return <div></div>;
}

const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state) => {
  return {
    login: state.login,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Customer);
