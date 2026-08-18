import { useAdminData } from "../../context/useAdminData";
import {
  AdminCrudPage,
  type AdminColumn,
  type AdminFormField,
} from "../../components/admin/AdminCrudPage";
import type { AdminCircuit } from "../../types/admin";
import {
  createCircuito,
  updateCircuito,
  deleteCircuito,
} from "../../api/adminApi";

export default function CircuitsAdminPage() {
  const { circuits, setCircuits, circuitsLoading } = useAdminData();

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
    {
      key: "turns",
      label: "Curve",
      width: "50px",
      render: (c) => (
        <span className="pw-mono" style={{ fontSize: 13 }}>
          {c.turns}
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
    { name: "turns", label: "Numero curve", type: "number", required: true },
    { name: "drsZones", label: "Zone DRS", type: "number", required: true },
    {
      name: "lapRecordTime",
      label: "Record sul giro (es. 1:21.046)",
      type: "text",
    },
    { name: "lapRecordDriver", label: "Pilota del record", type: "text" },
    { name: "lapRecordYear", label: "Anno del record", type: "number" },
    { name: "description", label: "Descrizione", type: "text" },
  ];

  return (
    <AdminCrudPage<AdminCircuit>
      title="Circuiti"
      newItemLabel="Nuovo circuito"
      searchPlaceholder="Cerca circuito per nome"
      columns={columns}
      fields={fields}
      items={circuits}
      isLoading={circuitsLoading}
      onCreate={async (item) => {
        const created = await createCircuito(item);
        setCircuits((prev) => [...prev, created]);
      }}
      onUpdate={async (item) => {
        const updated = await updateCircuito(item.id, item);
        setCircuits((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c)),
        );
      }}
      onDelete={async (id) => {
        await deleteCircuito(id);
        setCircuits((prev) => prev.filter((c) => c.id !== id));
      }}
      emptyItem={() => ({
        id: "",
        name: "",
        location: "",
        country: "",
        lengthKm: "",
        laps: "",
        turns: "",
        drsZones: "",
        lapRecordTime: "",
        lapRecordDriver: "",
        lapRecordYear: "",
        description: "",
      })}
      searchPredicate={(item, query) => item.name.toLowerCase().includes(query)}
      itemLabel={(item) => item.name}
    />
  );
}
