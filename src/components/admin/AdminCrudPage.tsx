import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";

export interface AdminColumn<T> {
  key: string;
  label: string;
  width?: string;
  render: (item: T) => ReactNode;
}

export interface AdminFormFieldOption {
  value: string;
  label: string;
}

export interface AdminFormField<T> {
  name: keyof T;
  label: string;
  type: "text" | "number" | "select" | "date";
  options?: AdminFormFieldOption[];
  required?: boolean;
}

interface AdminCrudPageProps<T extends { id: string }> {
  title: string;
  newItemLabel: string;
  searchPlaceholder: string;
  columns: AdminColumn<T>[];
  fields: AdminFormField<T>[];
  items: T[];
  isLoading?: boolean;
  onCreate: (item: T) => Promise<void>;
  onUpdate: (item: T) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  emptyItem: () => T;
  searchPredicate: (item: T, query: string) => boolean;
  itemLabel: (item: T) => string;
}

export function AdminCrudPage<T extends { id: string }>({
  title,
  newItemLabel,
  searchPlaceholder,
  columns,
  fields,
  items,
  isLoading = false,
  onCreate,
  onUpdate,
  onDelete,
  emptyItem,
  searchPredicate,
  itemLabel,
}: AdminCrudPageProps<T>) {
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [formValues, setFormValues] = useState<T | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingItem, setDeletingItem] = useState<T | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filteredItems = useMemo(
    () =>
      items
        .filter((item) => searchPredicate(item, query.trim().toLowerCase()))
        .sort((a, b) =>
          itemLabel(a).localeCompare(itemLabel(b), "it", {
            sensitivity: "base",
          }),
        ),
    [items, query, searchPredicate, itemLabel],
  );

  const openCreateModal = () => {
    setEditingItem(null);
    setFormValues(emptyItem());
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (item: T) => {
    setEditingItem(item);
    setFormValues({ ...item });
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormValues(null);
    setEditingItem(null);
    setFormError(null);
  };

  const handleFieldChange = (name: keyof T, value: string) => {
    if (!formValues) return;
    setFormValues({ ...formValues, [name]: value } as T);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formValues) return;
    setFormError(null);
    setSubmitting(true);
    try {
      if (editingItem) {
        await onUpdate(formValues);
      } else {
        await onCreate(formValues);
      }
      closeModal();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Si è verificato un errore, riprova.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    setDeleteError(null);
    setDeleting(true);
    try {
      await onDelete(deletingItem.id);
      setDeletingItem(null);
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : "Impossibile eliminare l'elemento.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="d-flex gap-3 mb-3 align-items-center flex-wrap">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: 320 }}
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="primary" onClick={openCreateModal} className="ms-auto">
          + {newItemLabel}
        </Button>
      </div>

      <div className="pw-card">
        <div className="pw-card-title">{title}</div>

        {isLoading ? (
          <div
            className="d-flex align-items-center gap-2 text-body-secondary py-4"
            style={{ fontSize: 13 }}
          >
            <Spinner animation="border" size="sm" />
            Caricamento in corso…
          </div>
        ) : filteredItems.length === 0 ? (
          <div
            className="text-center text-body-secondary py-4"
            style={{ fontSize: 13 }}
          >
            Nessun elemento trovato.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div className="pw-standings-row" key={item.id}>
              {columns.map((col) => (
                <div
                  key={col.key}
                  style={{
                    width: col.width,
                    flex: col.width ? "0 0 auto" : 1,
                    minWidth: 0,
                  }}
                >
                  {col.render(item)}
                </div>
              ))}
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => openEditModal(item)}
                  aria-label={`Modifica ${itemLabel(item)}`}
                >
                  Modifica
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    setDeletingItem(item);
                    setDeleteError(null);
                  }}
                  aria-label={`Elimina ${itemLabel(item)}`}
                >
                  Elimina
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal show={showModal} onHide={closeModal} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: 18 }}>
              {editingItem ? `Modifica ${title.toLowerCase()}` : newItemLabel}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {formError && (
              <Alert variant="danger" className="py-2" style={{ fontSize: 13 }}>
                {formError}
              </Alert>
            )}
            {fields.map((field) => (
              <Form.Group className="mb-3" key={String(field.name)}>
                <Form.Label className="pw-metric-label">
                  {field.label}
                </Form.Label>
                {field.type === "select" ? (
                  <Form.Select
                    value={
                      formValues ? String(formValues[field.name] ?? "") : ""
                    }
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value)
                    }
                    required={field.required}
                  >
                    <option value="" disabled>
                      Seleziona…
                    </option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control
                    type={field.type}
                    value={
                      formValues ? String(formValues[field.name] ?? "") : ""
                    }
                    onChange={(e) =>
                      handleFieldChange(field.name, e.target.value)
                    }
                    required={field.required}
                  />
                )}
              </Form.Group>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={closeModal}
              disabled={submitting}
            >
              Annulla
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? "Salvataggio…" : "Salva"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={!!deletingItem}
        onHide={() => setDeletingItem(null)}
        centered
        size="sm"
      >
        <Modal.Body>
          <p style={{ fontSize: 14 }}>
            Eliminare{" "}
            <strong>{deletingItem ? itemLabel(deletingItem) : ""}</strong>?
            L'operazione non è reversibile.
          </p>
          {deleteError && (
            <Alert variant="danger" className="py-2" style={{ fontSize: 13 }}>
              {deleteError}
            </Alert>
          )}
          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setDeletingItem(null)}
              disabled={deleting}
            >
              Annulla
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Eliminazione…" : "Elimina"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
