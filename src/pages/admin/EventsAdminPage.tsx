import { useAdminData } from "../../context/useAdminData";
import {
  AdminCrudPage,
  type AdminColumn,
  type AdminFormField,
} from "../../components/admin/AdminCrudPage";
import type { AdminEvent } from "../../types/admin";
import { createEvento, updateEvento, deleteEvento } from "../../api/adminApi";

export default function EventsAdminPage() {
  const { events, setEvents, eventsLoading, circuits } = useAdminData();
  const circuitName = (circuitId: string) =>
    circuits.find((c) => c.id === circuitId)?.name ?? "—";

  const columns: AdminColumn<AdminEvent>[] = [
    {
      key: "name",
      label: "Evento",
      render: (e) => (
        <div>
          <div className="pw-driver-name">{e.name}</div>
          <div className="pw-driver-team">{circuitName(e.circuitId)}</div>
        </div>
      ),
    },
    {
      key: "date",
      label: "Data",
      width: "100px",
      render: (e) => (
        <span className="pw-mono" style={{ fontSize: 13 }}>
          {e.date}
        </span>
      ),
    },
    {
      key: "status",
      label: "Stato",
      width: "110px",
      render: (e) => (
        <span
          className={`pw-badge ${e.status === "concluso" ? "pw-badge-purple" : "pw-badge-green"}`}
        >
          {e.status}
        </span>
      ),
    },
  ];

  const fields: AdminFormField<AdminEvent>[] = [
    { name: "name", label: "Nome evento", type: "text", required: true },
    {
      name: "circuitId",
      label: "Circuito",
      type: "select",
      required: true,
      options: circuits.map((c) => ({ value: c.id, label: c.name })),
    },
    { name: "date", label: "Data", type: "date", required: true },
    {
      name: "status",
      label: "Stato",
      type: "select",
      required: true,
      options: [
        { value: "programmato", label: "Programmato" },
        { value: "concluso", label: "Concluso" },
      ],
    },
  ];

  return (
    <AdminCrudPage<AdminEvent>
      title="Eventi"
      newItemLabel="Nuovo evento"
      searchPlaceholder="Cerca evento per nome"
      columns={columns}
      fields={fields}
      items={events}
      isLoading={eventsLoading}
      onCreate={async (item) => {
        const created = await createEvento(item);
        setEvents((prev) => [...prev, created]);
      }}
      onUpdate={async (item) => {
        const updated = await updateEvento(item.id, item);
        setEvents((prev) =>
          prev.map((e) => (e.id === updated.id ? updated : e)),
        );
      }}
      onDelete={async (id) => {
        await deleteEvento(id);
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }}
      emptyItem={() => ({
        id: "",
        name: "",
        circuitId: circuits[0]?.id ?? "",
        date: "",
        status: "programmato",
      })}
      searchPredicate={(item, query) => item.name.toLowerCase().includes(query)}
      itemLabel={(item) => item.name}
    />
  );
}
