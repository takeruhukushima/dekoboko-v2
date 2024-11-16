import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-xl font-bold">Dekoboko App</h1>
      </header>
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <footer className="bg-gray-800 text-white text-center py-2">
        <p>© 2024 Dekoboko App. All rights reserved.</p>
      </footer>
    </div>
  );
}
