import { NavLink, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { useAuth } from "../../auth/AuthContext";

export function AppNavBar() {
  const { role, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="md" className="mb-4">
      <Container fluid>
        <Navbar.Brand>PitWall Pro</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link as={NavLink} to="/strategia">
              Strategia
            </Nav.Link>
            <Nav.Link as={NavLink} to="/storico">
              Storico
            </Nav.Link>
            <Nav.Link as={NavLink} to="/classifica">
              Classifica
            </Nav.Link>
            <Nav.Link as={NavLink} to="/circuiti">
              Circuiti
            </Nav.Link>
            {role === "ADMIN" && (
              <Nav.Link as={NavLink} to="/admin">
                Admin
              </Nav.Link>
            )}
          </Nav>
          <Nav className="align-items-center">
            <Navbar.Text className="me-3 text-light">{username}</Navbar.Text>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Esci
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
