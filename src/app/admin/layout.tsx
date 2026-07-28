"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: "📊" },
  { name: "Cars", href: "/admin/cars", icon: "🚗" },
  { name: "Add New Car", href: "/admin/cars/new", icon: "➕" },
  { name: "Inquiries", href: "/admin/inquiries", icon: "📩" },
  { name: "Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("admin-token");
    if (!token) {
      router.push("/admin/login");
    } else {
      setAuthenticated(true);
    }
    setLoading(false);
  }, [router, isLoginPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isLoginPage && !authenticated) {
    return null;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="bg-blue-900 text-white font-bold text-lg px-3 py-1 rounded-lg">
              GC
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">Gulf Cars</span>
              <span className="text-gold-500 text-xs block -mt-0.5">Admin Panel</span>
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" target="_blank" className="text-sm text-gray-600 hover:text-blue-900 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Website
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("admin-token");
                router.push("/admin/login");
              }}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-52px)] sticky top-[52px]">
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}