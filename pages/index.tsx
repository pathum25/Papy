import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Link from "next/link";

type PapyItem = {
  id: number;
  title: string;
  content?: string;
  createdAt: string;
};

export default function Home() {
  const [items, setItems] = useState<PapyItem[]>([]);

  useEffect(() => {
    fetch("/api/papy")
      .then((r) => r.json())
      .then(setItems)
      .catch(console.error);
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Papy items</h1>
      <div className="space-y-3">
        {items.length === 0 && <div className="text-gray-500">No items yet. <Link href="/papy/new"><a className="text-blue-600">Create one</a></Link>.</div>}
        {items.map((it) => (
          <div key={it.id} className="bg-white p-4 rounded shadow-sm">
            <Link href={`/papy/${it.id}`}>
              <a className="text-lg font-medium text-gray-900">{it.title}</a>
            </Link>
            <div className="text-sm text-gray-500">{new Date(it.createdAt).toLocaleString()}</div>
            <p className="mt-2 text-gray-700">{it.content?.slice(0, 200)}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
                                                                                                                                                }
