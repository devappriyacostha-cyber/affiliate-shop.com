import { db } from "@/db";
import { users } from "@/db/schema";
import { deleteUser, clearAllUsers } from "../actions";
import { User, Trash2, AlertTriangle } from "lucide-react";

export default async function AdminUsersPage() {
  const allUsers = await db.query.users.findMany();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-gray-800">User Management</h1>
        <form action={clearAllUsers}>
          <button className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 shadow-lg">
            <AlertTriangle size={18} /> Clear All Users
          </button>
        </form>
      </div>
      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-bold text-gray-600 text-xs uppercase">User Details</th>
              <th className="p-4 font-bold text-gray-600 text-xs uppercase">Joined Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {allUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><User size={20} /></div>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{user.name || 'Visitor'}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-xs text-gray-400">{user.createdAt?.toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <form action={async () => { "use server"; await deleteUser(user.id); }}>
                    <button className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18} /></button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
