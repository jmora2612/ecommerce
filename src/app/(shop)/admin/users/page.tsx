export const revalidate = 0;

// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedUsers } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { UsersTables } from "./ui/UsersTables";

export default async function UsersPage() {
  const res = await getPaginatedUsers();

  if (!res?.ok) redirect("/");

  const users = res.users ?? [];

  return (
    <>
      <Title title="Mantenimiento de usuarios" />

      <div className="mb-10">
        <UsersTables users={users} />
      </div>
    </>
  );
}
