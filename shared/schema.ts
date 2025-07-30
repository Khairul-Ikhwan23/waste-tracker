import { pgTable, text, serial, integer, boolean, decimal, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: date("date").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending, completed, failed, cancelled
  type: text("type").notNull().default("pickup"), // pickup, subscription, penalty, refund
  method: text("method").notNull().default("card"), // card, bank_transfer, cash, digital_wallet
  reference: text("reference"), // transaction reference number
  dueDate: date("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
}).extend({
  status: z.enum(["pending", "completed", "failed", "cancelled"]).default("pending"),
  type: z.enum(["pickup", "subscription", "penalty", "refund"]).default("pickup"),
  method: z.enum(["card", "bank_transfer", "cash", "digital_wallet"]).default("card"),
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
