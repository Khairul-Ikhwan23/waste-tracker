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

export const facilities = pgTable("facilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'recycling_center', 'drop_off_point', 'collection_facility'
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  address: text("address").notNull(),
  district: text("district").notNull(),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  description: text("description"),
  operatingHours: text("operating_hours"),
  acceptedMaterials: text("accepted_materials").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFacilitySchema = createInsertSchema(facilities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  category: z.enum(["recycling_center", "drop_off_point", "collection_facility"]),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  acceptedMaterials: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export type InsertFacility = z.infer<typeof insertFacilitySchema>;
export type Facility = typeof facilities.$inferSelect;
