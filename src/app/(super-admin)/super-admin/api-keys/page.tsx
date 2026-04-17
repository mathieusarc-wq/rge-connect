import ApiKeysClient from "./api-keys-client";
import { getAllServiceKeys } from "./actions";

export const metadata = {
  title: "Clés API — Super Admin — RGE Connect",
};

export default async function ApiKeysPage() {
  const existing = await getAllServiceKeys();
  // Index par service:key_name pour lookup rapide côté client
  const values: Record<string, string> = {};
  const updatedAt: Record<string, string> = {};
  for (const row of existing) {
    if (row.value != null) values[`${row.service}:${row.key_name}`] = row.value;
    updatedAt[`${row.service}:${row.key_name}`] = row.updated_at;
  }
  return <ApiKeysClient initialValues={values} initialUpdatedAt={updatedAt} />;
}
