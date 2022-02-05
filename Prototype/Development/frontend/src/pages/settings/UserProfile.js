import React, { useState, useReducer, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import {
  Container,
  Col,
  Row,
  Modal,
  Button,
  Form,
  FormControl,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import SimpleReactValidator from "simple-react-validator";
import UserIcon from "../../assets/images/icons/user2.svg";
import EmailIcon from "../../assets/images/icons/email.svg";
import LockIcon from "../../assets/images/icons/lock.svg";
import AccountModalImage from "../../assets/images/accountsecuritymodal.jpg";
import chevLeft from "../../assets/images/icons/cheveron-left.svg";
import {
  userUpdateImage,
  userUpdateName,
  userUpdatePassword,
} from "../../actions/userAction";

function UserProfile(props) {
  const [, forceUpdate] = useState();
  const [show, setShow] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [step, setStep] = useState("change_name");
  const [uploading, setUploading] = useState(false);
  const [validator] = useState(new SimpleReactValidator());
  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      first_name: "",
      last_name: "",
      email: "",
      old_password: "",
      password: "",
      password_confirmation: "",
    }
  );

  const handleShow = async (evt, index) => {
    setStep(index);
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  const handleInput = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setFormInput({ [name]: newValue });
  };

  const handleSubmit = async () => {
    setDisabled(true);
    if (!validator.allValid()) {
      validator.showMessages();
      forceUpdate(1);
    } else {
      if (step == "change_name") {
        await props.userUpdateName(
          formInput.first_name + " " + formInput.last_name
        );
      } else if (step == "change_password") {
        if (formInput.password != formInput.password_confirmation) {
          toast.error("Passwords doesn't match");
        } else {
          let passwords = {
            oldPassword: formInput.old_password,
            password: formInput.password,
          };
          await props.userUpdatePassword(passwords);
          setShow(false);
        }
      }
    }
    setDisabled(false);
  };

  const handleUserImage = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post("/upload", formData, config);
      if (data) {
        await props.userUpdateImage(data);
      }
      setUploading(false);
    } catch (error) {
      toast.error("Image Upload Failed");
      setUploading(false);
    }
  };

  useEffect(() => {
    if (props.login && props.login.loginInfo.name) {
      let user = props.login.loginInfo;
      setFormInput({ ["first_name"]: user.name.split(" ")[0] });
      setFormInput({ ["last_name"]: user.name.split(" ")[1] });
      setFormInput({ ["email"]: "" });
      setFormInput({ ["old_password"]: "" });
      setFormInput({ ["password"]: "" });
      setFormInput({ ["password_confirmation"]: "" });
    }
  }, [props.login]);

  useEffect(() => {
    console.log(props.updateUserName);
    if (!props.updateUserName.loading) {
      if (Object.keys(props.updateUserName).length > 0) {
        if (props.updateUserName.success) {
          toast.success("Profile Updated");
        } else {
          toast.error("Error Occured");
        }
      }
    }
  }, [props.updateUserName]);

  useEffect(() => {
    console.log(props.updateUserPassword);
    if (!props.updateUserPassword.loading) {
      if (props.updateUserPassword.success) {
        toast.success("Profile Updated");
      } else {
        toast.error(props.updateUserPassword.message);
      }
    }
  }, [props.updateUserPassword]);

  useEffect(() => {
    if (!props.updateUserImage.loading) {
      if (props.updateUserImage.success) {
        toast.success("Profile Updated");
      } else {
        toast.error(props.updateUserImage.message);
      }
    }
  }, [props.updateUserImage]);

  return (
    <div className="account-security-page">
      <div className="grey-box">
        <Container>
          <Row className="justify-content-md-center">
            <Col lg={10}>
              <h2 className="title">
                <Link to="/farm/settings">
                  <img src={chevLeft} alt="icon" />
                </Link>
                Account and Security
              </h2>
            </Col>
          </Row>
        </Container>
      </div>
      {props.login.loginInfo && props.login.loginInfo.name ? (
        <div>
          <Container>
            <Row className="justify-content-md-center">
              <Col lg={10}>
                <div className="details">
                  <div class="personal-info">
                    <label htmlFor="profile_image">
                      {props.login.loginInfo.image ? (
                        <div className="user-pic">
                          <img src={props.login.loginInfo.image} alt="Image" />
                        </div>
                      ) : (
                        <>
                          <div class="name-spell">
                            {props.login.loginInfo.name
                              .split(" ")[0]
                              .charAt(0)
                              .toUpperCase() +
                              props.login.loginInfo.name
                                .split(" ")[1]
                                .charAt(0)
                                .toUpperCase()}
                          </div>
                        </>
                      )}
                    </label>
                    <input
                      type="file"
                      id="profile_image"
                      style={{ display: "none" }}
                      disabled={uploading}
                      onChange={handleUserImage}
                    />
                    <div class="text-details">
                      <strong>
                        {props.login.loginInfo.name.split(" ")[0]}{" "}
                        {props.login.loginInfo.name.split(" ")[1]}
                      </strong>
                      <p>{props.login.loginInfo.email}</p>
                    </div>
                  </div>
                  <div className="other-info">
                    <div className="list">
                      <div className="d-flex justify-content-between box">
                        <div className="d-flex align-items-center">
                          <div className="icon">
                            <img src={UserIcon} alt="Icon Image" />
                          </div>
                          <div className="label">Name</div>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="title">
                            {props.login.loginInfo.name.split(" ")[0]}{" "}
                            {props.login.loginInfo.name.split(" ")[1]}
                          </div>
                          <a onClick={(e) => handleShow(e, "change_name")}>
                            Change
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="list">
                      <div className="d-flex justify-content-between box">
                        <div className="d-flex align-items-center">
                          <div className="icon">
                            <img src={EmailIcon} alt="Icon Image" />
                          </div>
                          <div className="label">Email</div>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="title">
                            {props.login.loginInfo.email}
                          </div>
                          <a onClick={(e) => handleShow(e, "change_email")}>
                            Change
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="list">
                      <div className="d-flex justify-content-between box">
                        <div className="d-flex align-items-center">
                          <div className="icon lock-icon">
                            <img src={LockIcon} alt="Icon Image" />
                          </div>
                          <div className="label">Password</div>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="title">************</div>
                          <a onClick={(e) => handleShow(e, "change_password")}>
                            Change
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
          <Modal
            animation={false}
            className="account-settings-modal"
            size="sm"
            centered
            show={show}
            onHide={handleClose}
          >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              {step == "change_name" ? (
                <div className="details">
                  <div className="icon">
                    <img src={AccountModalImage} alt="Big Image" />
                  </div>

                  <div className="title">Change Name</div>
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <FormControl
                      id="first_name"
                      name="first_name"
                      value={formInput.first_name}
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
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <FormControl
                      id="last_name"
                      name="last_name"
                      value={formInput.last_name}
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
                </div>
              ) : (
                <>
                  {step == "change_password" ? (
                    <div className="details">
                      <div className="icon">
                        <img src={AccountModalImage} alt="Big Image" />
                      </div>
                      <div className="title">Change password</div>
                      <Form.Group>
                        <Form.Label>Current Password</Form.Label>
                        <FormControl
                          type="password"
                          id="old_password"
                          name="old_password"
                          value={formInput.old_password}
                          onChange={handleInput}
                        />
                        {validator.message(
                          "old_password",
                          formInput.old_password,
                          "required",
                          {
                            className: "text-danger",
                          }
                        )}
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>New Password</Form.Label>
                        <FormControl
                          type="password"
                          id="password"
                          name="password"
                          value={formInput.password}
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
                      <Form.Group>
                        <Form.Label>Confirm new password</Form.Label>
                        <FormControl
                          type="password"
                          id="password_confirmation"
                          name="password_confirmation"
                          value={formInput.password_confirmation}
                          onChange={handleInput}
                        />
                        {validator.message(
                          "password_confirmation",
                          formInput.password_confirmation,
                          "required",
                          {
                            className: "text-danger",
                          }
                        )}
                      </Form.Group>
                    </div>
                  ) : null}
                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-light" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={disabled}
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      ) : null}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    userUpdateName: (data) => dispatch(userUpdateName(data)),
    userUpdatePassword: (data) => dispatch(userUpdatePassword(data)),
    userUpdateImage: (data) => dispatch(userUpdateImage(data)),
  };
};
const mapStateToProps = (state) => {
  return {
    login: state.login,
    updateUserName: state.updateUserName,
    updateUserPassword: state.updateUserPassword,
    updateUserImage: state.updateUserImage,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
