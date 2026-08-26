import { db } from "@/db";
import { banners } from "@/db/schema";
import { upsertBanner, deleteBanner } from "../actions";
import { Trash2, Image as ImageIcon } from "lucide-react";

export default async function AdminBannersPage() {
  const allBanners = await db.query.banners.findMany();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Hero Banner Manager</h1>
      <div className="grid gap-4 mb-10">
        {allBanners.map((banner) => (
          <div key={banner.id} className="bg-white p-4 border rounded-2xl flex gap-4 items-center shadow-sm">
            <img src={banner.imageUrl} className="w-32 h-20 object-cover rounded-xl bg-gray-100" />
            <div className="flex-1">
              <div className="font-bold text-gray-800">{banner.title || 'No Title'}</div>
              <div className="text-sm text-gray-500">{banner.subtitle || 'No Subtitle'}</div>
            </div>
            <form action={async () => { "use server"; await deleteBanner(banner.id); }}>
              <button className="text-red-500 p-2 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20} /></button>
            </form>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 p-6 rounded-3xl border border-dashed border-gray-300">
        <h2 className="font-bold mb-4 text-gray-700">Add New Banner</h2>
        <form 
          action={async (formData: FormData) => {
            "use server";
            const data = {
              title: formData.get("title") as string,
              subtitle: formData.get("subtitle") as string,
              imageUrl: formData.get("imageUrl") as string,
              buttonUrl: formData.get("buttonUrl") as string,
            };
            await upsertBanner(data);
          }} 
          className="grid gap-4"
        >
          <input name="title" placeholder="Banner Title" className="p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" required />
          <input name="subtitle" placeholder="Subtitle" className="p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
          <input name="imageUrl" placeholder="Image URL" className="p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" required />
          <input name="buttonUrl" placeholder="Link URL" className="p-3 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-orange-500" defaultValue="/" />
          <button type="submit" className="bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg transition hover:scale-[1.01]">Save Banner</button>
        </form>
      </div>
    </div>
  );
}
