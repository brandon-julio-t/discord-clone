import { ensureAuthServerSession } from "~/lib/auth";
import { PageView } from "./_components/page-view";

export default async function Home() {
  const { user } = await ensureAuthServerSession();

  return <PageView user={user} />;
}
