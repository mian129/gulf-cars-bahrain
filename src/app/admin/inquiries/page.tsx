import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { car: { select: { title: true, slug: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inquiries</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {inquiries.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className={`p-5 ${!inquiry.read ? "bg-blue-50" : ""}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{inquiry.name}</h3>
                      {!inquiry.read && (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">New</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                      <span>{inquiry.email}</span>
                      {inquiry.phone && <span>{inquiry.phone}</span>}
                      <span>{formatDate(inquiry.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{inquiry.message}</p>
                    {inquiry.car && (
                      <p className="text-xs text-gray-400">
                        Regarding: <a href={`/car/${inquiry.car.slug}`} target="_blank" className="text-blue-600 hover:underline">{inquiry.car.title}</a>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <a
                      href={`mailto:${inquiry.email}?subject=Re: Your inquiry about ${inquiry.car?.title || "Gulf Cars Bahrain"}&body=Hi ${inquiry.name},`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Reply
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg mb-2">No inquiries yet</p>
            <p className="text-sm">Inquiries from the contact form will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
