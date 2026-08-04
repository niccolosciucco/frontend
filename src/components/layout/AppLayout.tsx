import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AppNavBar } from "./AppNavBar";

export function AppLayout() {
  return (
    <>
      <AppNavBar />
      <Container fluid className="px-4 pb-4">
        <Outlet />
      </Container>
    </>
  );
}
