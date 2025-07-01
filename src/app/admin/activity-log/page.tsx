"use client";
import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import AdminLayout from "@/components/AdminLayout";

const PAGE_SIZE = 50;

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError(null);
      let query = supabase
        .from("activity_log")
        .select("*", { count: "exact" })
        .order("timestamp", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
      if (actionFilter) query = query.eq("action", actionFilter);
      if (entityFilter) query = query.eq("entity", entityFilter);
      const { data, error } = await query;
      if (error) setError(error.message);
      else setLogs(data || []);
      setLoading(false);
    }
    fetchLogs();
  }, [supabase, actionFilter, entityFilter, page]);

  const filteredLogs = logs.filter((log) =>
    search
      ? JSON.stringify(log.details || "").toLowerCase().includes(search.toLowerCase()) ||
        (log.entity_id || "").toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
        <h1>Activity Log</h1>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Search details or entity id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: 8, width: 260 }}
          />
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} style={{ padding: 8 }}>
            <option value="">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
          </select>
          <select value={entityFilter} onChange={e => setEntityFilter(e.target.value)} style={{ padding: 8 }}>
            <option value="">All Entities</option>
            <option value="blog_post">Blog Post</option>
            <option value="category">Category</option>
            <option value="tag">Tag</option>
            <option value="about_me">About Me</option>
            <option value="user">User</option>
          </select>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : filteredLogs.length === 0 ? (
          <div>No activity found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8 }}>Timestamp</th>
                <th style={{ textAlign: "left", padding: 8 }}>User ID</th>
                <th style={{ textAlign: "left", padding: 8 }}>Action</th>
                <th style={{ textAlign: "left", padding: 8 }}>Entity</th>
                <th style={{ textAlign: "left", padding: 8 }}>Entity ID</th>
                <th style={{ textAlign: "left", padding: 8 }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ padding: 8 }}>{log.timestamp ? new Date(log.timestamp).toLocaleString() : "-"}</td>
                  <td style={{ padding: 8 }}>{log.user_id || "-"}</td>
                  <td style={{ padding: 8 }}>{log.action}</td>
                  <td style={{ padding: 8 }}>{log.entity}</td>
                  <td style={{ padding: 8 }}>{log.entity_id || "-"}</td>
                  <td style={{ padding: 8, maxWidth: 300, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                    {log.details ? JSON.stringify(log.details, null, 2) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
          <span>Page {page}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={logs.length < PAGE_SIZE}>Next</button>
        </div>
      </div>
    </AdminLayout>
  );
} 