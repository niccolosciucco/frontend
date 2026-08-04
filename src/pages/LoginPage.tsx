import { useState, type FormEvent } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { axiosClient } from "../api/axiosClient";
import { createMockToken } from "../auth/mockAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await axiosClient.post("/auth/login", {
        email,
        password,
      });
      login(data.token);
      navigate("/dashboard");
    } catch {
      setError("Credenziali non valide");
    } finally {
      setLoading(false);
    }
  };

  const handleMockLogin = (role: "ADMIN" | "USER") => {
    const token = createMockToken(
      role === "ADMIN" ? "admin.demo" : "viewer.demo",
      role,
    );
    login(token);
    navigate("/dashboard");
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: 380 }} className="p-2">
        <Card.Body>
          <Card.Title className="mb-3 text-center">PitWall Pro</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" className="w-100" disabled={loading}>
              {loading ? "Accesso in corso…" : "Accedi"}
            </Button>
          </Form>
          <hr className="my-3" />
          <p className="text-center text-muted small mb-2">
            Modalità sviluppo, nessun backend richiesto
          </p>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              className="w-100"
              onClick={() => handleMockLogin("USER")}
            >
              Entra come viewer
            </Button>
            <Button
              variant="outline-danger"
              className="w-100"
              onClick={() => handleMockLogin("ADMIN")}
            >
              Entra come admin
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
