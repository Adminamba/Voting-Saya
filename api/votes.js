
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("vote_counter")
      .select("count")
      .eq("id", 1)
      .single();

    if (error) {
      console.error("GET ERROR:", error);
      return res.status(500).json({ error: "Database read failed" });
    }

    return res.status(200).json({ count: data.count });
  }

  if (req.method === "POST") {
    const { data, error } = await supabase.rpc(
      "increment_vote_count"
    );

    if (error) {
      console.error("POST ERROR:", error);
      return res.status(500).json({ error: "Vote failed" });
    }

    return res.status(200).json({ count: data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
