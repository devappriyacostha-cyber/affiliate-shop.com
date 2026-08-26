import { db } from "@/db";
import { categories } from "@/db/schema";
import { upsertCategory, deleteCategory } from "../actions";
import { Trash2 } from "lucide-react";

export default async function AdminCategoriesPage() {
  const allCats = await db.query.categories.findMany();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>
      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm mb-10">
        <div className="divide-y">
          {allCats.map((cat) => (
            <div key={cat.id} className="p-5 flex justify-between items-center hover:bg-gray-50">
              <div>
                <div className="font-bold text-gray-800">{cat.name}</div>
                <div className="text-xs text-gray-400">Slug: {cat.slug}</div>
              </div>
              <form action={async () => { "use server"; await deleteCategory(cat.id); }}>
                <button className="text-red-500 p-2 hover:bg-red-50 rounded-xl"><Trash2 size={20} /></button>
              </form>
            </div>
          ))}
        </div>
      </div>
      <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100">
        <h2 className="font-bold mb-4 text-blue-900">Add New Category</h2>
        <form 
          action={async (formData: FormData) => {
            "use server";
            const data = {
              name: formData.get("name") as string,
            };
            await upsertCategory(data);
          }} 
          className="flex flex-col gap-4"
        >
          <input name="name" placeholder="Category Name" className="p-3 bg-white border-none rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500" required />
          <button type="submit" className="bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 shadow-lg transition-all">Create Category</button>
        </form>
      </div>
    </div>
  );
}
