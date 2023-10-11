import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
//import "./../Styles/Navbar.css"

function NavBar() {
  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>
            <img
              alt=""
              src="./../../public/vite.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
             <span className="titulo-navbar">Metro Median</span>
          </Navbar.Brand>
          
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;