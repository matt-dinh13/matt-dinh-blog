import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function logActivity({
  action,
  entity,
  entity_id = null,
  details = null,
  user_id = null,
}: {
  action: string;
  entity: string;
  entity_id?: string | null;
  details?: any;
  user_id?: string | null;
}) {
  const supabase = createClientComponentClient();
  const { error } = await supabase.from("activity_log").insert([
    {
      action,
      entity,
      entity_id,
      details,
      user_id,
    },
  ]);
  if (error) {
    // Optionally log to console or show a toast
    console.error("Failed to log activity:", error.message);
  }
} 