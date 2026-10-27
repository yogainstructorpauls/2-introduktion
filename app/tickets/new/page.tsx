
import { db } from "@/db";
import { users, categories, tickets } from "@/db/schema";
import { redirect } from "next/navigation";

async function createTicket(formData: FormData) {
  "use server";

  const title = formData.get("title") as string;
  const description = formData.get("description") as string
  const userId = Number(formData.get("userId"))
  const categoryId = Number(formData.get("categoryId"))

  if (!title || !description || !userId || !categoryId) {
    throw new Error("Please fill in all fields.");
  }

  await db.insert(tickets).values({
    title,
    description,
    userId,
    categoryId,
  })
  redirect("/tickets")
}
export default async function NewTicketPage() {
  const usersList = await db.select().from(users)
  const categoriesList = await db.select().from(categories)
  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">New ticket</h1>
      <form action={createTicket}>
        <p>Title</p>
        <input name="title" required className="border border-black" />
        <p>Description</p>
        <textarea name="description" required className="border border-black" />
        <p>User</p>
        <select name="userId" required defaultValue="" className="border border-black">
          <option value="" disabled>Select user</option>
          {usersList.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <p>Category</p>
        <select name="categoryId" required defaultValue="" className="border border-black">
          <option value="" disabled>Select category</option>
          {categoriesList.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>))}
        </select>
        <button type="submit">Create</button>
      </form>
    </main>
  );
}
