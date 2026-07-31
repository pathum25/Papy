import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

export default function PapyView() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/papy/${id}`).then((r) => r.json()).then((data) => {
      setItem(data);
      setTitle(data.title);
      setContent(data.content ?? "");
    });
  }, [id]);

  async function save() {
    const res = await fetch(`/api/papy/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ title, content })
    });
    if (res.ok) {
      setEditMode(false);
      const updated = await res.json();
      setItem(updated);
    } else {
      alert("Update failed");
    }
  }

  async function remove() {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`/api/papy/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/");
    else alert("Delete failed");
  }

  if (!item) return <Layout><div>Loading…</div></Layout>;

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow-sm">
        {!editMode ? (
          <>
            <h1 className="text-2xl font-bold">{item.title}</h1>
            <div className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</div>
            <p className="mt-4 text-gray-800 whitespace-pre-wrap">{item.content}</p>
            <div className="mt-4 space-x-2">
              <button onClick={() => setEditMode(true)} className="px-3 py-2 bg-yellow-500 text-white rounded">Edit</button>
              <button onClick={remove} className="px-3 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </>
        ) : (
          <>
            <label className="block text-sm font-medium">Title</label>
            <input value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
            <label className="block text-sm font-medium mt-3">Content</label>
            <textarea value={content} onChange={e=>setContent(e.target.value)} className="mt-1 block w-full p-2 border rounded" rows={8} />
            <div className="mt-3 space-x-2">
              <button onClick={save} className="px-3 py-2 bg-green-600 text-white rounded">Save</button>
              <button onClick={() => setEditMode(false)} className="px-3 py-2 bg-gray-300 rounded">Cancel</button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
      }
