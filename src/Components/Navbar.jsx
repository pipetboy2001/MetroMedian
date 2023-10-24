import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Logo from "../assets/Logo.svg";
import Mapa from "../assets/mapa-metro-santiago.jpg";

function NavBar() {
  const [showMapModal, setShowMapModal] = useState(false);

  const handleClose = () => setShowMapModal(false);
  const handleShow = () => setShowMapModal(true);

  return (
    <>
      <Navbar className="bg-body-tertiary justify-content-center">
        <Container className="d-flex align-items-center justify-content-center text-center">
          <Navbar.Brand className="">
            <span className="titulo-navbar">METRO</span>
            <img
              title="Ver mapa del metro"
              alt="Metro-Median"
              src={Logo}
              width="50"
              height="40"
              className="d-inline-block align-top mx-2"
              onClick={handleShow}
              style={{ cursor: "pointer" }}
            />
            <span className="titulo-navbar">MEDIAN</span>
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Modal
        show={showMapModal}
        onHide={handleClose}
        centered // Esta línea centra el modal en la pantalla
      >
        <Modal.Header closeButton>
          <Modal.Title>Mapa del Metro</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={Mapa}
            alt="Mapa del Metro Santiago"
            style={{ width: "100%" }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NavBar;
