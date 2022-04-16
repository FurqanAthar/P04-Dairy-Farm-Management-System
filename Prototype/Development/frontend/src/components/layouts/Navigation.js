import React, { useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import Logo from "../../assets/images/logo.jpg";
import { connect } from "react-redux";
import { logout } from "../../actions/userAction";
import PlusIcon from "../../assets/images/icons/plusicon.svg";
import InboxIcon from "../../assets/images/icons/inbox.svg";

function Navigation(props) {
  const [toggle, setToggle] = useState(false);
  const [userData, setUserData] = useState({});

  const handleOverlays = () => setToggle(!toggle);
  const handleToggleClick = () => setToggle(!toggle);

  const handleLogout = (e) => {
    e.preventDefault();
    props.logout();
  };

  useEffect(() => {
    if (
      props.login &&
      props.login.loginInfo &&
      Object.keys(props.login.loginInfo).length > 0
    ) {
      setUserData(props.login.loginInfo);
    }
  }, [props.login]);

  return (
    <div>
      {Object.keys(userData).length > 0 ? (
        <Navbar collapseOnSelect id="header-dashboard" expand="lg">
          <div className="logo">
            <Nav.Link as={NavLink} eventKey="1" to="/" className="p-0">
              <img src={Logo} />
            </Nav.Link>
          </div>
          <Navbar.Toggle
            onClick={handleToggleClick}
            aria-controls="basic-navbar-nav"
          />
          <div
            id="basic-navbar-nav"
            className={`${
              toggle
                ? "navbar-collapse collapse show"
                : "navbar-collapse collapse"
            }`}
          >
            <div className="d-flex justify-content-between align-items-center w-100">
              <Nav>
                <Nav.Link as={NavLink} eventKey="2" to="/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={NavLink} eventKey="3" to="/animals">
                  Animals
                </Nav.Link>

                <Nav.Link as={NavLink} eventKey="8" to="/customer">
                  Customers
                </Nav.Link>

                <Nav.Link as={NavLink} eventKey="9" to="/inventory">
                  Inventory
                </Nav.Link>

                <Nav.Link as={NavLink} eventKey="4" to="/milk-records">
                  Milk Records
                </Nav.Link>

                <Nav.Link as={NavLink} eventKey="4" to="/milk-supply">
                  Milk Supply
                </Nav.Link>

                <Nav.Link as={NavLink} eventKey="7" to="/expense">
                  Expenses
                </Nav.Link>

                {/* <Nav.Link
                  as={NavLink}
                  className="btn-primary"
                  eventKey="7"
                  to="/customer/add"
                >
                  <div className="icon">
                    <img src={PlusIcon} alt="Icon Image" />
                  </div>{" "}
                  Add Customers
                </Nav.Link> */}

                <Nav.Link
                  as={NavLink}
                  className="btn-primary"
                  eventKey="5"
                  to="/animals/add"
                >
                  <div className="icon">
                    <img src={PlusIcon} alt="Icon Image" />
                  </div>{" "}
                  Add Animal
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  className="mob-nav"
                  eventKey="6"
                  to="/farm/settings"
                >
                  Settings
                </Nav.Link>
                <NavDropdown.Divider />
                <Nav.Link onClick={handleLogout} className="mob-nav">
                  Logout
                </Nav.Link>
              </Nav>
              <Nav className="d-flex align-items-center drop-right">
                {/* <Nav.Link
                        className="with-icon inbox"
                        as={NavLink}
                        eventKey="7"
                        to="/dashboard"
                        >
                            Contact Us
                        </Nav.Link>
                    </Nav>
                    <Nav className="d-flex align-items-center">
                        <Nav.Link as={NavLink} eventKey="5" to="/login"
                            className = "mr-4">
                            Log in
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            eventKey="6"
                            className="btn btn-primary ml-4 px-4"
                            to="/register"
                        >
                            Register
                        </Nav.Link>
                        <Nav.Link as={NavLink} eventKey="7" to="/AddAnimal"
                            className = "mr-4">
                            Add Animal
                        </Nav.Link>
                    </Nav>
                </div>
                        <div className="icon">
                            <img
                            src={InboxIcon}
                            alt="Icon Image"
                            onClick={handleNotifications}
                            />
                        </div>
                        <span className="msg-count">4</span>
                        <div className="inbox-text">Inbox</div>
                        </Nav.Link> */}
                {/* <NavDropdown
                    as="a"
                    eventKey="7"
                    className="dropdownAfter"
                    // onClick={handleNotifications}
                    title={
                      <a className="with-icon inbox">
                        <div className="icon">
                          <img src={InboxIcon} alt="Icon Image" />
                          <span className="msg-count">0</span>
                          <span className="msg-count">{notificationsCount}</span>
                          <div className="inbox-text">Inbox</div>
                        </div>
                      </a>
                    }
                  >
                    {formattedNotif}
                            {formattedNotif.length <= 1 ? (
                    <NavDropdown.Item>No notifications</NavDropdown.Item>
                    ) : null}
                  </NavDropdown> */}
                <div className="d-flex align-items-center">
                  <NavDropdown
                    className="nav-option"
                    title={
                      <div className="d-flex align-items-center">
                        {userData && userData.image ? (
                          <div className="user-pic">
                            <img src={userData.image} alt="Image" />
                          </div>
                        ) : (
                          <div className="name-char">
                            {userData.name
                              .split(" ")[0]
                              .charAt(0)
                              .toUpperCase() +
                              userData.name
                                .split(" ")[1]
                                .charAt(0)
                                .toUpperCase()}
                          </div>
                        )}
                        <div className="d-flex flex-column">
                          {userData.name.split(" ")[0] +
                            " " +
                            userData.name.split(" ")[1]}
                          {userData.role ? (
                            <small>{userData.role}</small>
                          ) : null}
                        </div>
                      </div>
                    }
                  >
                    <NavDropdown.Item
                      as={NavLink}
                      eventKey="8"
                      to="/farm/settings"
                    >
                      Settings
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </div>
              </Nav>
            </div>
          </div>
        </Navbar>
      ) : (
        <Navbar collapseOnSelect id="header" expand="lg">
          <div className="logo">
            <Nav.Link as={NavLink} eventKey="1" to="/">
              <img src={Logo} />
            </Nav.Link>
          </div>
          <Navbar.Toggle
            onClick={handleToggleClick}
            aria-controls="basic-navbar-nav"
          />
          <div
            id="basic-navbar-nav"
            className={`${
              toggle
                ? "navbar-collapse collapse show"
                : "navbar-collapse collapse"
            }`}
          >
            <div className="d-flex justify-content-between align-items-center w-100">
              <Nav>
                <Nav.Link as={NavLink} eventKey="2" to="/platform">
                  Platform
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  eventKey="3"
                  to="/pricing"
                  className="ml-4"
                >
                  Pricing
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  eventKey="4"
                  to="/contact"
                  className="ml-4"
                >
                  Contact Us
                </Nav.Link>
              </Nav>
              <Nav className="d-flex align-items-center">
                <>
                  <Nav.Link
                    as={NavLink}
                    eventKey="5"
                    to="/login"
                    className="mr-4"
                  >
                    Log in
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    eventKey="6"
                    className="btn btn-primary ml-4 px-4"
                    to="/register"
                  >
                    Register
                  </Nav.Link>
                </>
              </Nav>
            </div>
          </div>
        </Navbar>
      )}
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (data) => dispatch(logout(data)),
  };
};
const mapStateToProps = (state) => {
  return {
    login: state.login,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
