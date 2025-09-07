"use client";
import React, { useEffect, useMemo, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import AdminLayout from "@/components/AdminLayout";

const PAGE_SIZE = 50;

type ActivityLog = {
  id: number
  timestamp?: string
  user_id?: string | null
  action: string
  entity: string
  entity_id?: string | null
  details?: unknown
}

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
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
      const { data, error } = await query as any;
      if (error) setError(error.message);
      else setLogs((data || []) as ActivityLog[]);
      setLoading(false);
    }
    fetchLogs();
  }, [supabase, actionFilter, entityFilter, page]);

  const filteredLogs = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return logs;
    return logs.filter((log) => {
      const detailsText = JSON.stringify(log.details || "").toLowerCase();
      const entId = (log.entity_id || "").toString().toLowerCase();
      return detailsText.includes(term) || entId.includes(term);
    });
  }, [logs, search]);

  const relativeTime = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const diffMs = Date.now() - d.getTime();
    const sec = Math.floor(diffMs / 1000);
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.floor(hr / 24);
    return `${day}d ago`;
  };

  const actionBadge = (a: string) => {
    const base = "px-2 py-0.5 rounded text-xs font-semibold";
    if (a === "create") return <span className={`${base} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`}>create</span>;
    if (a === "update") return <span className={`${base} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}>update</span>;
    if (a === "delete") return <span className={`${base} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`}>delete</span>;
    if (a === "login") return <span className={`${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`}>login</span>;
    return <span className={`${base} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`}>{a}</span>;
  };

  const entityBadge = (e: string) => {
    const base = "px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    return <span className={base}>{e}</span>;
  };

  const toggle = (id: number) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <AdminLayout title="Activity Log" subtitle="Recent admin and system actions">
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-3">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Search details or entity id..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-64 dark:bg-gray-700 dark:text-white"
            />
            <select value={actionFilter} onChange={e => { setPage(1); setActionFilter(e.target.value) }} className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
              <option value="">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login</option>
            </select>
            <select value={entityFilter} onChange={e => { setPage(1); setEntityFilter(e.target.value) }} className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white">
              <option value="">All Entities</option>
              <option value="blog_post">Blog Post</option>
              <option value="category">Category</option>
              <option value="tag">Tag</option>
              <option value="about_me">About Me</option>
              <option value="user">User</option>
              <option value="portfolio_project">Portfolio Project</option>
            </select>
            {(actionFilter || entityFilter || search) && (
              <button onClick={() => { setActionFilter(""); setEntityFilter(""); setSearch(""); setPage(1) }} className="px-3 py-2 border rounded">
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 dark:border-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left border-b">Timestamp</th>
                <th className="px-3 py-2 text-left border-b">User</th>
                <th className="px-3 py-2 text-left border-b">Action</th>
                <th className="px-3 py-2 text-left border-b">Entity</th>
                <th className="px-3 py-2 text-left border-b">Entity ID</th>
                <th className="px-3 py-2 text-left border-b">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={6} className="px-3 py-6 text-center text-red-600">{error}</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan={6} className="px-3 py-6 text-center text-gray-500">No activity found.</td></tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-3 py-2 align-top border-t">
                      <div className="text-gray-900 dark:text-gray-100">{relativeTime(log.timestamp)}</div>
                      <div className="text-xs text-gray-500">{log.timestamp ? new Date(log.timestamp).toLocaleString() : "-"}</div>
                    </td>
                    <td className="px-3 py-2 align-top border-t font-mono text-xs text-gray-700 dark:text-gray-300">{log.user_id || "System"}</td>
                    <td className="px-3 py-2 align-top border-t">{actionBadge(log.action)}</td>
                    <td className="px-3 py-2 align-top border-t">{entityBadge(log.entity)}</td>
                    <td className="px-3 py-2 align-top border-t font-mono text-xs text-gray-700 dark:text-gray-300">{log.entity_id || "-"}</td>
                    <td className="px-3 py-2 align-top border-t">
                      <button onClick={() => toggle(log.id)} className="text-blue-600 hover:underline text-sm">{expanded[log.id] ? "Hide" : "View"}</button>
                      {expanded[log.id] && (
                        <pre className="mt-2 max-w-[38rem] whitespace-pre-wrap break-words bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                          {log.details ? JSON.stringify(log.details, null, 2) : "-"}
                        </pre>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-3 flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <span className="text-sm">Page {page}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={logs.length < PAGE_SIZE} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </AdminLayout>
  );
} 