"use client";
import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import AdminLayout from "@/components/AdminLayout";
import { logActivity } from '@/lib/logActivity';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      // Supabase Auth users are not in a public table, so use the admin API
      const { data, error } = await supabase.auth.admin.listUsers();
      if (error) setError(error.message);
      else setUsers(data?.users || []);
      setLoading(false);
    }
    fetchUsers();
  }, [supabase]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setError(null);
    try {
      await supabase.auth.admin.deleteUser(id);
      // Log activity
      const deletedUser = users.find(u => u.id === id);
      await logActivity({
        action: 'delete',
        entity: 'user',
        entity_id: id,
        details: {
          email: deletedUser?.email,
          created_at: deletedUser?.created_at,
          last_sign_in_at: deletedUser?.last_sign_in_at,
          status: deletedUser?.email_confirmed_at ? 'Active' : 'Pending',
        },
        user_id: null,
      });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e: any) {
      setError(e.message || "Failed to delete user.");
    }
  };

  const filteredUsers = users.filter((u) => u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        <h1>Users</h1>
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 16, padding: 8, width: 300 }}
        />
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div>No users found.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8 }}>Email</th>
                <th style={{ textAlign: "left", padding: 8 }}>Created</th>
                <th style={{ textAlign: "left", padding: 8 }}>Last Sign In</th>
                <th style={{ textAlign: "left", padding: 8 }}>Status</th>
                <th style={{ textAlign: "left", padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td style={{ padding: 8 }}>{user.email}</td>
                  <td style={{ padding: 8 }}>{user.created_at ? new Date(user.created_at).toLocaleString() : "-"}</td>
                  <td style={{ padding: 8 }}>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "-"}</td>
                  <td style={{ padding: 8 }}>{user.email_confirmed_at ? "Active" : "Pending"}</td>
                  <td style={{ padding: 8 }}>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{ color: "#fff", background: "#e00", border: "none", borderRadius: 4, padding: "6px 16px", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
} 