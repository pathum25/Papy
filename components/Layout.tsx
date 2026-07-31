import Link from "next/link";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
          <Link href="/"><a className="text-xl font-semibold">Papy</a></Link>
          <nav>
            <Link href="/papy/new"><a className="mr-4 text-sm text-blue-600">New</a></Link>
            <Link href="/api/auth/signin"><a className="text-sm text-gray-600">Sign in</a></Link>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6 flex-1">{children}</main>
      <footer className="bg-white border-t">
        <div className="max-w-4xl mx-auto p-4 text-sm text-gray-500">
          © Papy
        </div>
      </footer>
    </div>
  );
}
