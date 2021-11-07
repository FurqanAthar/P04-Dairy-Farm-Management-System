import React from 'react'
import {
  Row,
  Col,
  Container,
  Card,
  Button,
  Modal,
  Form,
  FormControl,
} from "react-bootstrap";
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import Select from "react-select";
import BadgeIcon from "../../assets/images/icons/badge.svg";

function FarmSettings(props) {
    return (
      <div className="settings-page">
        <Container>
          <Row className="justify-content-md-center">
            <Col lg={10}>
              <h2 className="title">Settings</h2>
              <Row>
                <Col lg={6}>
                  {props.login.loginInfo && props.login.loginInfo.name ? (
                    <Link to="/farm/settings/user-profile">
                      <Card className="mb-4">
                        {props.login.loginInfo.image ? (
                          <div className="user-pic">
                            <img
                              src={props.login.loginInfo.image}
                              alt="Image"
                            />
                          </div>
                        ) : (
                          <div className="name-char">
                            {props.login.loginInfo.name
                              .split(" ")[0]
                              .charAt(0)
                              .toUpperCase() +
                              props.login.loginInfo.name
                                .split(" ")[1]
                                .charAt(0)
                                .toUpperCase()}
                          </div>
                        )}
                        <Card.Body>
                          <Card.Title>
                            Account <br /> and Security
                          </Card.Title>
                          <Card.Text>
                            <strong>
                              {props.login.loginInfo.name.split(" ")[0]}{" "}
                              {props.login.loginInfo.name.split(" ")[1]}
                            </strong>
                            <p className="m-0">{props.login.loginInfo.email}</p>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Link>
                  ) : null}
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
}

const mapDispatchToProps = (dispatch) => {
  return {
  };
};
const mapStateToProps = (state) => {
  return {
    login: state.login,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FarmSettings);
