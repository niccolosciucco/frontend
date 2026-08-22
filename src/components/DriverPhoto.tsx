import { useState } from "react";
import { Modal } from "react-bootstrap";

interface DriverPhotoProps {
  name: string;
  number: number;
  size?: number;
}

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // rimuove accenti, es. "Hülkenberg" -> "Hulkenberg"
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function DriverPhoto({ name, number, size = 56 }: DriverPhotoProps) {
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const src = `/drivers/${slugify(name)}.jpg`;

  if (failed) {
    return (
      <div
        className="pw-avatar"
        style={{ width: size, height: size, fontSize: size * 0.32 }}
      >
        {number}
      </div>
    );
  }

  return (
    <>
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        onClick={() => setExpanded(true)}
        role="button"
        tabIndex={0}
        aria-label={`Ingrandisci la foto di ${name}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded(true);
          }
        }}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "1px solid var(--pw-border)",
          flexShrink: 0,
          cursor: "pointer",
        }}
      />

      <Modal show={expanded} onHide={() => setExpanded(false)} centered>
        <Modal.Body className="p-0">
          <img
            src={src}
            alt={name}
            style={{ width: "100%", display: "block", borderRadius: "4px" }}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
