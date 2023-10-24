import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Logo from "../assets/Logo.svg";

function NavBar() {
  return (
    <>
      <Navbar className="bg-body-tertiary justify-content-center">
        <Container>
          <Navbar.Brand className="d-flex align-items-center">
            <span className="titulo-navbar mr-2">METRO </span>
            <img
              alt=""
              src={Logo}
              width="50"
              height="40"
              className="d-inline-block align-top"
            />
            <span className="titulo-navbar ml-2"> MEDIAN</span>
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
