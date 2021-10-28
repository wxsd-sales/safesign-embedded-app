const React = require("react");
const { Navbar, Nav, Container} = require("react-bootstrap");

const MyNav = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
      <Navbar.Brand>
      🔏SafeSign
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" >
          <Nav.Link href='/'>
            Home
          </Nav.Link>
          {/* <Nav.Link href='/admin'>
            Admin
          </Nav.Link> */}
        </Nav>
        
        <Navbar.Collapse className="justify-content-end">
          <Nav.Link href='' style={{color: "#717172"}}>
            Webex Solutions Development Team
          </Nav.Link>
        </Navbar.Collapse>
        
      </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default MyNav;