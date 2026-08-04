import { NavLink, Outlet } from "react-router-dom";
import { Nav } from "react-bootstrap";

export function AdminLayout() {
  return (
    <div>
      <Nav variant="pills" className="mb-3">
        <Nav.Item>
          <Nav.Link as={NavLink} to="piloti">
            Piloti
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="team">
            Team
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="circuiti">
            Circuiti
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={NavLink} to="eventi">
            Eventi
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Outlet />
    </div>
  );
}
