import React, { useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import Logo from "../../assets/images/logo.jpg";
import { connect } from "react-redux";

export default function Navigation() {
    const [toggle, setToggle] = useState(false);

    const handleOverlays = () => setToggle(!toggle);
    const handleToggleClick = () => setToggle(!toggle);
    return (
        <div>
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
                className={`${toggle
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
                        <Nav.Link as={NavLink} eventKey="5" to="/signin"
                            className = "mr-4">
                            Sign in
                        </Nav.Link>
                        <Nav.Link
                            as={NavLink}
                            eventKey="6"
                            className="btn btn-primary ml-4 px-4"
                            to="/register"
                        >
                            Register
                        </Nav.Link>
                    </Nav>
                </div>
            </div>
        </Navbar>
        </div>
    )
}
