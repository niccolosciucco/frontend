import { useContext } from "react";
import { AdminDataContext } from "./AdminDataContext";

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx)
    throw new Error("useAdminData deve essere usato dentro AdminDataProvider");
  return ctx;
}
