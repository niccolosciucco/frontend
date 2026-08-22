import { useAdminData } from "../../context/useAdminData";
import {
  AdminCrudPage,
  type AdminColumn,
  type AdminFormField,
} from "../../components/admin/AdminCrudPage";
import type { AdminDriver } from "../../types/admin";
import { createPilota, updatePilota, deletePilota } from "../../api/adminApi";
import { Link } from "react-router-dom";

export default function DriversAdminPage() {
  const { drivers, setDrivers, driversLoading, teams } = useAdminData();
  const teamName = (teamId: string) =>
    teams.find((t) => t.id === teamId)?.name ?? "—";

  const columns: AdminColumn<AdminDriver>[] = [
    {
      key: "name",
      label: "Nome",
      render: (d) => (
        <div className="d-flex align-items-center gap-2">
          <div className="pw-avatar">{d.number}</div>
          <div>
            <Link
              to={`/piloti/${d.id}`}
              className="pw-driver-name text-decoration-none"
              style={{ color: "var(--pw-text)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {d.name}
            </Link>
            <div className="pw-driver-team">{teamName(d.teamId)}</div>
          </div>
        </div>
      ),
    },
    {
      key: "nationality",
      label: "Nazione",
      width: "70px",
      render: (d) => (
        <span className="pw-mono" style={{ fontSize: 13 }}>
          {d.nationality}
        </span>
      ),
    },
  ];

  const fields: AdminFormField<AdminDriver>[] = [
    { name: "name", label: "Nome completo", type: "text", required: true },
    {
      name: "teamId",
      label: "Team",
      type: "select",
      required: true,
      options: teams.map((t) => ({ value: t.id, label: t.name })),
    },
    {
      name: "nationality",
      label: "Nazionalità (codice a 3 lettere)",
      type: "text",
      required: true,
    },
    { name: "number", label: "Numero di gara", type: "number", required: true },
  ];

  return (
    <AdminCrudPage<AdminDriver>
      title="Piloti"
      newItemLabel="Nuovo pilota"
      searchPlaceholder="Cerca pilota per nome"
      columns={columns}
      fields={fields}
      items={drivers}
      isLoading={driversLoading}
      onCreate={async (item) => {
        const created = await createPilota(item);
        setDrivers((prev) => [...prev, created]);
      }}
      onUpdate={async (item) => {
        const updated = await updatePilota(item.id, item);
        setDrivers((prev) =>
          prev.map((d) => (d.id === updated.id ? updated : d)),
        );
      }}
      onDelete={async (id) => {
        await deletePilota(id);
        setDrivers((prev) => prev.filter((d) => d.id !== id));
      }}
      emptyItem={() => ({
        id: "",
        name: "",
        teamId: teams[0]?.id ?? "",
        nationality: "",
        number: "",
      })}
      searchPredicate={(item, query) => item.name.toLowerCase().includes(query)}
      itemLabel={(item) => item.name}
    />
  );
}
