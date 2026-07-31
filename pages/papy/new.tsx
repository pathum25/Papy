import React, { useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";

export default function NewPapy() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/papy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      router.push(`/papy/${data.id}`);
    } else {
      alert("Error creating item");
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">New Papy item</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input className="mt-1 block w-full p-2 border rounded" value={title} onChange={(e)=>setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea className="mt-1 block w-full p-2 border rounded" value={content} onChange={(e)=>setContent(e.target.value)} rows={6} />
        </div>
        <div>
          <button disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? "Saving..." : "Create"}</button>
        </div>
      </form>
    </Layout>
  );
        }
