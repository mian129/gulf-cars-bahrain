import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  const [totalCars, activeCars, featuredCars, totalInquiries, unreadInquiries] = await Promise.all([
    prisma.car.count(),
    prisma.car.count({ where: { status: "active" } }),
    prisma.car.count({ where: { featured: true } }),
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { read: false } }),
  ]);

  const recentInquiries = await prisma.inquiry.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { car: { select: { title: true } } },
  });

  const stats = [
    { name: "Total Cars", value: totalCars, icon: "🚗", color: "bg-blue-500" },
    { name: "Active Listings", value: activeCars, icon: "✅", color: "bg-green-500" },
    { name: "Featured", value: featuredCars, icon: "⭐", color: "bg-yellow-500" },
    { name: "Inquiries", value: totalInquiries, icon: "📩", color: "bg-purple-500" },
    { name: "Unread", value: unreadInquiries, icon: "📬", color: "bg-red-500" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/admin/cars/new"
          className="bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Car
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`w-2 h-2 rounded-full ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.name}</div>
          </div>
        ))}
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="text-sm text-blue-900 hover:underline">View All</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentInquiries.length > 0 ? (
            recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{inquiry.name}</p>
                  <p className="text-sm text-gray-500">{inquiry.email} | {inquiry.phone || "No phone"}</p>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-1">{inquiry.message}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block w-2 h-2 rounded-full ${inquiry.read ? "bg-gray-300" : "bg-red-500"}`} />
                  <p className="text-xs text-gray-400 mt-1">{new Date(inquiry.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">No inquiries yet</div>
          )}
        </div>
      </div>
    </div>
  );
}