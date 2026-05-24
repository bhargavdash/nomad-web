import { TopNav } from "@/components/layout/TopNav";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  return (
    <div className="min-h-screen">
      <TopNav />
      <main>{children}</main>
    </div>
  );
}
