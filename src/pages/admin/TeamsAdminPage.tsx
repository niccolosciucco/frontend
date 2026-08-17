import { useAdminData } from "../../context/useAdminData";
import {
  AdminCrudPage,
  type AdminColumn,
  type AdminFormField,
} from "../../components/admin/AdminCrudPage";
import type { AdminTeam } from "../../types/admin";
import { createTeam, updateTeam, deleteTeam } from "../../api/adminApi";

export default function TeamsAdminPage() {
  const { teams, setTeams, teamsLoading } = useAdminData();

  const columns: AdminColumn<AdminTeam>[] = [
    {
      key: "name",
      label: "Nome",
      render: (t) => (
        <div className="d-flex align-items-center gap-2">
          <span
            aria-hidden="true"
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: t.colorHex,
              flexShrink: 0,
            }}
          />
          <div>
            <div className="pw-driver-name">{t.name}</div>
            <div className="pw-driver-team">{t.base}</div>
          </div>
        </div>
      ),
    },
    {
      key: "principal",
      label: "Team principal",
      render: (t) => <span style={{ fontSize: 13 }}>{t.principal}</span>,
    },
    {
      key: "foundedYear",
      label: "Fondazione",
      width: "80px",
      render: (t) => (
        <span className="pw-mono" style={{ fontSize: 13 }}>
          {t.foundedYear}
        </span>
      ),
    },
  ];

  const fields: AdminFormField<AdminTeam>[] = [
    { name: "name", label: "Nome team", type: "text", required: true },
    { name: "base", label: "Sede", type: "text", required: true },
    {
      name: "principal",
      label: "Team principal",
      type: "text",
      required: true,
    },
    {
      name: "foundedYear",
      label: "Anno di fondazione",
      type: "number",
      required: true,
    },
    {
      name: "colorHex",
      label: "Colore identificativo (hex)",
      type: "text",
      required: true,
    },
  ];

  return (
    <AdminCrudPage<AdminTeam>
      title="Team"
      newItemLabel="Nuovo team"
      searchPlaceholder="Cerca team per nome"
      columns={columns}
      fields={fields}
      items={teams}
      isLoading={teamsLoading}
      onCreate={async (item) => {
        const created = await createTeam(item);
        setTeams((prev) => [...prev, created]);
      }}
      onUpdate={async (item) => {
        const updated = await updateTeam(item.id, item);
        setTeams((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t)),
        );
      }}
      onDelete={async (id) => {
        await deleteTeam(id);
        setTeams((prev) => prev.filter((t) => t.id !== id));
      }}
      emptyItem={() => ({
        id: "",
        name: "",
        base: "",
        principal: "",
        foundedYear: "",
        colorHex: "#9b5de5",
      })}
      searchPredicate={(item, query) => item.name.toLowerCase().includes(query)}
      itemLabel={(item) => item.name}
    />
  );
}
