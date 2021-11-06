import React, { useState, useEffect, useReducer } from "react";
import axios from 'axios'
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
import Select from "react-select";
import { useHistory } from "react-router";
import Logo from '../assets/images/logo.jpg'
import LoginSlider from '../components/layouts/Slider'
import SimpleReactValidator from "simple-react-validator";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

export default function BusinessRegistration(props) {
    const history = useHistory()
    const [, forceUpdate] = useState();
    const [step, setStep] = useState("subdomain");
    const [disabled, setDisabled] = useState(false);
    const [validator] = useState(new SimpleReactValidator());
    const [formInput, setFormInput] = useReducer(
      (state, newState) => ({ ...state, ...newState }),
      {
        farmName: "",
        subdomain: "",
        first_name: "",
        second_name: "",
        company_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        cnic: ""
      }
    );

    const handleInput = (evt) => {
      const name = evt.target.name;
      const newValue = evt.target.value;
      setFormInput({ [name]: newValue });
    };

    const handleCompanySubmit = async (e) => {
        setDisabled(true)
        e.preventDefault()
        if (!validator.allValid()) {
            validator.showMessages();
            forceUpdate(1);
        } else {
            let result = await axios.post('/farm/validate/subdomain', {'subdomain': formInput.subdomain})
            if (result.data && result.data.success) {
                setStep("details")
            } else {
                toast.error(result.data.message)
            }
        }
        setDisabled(false)
    }

    const handleRegistration = async (e) => {
        e.preventDefault()
        setDisabled(true);
        if (!validator.allValid()) {
            validator.showMessages()
            forceUpdate(1)
        } else {
            if (formInput.password !== formInput.password_confirmation) {
                toast.error("Passwords doesn't match")
            } else {
                let data = {
                    name: formInput.first_name + ' ' + formInput.second_name,
                    email: formInput.email,
                    subdomain: formInput.subdomain,
                    farmName: formInput.farmName,
                    password: formInput.password,
                    cnic: formInput.cnic
                }
                let result = await axios.post('/farm/register', {...data})
                if (result.status != 200 || !result.data.success) {
                  toast.error("Email Address Already Exists");
                } else {
                  toast.success("Dairy Account Registered");
                  history.push("/login");
                }
            }
        }
        setDisabled(false)
    }
    
    return (
      <>
        {step == "subdomain" ? (
          <div className="domain-selection">
            <Container>
              <Row>
                <Col lg={6}>
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
                      <Form.Group>
                        <Form.Label>Business Domain</Form.Label>
                        <div className="form-holder">
                          <FormControl
                            required
                            id="subdomain"
                            name="subdomain"
                            value={formInput.subdomain}
                            onChange={handleInput}
                          />
                          <small>. {"localhost:3000/"}</small>
                        </div>
                        {validator.message(
                          "subdomain",
                          formInput.subdomain,
                          "required|alpha_num_dash",
                          {
                            className: "text-danger",
                          }
                        )}
                      </Form.Group>
                      <Button
                        type="submit"
                        block
                        variant="primary"
                        disabled={disabled}
                        onClick={handleCompanySubmit}
                      >
                        Continue
                      </Button>
                    </div>
                  </form>
                </Col>
                <Col lg={6}>
                  <LoginSlider />
                </Col>
              </Row>
            </Container>
          </div>
        ) : (
          <div className="domain-selection">
            <Container>
              <Row>
                <Col lg={6}>
                  <form
                    onSubmit={handleRegistration}
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
                      {/* {props.error ? <div>{ErrorlistItems}</div> : null} */}
                      <h2 className="title">Tell us about yourself?</h2>
                      <Row>
                        <Col lg={12}>
                          <Form.Group>
                            <Form.Label>Business Name</Form.Label>
                            <FormControl
                              name="farmName"
                              value={formInput.farmName}
                              required
                              id="farmName"
                              placeholder="XYZ Dairies"
                              label="Business Name"
                              autoComplete="farmName"
                              onChange={handleInput}
                            />
                            {validator.message(
                              "farmName",
                              formInput.farmName,
                              "required",
                              {
                                className: "text-danger",
                              }
                            )}
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group>
                            <Form.Label>First Name</Form.Label>
                            <FormControl
                              name="first_name"
                              value={formInput.first_name}
                              required
                              id="first_name"
                              placeholder="Ali"
                              label="First Name"
                              autoComplete="first_name"
                              onChange={handleInput}
                            />
                            {validator.message(
                              "first_name",
                              formInput.first_name,
                              "required",
                              {
                                className: "text-danger",
                              }
                            )}
                          </Form.Group>
                        </Col>
                        <Col lg={6}>
                          <Form.Group>
                            <Form.Label>Last Name</Form.Label>
                            <FormControl
                              required
                              id="last_name"
                              label="Last Name"
                              name="last_name"
                              placeholder="Gujjer"
                              value={formInput.last_name}
                              autoComplete="last_name"
                              onChange={handleInput}
                            />
                            {validator.message(
                              "last_name",
                              formInput.last_name,
                              "required",
                              {
                                className: "text-danger",
                              }
                            )}
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          <Form.Group>
                            <Form.Label>CNIC</Form.Label>
                            <FormControl
                              required
                              id="cnic"
                              label="CNIC"
                              name="cnic"
                              placeholder="3XXXX XXXXXXX X"
                              value={formInput.cnic}
                              autoComplete="cnic"
                              onChange={handleInput}
                            />
                            {validator.message(
                              "cnic",
                              formInput.cnic,
                              "required",
                              {
                                className: "text-danger",
                              }
                            )}
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          <Form.Group>
                            <Form.Label>Email Address</Form.Label>
                            <FormControl
                              required
                              id="email"
                              label="Email Address"
                              name="email"
                              placeholder="gujjerali@gmail.com"
                              value={formInput.email}
                              autoComplete="email"
                              onChange={handleInput}
                            />
                            {validator.message(
                              "email",
                              formInput.email,
                              "required|email",
                              {
                                className: "text-danger",
                              }
                            )}
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          <Form.Group>
                            <Form.Label>Create Password</Form.Label>
                            <FormControl
                              required
                              value={formInput.password}
                              name="password"
                              label="Password"
                              type="password"
                              placeholder="Min. 8 Character"
                              id="password"
                              autoComplete="password"
                              onChange={handleInput}
                            />
                            {validator.message(
                              "password",
                              formInput.password,
                              "required",
                              {
                                className: "text-danger",
                              }
                            )}
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          <Form.Group>
                            <Form.Label>Confirm Password</Form.Label>
                            <FormControl
                              required
                              value={formInput.password_confirmation}
                              name="password_confirmation"
                              label="Confirm Password"
                              type="password"
                              placeholder="Min. 8 Character"
                              id="password_confirmation"
                              autoComplete="password_confirmation"
                              onChange={handleInput}
                            />
                            {validator.message(
                              "password_confirmation",
                              formInput.password_confirmation,
                              "required",
                              { className: "text-danger" }
                            )}
                          </Form.Group>
                        </Col>
                        <Col lg={12}>
                          <Button
                            type="submit"
                            block
                            variant="primary"
                            className="mt-3"
                            disabled={disabled}
                          >
                            Continue
                          </Button>
                        </Col>
                      </Row>
                      <div className="login-option">
                        Already have an account?{" "}
                        <NavLink to="/signin">Log In</NavLink>
                      </div>
                    </div>
                  </form>
                </Col>
                <Col lg={6}>
                  <LoginSlider />
                </Col>
              </Row>
            </Container>
          </div>
        )}
      </>
    );
}