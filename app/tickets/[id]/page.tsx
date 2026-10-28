
import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { tickets, comments } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

async function updateTicketStatus(formData: FormData) {
  "use server"
  const ticketId = Number(formData.get("ticketId"))
  const status = formData.get("status")
  if (!Number.isInteger(ticketId) || ticketId <= 0) {
    throw new Error("Invalid ticket ID.")
  }
  if (typeof status !== "string" || !["open", "in-progress", "resolved"].includes(status)) {
    throw new Error("Invalid status.")
  }
  const ticket = await db.query.tickets.findFirst({
    where: (tickets, { eq }) => eq(tickets.id, ticketId),
  });
  if (!ticket) {
    notFound()
  }
  await db.update(tickets).set({ status: status as "open" | "in-progress" | "resolved" }).where(eq(tickets.id, ticketId));
  revalidatePath("/tickets")
  revalidatePath(`/tickets/${ticketId}`)
}
async function createComment(formData: FormData) {
  "use server"
  const ticketId = Number(formData.get("ticketId"))
  const content = formData.get("content")
  if (!Number.isInteger(ticketId) || ticketId <= 0) {
    throw new Error("Invalid ticket ID.")
  }
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Comment cannot be empty.")
  }
  const ticket = await db.query.tickets.findFirst({
    where: (tickets, { eq }) => eq(tickets.id, ticketId),
  })
  if (!ticket) {
    notFound()
  }
  await db.insert(comments).values({
    ticketId: ticketId,
    content: content.trim(),
  })
  revalidatePath(`/tickets/${ticketId}`)
}
export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const ticketId = Number(id)
  if (!Number.isInteger(ticketId) || ticketId <= 0) {
    notFound()
  }
  const ticket = await db.query.tickets.findFirst({
    where: (tickets, { eq }) => eq(tickets.id, ticketId),
    with: {
      user: true,
      categories: true,
    },
  })
  if (!ticket) {
    notFound()
  }
  const ticketComments = await db.query.comments.findMany({
    where: (comments, { eq }) => eq(comments.ticketId, ticketId),
    orderBy: (comments, { asc }) => [asc(comments.createdAt)],
  })
  let statusText = "Open"
  if (ticket.status === "in-progress") {
    statusText = "In Progress"
  }
  if (ticket.status === "resolved") {
    statusText = "Resolved"
  }
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/tickets" className="mb-6 inline-block text-blue-600 hover:underline">Back</Link>
      <div className="rounded-lg border p-6 shadow-sm">
        <h1 className="mb-6 text-3xl font-bold">{ticket.title}</h1>
        <div className="space-y-5">
          <section>
            <h2 className="font-semibold">Description</h2>
            <p className="mt-1 whitespace-pre-wrap">{ticket.description}</p>
          </section>
          <section>
            <h2 className="font-semibold">Status</h2>
            <p>{statusText}</p>
            <form action={updateTicketStatus} className="mt-3">
              <input type="hidden" name="ticketId" value={ticket.id}/>
              <label htmlFor="status" className="mr-2">Change status:</label>
              <select id="status" name="status" defaultValue={ticket.status} className="rounded border border-black p-2" required>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <button type="submit" className="ml-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Save</button>
            </form>
          </section>
          <section>
            <h2 className="font-semibold">Category</h2>
            <p>{ticket.categories.name}</p>
          </section>
          <section>
            <h2 className="font-semibold">Reported By</h2>
            <p>{ticket.user.name}</p>
            <p>{ticket.user.email}</p>
          </section>
          <section>
            <h2 className="font-semibold">Created</h2>
            <p>{new Date(ticket.createdAt).toLocaleString()}</p>
          </section>
        </div>
      </div>
      <div className="mt-6 rounded-lg border p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold">Comments</h2>
        {ticketComments.length === 0 && (
          <p className="mb-4">No comments yet.</p>
        )}
        {ticketComments.map((comment) => (
          <div key={comment.id} className="mb-4 rounded-lg border p-4">
            <p className="whitespace-pre-wrap">{comment.content}</p>
            <p className="mt-2 text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
        <form action={createComment} className="mt-4">
          <input type="hidden" name="ticketId" value={ticket.id}/>
          <label htmlFor="content" className="mb-2 block font-semibold">Add a comment</label>
          <textarea id="content" name="content" required rows={4} className="mb-3 w-full rounded-lg border border-black p-3" placeholder="Write your comment here..."/>
          <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Add</button>
        </form>
      </div>
    </main>
  );
}
