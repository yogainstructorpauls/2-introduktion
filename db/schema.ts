import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";


export const users = pgTable("users", {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});


export const categories = pgTable("categories", {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull().unique(),
});


export const ticketStatus = pgEnum('ticket-status', ['open', 'in-progress', 'resolved']);

export const tickets = pgTable("tickets", {
  id: serial().primaryKey(),
  title: varchar({ length: 200 }).notNull(),
  description: text().notNull(),
  status: ticketStatus().default("open"),
  userId: serial()
    .notNull()
    .references(() => users.id),
  categoryId: serial()
    .notNull()
    .references(() => categories.id),
  createdAt: timestamp().notNull().defaultNow(),
});

export const ticketsRelations = relations(tickets, ({ one }) => ({
    user: one(users, {
        fields: [tickets.userId],
        references: [users.id],
    }),

    categories: one(categories, {
        fields: [tickets.categoryId],
        references: [categories.id],
    }),
}));


export const comments = pgTable("comments", {
  id: serial().primaryKey(),
  content: text().notNull(),
  ticketId: serial()
    .notNull()
    .references(() => tickets.id),
  createdAt: timestamp().notNull().defaultNow(),
});