
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";

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
            <h2 className="font-semibold">Problem Description</h2>
            <p className="mt-1 whitespace-pre-wrap">{ticket.description}</p>
          </section>
          <section>
            <h2 className="font-semibold">Status</h2>
            <p>{statusText}</p>
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
    </main>
  )
}
