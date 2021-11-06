import React, { useState, useEffect, useReducer } from "react";
import {
    Form,
    Button,
    Container,
    Row,
    Col,
    Card,
    FormControl,
    Alert,
} from "react-bootstrap";
import { useHistory } from "react-router";
import Logo from '../assets/images/logo.jpg'
import LoginSlider from '../components/layouts/Slider'
// import Select from "react-select";
// import { useHistory } from "react-router-dom";
// import { getCitiesAttempt, getStatesAttempt } from "./data/globalAction";
// import SimpleReactValidator from "simple-react-validator";
// import * as Constants from "../core/Constants";
// import { connect } from "react-redux";
// import { companyAttempt, signUpError } from "./data/authAction";
// import { signInAttemptByUUID } from "./data/loginAction";
import { toast } from "react-toastify";

export default function BusinessRegistration(props) {
    const history = useHistory()
    
    return (
      // <div>
      // <div className="registration">
      <Container>
        <Row>
          <Col lg={6}>
            <div className="login-holder">
              <form
                    // onSubmit={handleCompanySubmit}
                    noValidate
                    className="form h-100"
                  >
                    <div className="login-holder">
                      <div className="logo">
                        <img
                          src={Logo}
                          alt="Qazi Dairies Logo"
                          onClick={() => {
                            history.push("/");
                          }}
                        />
                      </div>
                      <h2 className="title">Give us your business domain</h2>
                      <p className="mb-4">
                        Make it something clear. <br /> For example, the name of
                        your team or company
                      </p>
                      {/* {props.error ? <div>{ErrorlistItems}</div> : null} */}
                      <Form.Group>
                        <Form.Label>Business Domain</Form.Label>
                        <div className="form-holder">
                          <FormControl
                            required
                            id="business_domain"
                            name="business_domain"
                            // value={formInput.business_domain}
                            // onChange={handleInput}
                          />
                          <small>
                            {/* .{" "}
                            {process.env.APP_URL.replace(
                              /(^\w+:|^)\/\//,
                              ""
                            )} */}
                          </small>
                        </div>
                        {/* {validator.message(
                          "business_domain",
                          formInput.business_domain,
                          "required|alpha_num_dash",
                          {
                            className: "text-danger",
                          }
                        )} */}
                      </Form.Group>
                      <Button
                        type="submit"
                        block
                        variant="primary"
                        // disabled={disabled}
                      >
                        Continue
                      </Button>
                    </div>
                  </form>
                </div>
          </Col>
          <Col lg={6}>
            <LoginSlider />
          </Col>
        </Row>
      </Container>
      // </div>
      // </div>
    );
}