
import Link from "next/link";
import { db } from "@/db";

export default async function TicketsPage() {
  const tickets = await db.query.tickets.findMany({
    with: { user: true, categories: true },
    orderBy: (tickets, { desc }) => [desc(tickets.createdAt)],
  });

  return (
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Support Tickets</h1>

      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        tickets.map((ticket) => (
          <Link key={ticket.id} href={`/tickets/${ticket.id}`} className="mb-4 block rounded-lg border p-4 hover:bg-gray-50">
            <h2 className="text-xl font-semibold">{ticket.title}</h2>
            <p>Status: {ticket.status === "in-progress"
                ? "In Progress"
                : ticket.status === "resolved"
                  ? "Resolved"
                  : "Open"}
            </p>
            <p>Category: {ticket.categories.name}</p>
            <p>Reported by: {ticket.user.name}</p>
            <p>
              Created: {new Date(ticket.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))
      )}
    </main>
  );
}
