import { useAdminData } from "../../context/useAdminData";
import {
  AdminCrudPage,
  type AdminColumn,
  type AdminFormField,
} from "../../components/admin/AdminCrudPage";
import type { AdminCircuit } from "../../types/admin";

export default function CircuitsAdminPage() {
  const { circuits, setCircuits } = useAdminData();

  const columns: AdminColumn<AdminCircuit>[] = [
    {
      key: "name",
      label: "Nome",
      render: (c) => (
        <div>
          <div className="pw-driver-name">{c.name}</div>
          <div className="pw-driver-team">
            {c.location}, {c.country}
          </div>
        </div>
      ),
    },
    {
      key: "lengthKm",
      label: "Lunghezza",
      width: "90px",
      render: (c) => (
        <span className="pw-mono" style={{ fontSize: 13 }}>
          {c.lengthKm} km
        </span>
      ),
    },
    {
      key: "laps",
      label: "Giri",
      width: "50px",
      render: (c) => (
        <span className="pw-mono" style={{ fontSize: 13 }}>
          {c.laps}
        </span>
      ),
    },
  ];

  const fields: AdminFormField<AdminCircuit>[] = [
    { name: "name", label: "Nome circuito", type: "text", required: true },
    { name: "location", label: "Località", type: "text", required: true },
    { name: "country", label: "Paese", type: "text", required: true },
    {
      name: "lengthKm",
      label: "Lunghezza (km)",
      type: "number",
      required: true,
    },
    { name: "laps", label: "Giri gara", type: "number", required: true },
  ];

  return (
    <AdminCrudPage<AdminCircuit>
      title="Circuiti"
      newItemLabel="Nuovo circuito"
      searchPlaceholder="Cerca circuito per nome"
      columns={columns}
      fields={fields}
      items={circuits}
      onCreate={(item) =>
        setCircuits((prev) => [...prev, { ...item, id: crypto.randomUUID() }])
      }
      onUpdate={(item) =>
        setCircuits((prev) => prev.map((c) => (c.id === item.id ? item : c)))
      }
      onDelete={(id) => setCircuits((prev) => prev.filter((c) => c.id !== id))}
      emptyItem={() => ({
        id: "",
        name: "",
        location: "",
        country: "",
        lengthKm: "",
        laps: "",
      })}
      searchPredicate={(item, query) => item.name.toLowerCase().includes(query)}
      itemLabel={(item) => item.name}
    />
  );
}
