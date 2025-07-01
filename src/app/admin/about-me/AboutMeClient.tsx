"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "vi", label: "Tiếng Việt" },
];

export default function AboutMeClient() {
  const [activeLang, setActiveLang] = useState("en");
  const [content, setContent] = useState<{ [key: string]: string }>({ en: "", vi: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchAboutMe() {
      setLoading(true);
      setError(null);
      const result = await supabase
        .from("about_me")
        .select("id, language_code, content")
        .order("language_code", { ascending: true });
      if (result.error) {
        setError("Failed to fetch about me content.");
      } else if (result.data) {
        const newContent: any = { en: "", vi: "" };
        result.data.forEach((row: any) => {
          newContent[row.language_code] = row.content || "";
        });
        setContent(newContent);
      }
      setLoading(false);
    }
    fetchAboutMe();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      for (const lang of LANGUAGES) {
        const { error } = await supabase
          .from("about_me")
          .upsert({ language_code: lang.code, content: content[lang.code] }, { onConflict: "language_code" });
        if (error) throw error;
      }
    } catch (e: any) {
      setError(e.message || "Failed to save.");
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1>About Me Content</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setActiveLang(lang.code)}
            style={{
              padding: "8px 16px",
              borderRadius: 4,
              border: activeLang === lang.code ? "2px solid #0070f3" : "1px solid #ccc",
              background: activeLang === lang.code ? "#f0f8ff" : "#fff",
              fontWeight: activeLang === lang.code ? "bold" : "normal",
              cursor: "pointer",
            }}
          >
            {lang.label}
          </button>
        ))}
      </div>
      <div style={{ marginBottom: 16 }}>
        <RichTextEditor
          value={content[activeLang]}
          onChange={(val: string) => setContent((prev) => ({ ...prev, [activeLang]: val }))}
          language={activeLang as 'en' | 'vi'}
        />
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: "10px 24px",
          borderRadius: 4,
          background: saving ? "#ccc" : "#0070f3",
          color: "#fff",
          border: "none",
          fontWeight: "bold",
          cursor: saving ? "not-allowed" : "pointer",
        }}
      >
        {saving ? "Saving..." : "Save"}
      </button>
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
    </div>
  );
} 