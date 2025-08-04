import { pgTable, text, serial, integer, boolean, decimal, date, timestamp, varchar, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with role management
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  fullName: text("full_name"),
  role: text("role").notNull().default("household"), // household, business, waste_operator, admin
  district: text("district"), // Brunei-Muara, Belait, Tutong, Temburong
  address: text("address"),
  phone: text("phone"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  role: z.enum(["household", "business", "waste_operator", "admin"]).default("household"),
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

// Facilities table for recycling centers and eco-locations
export const facilities = pgTable("facilities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // recycling_center, drop_off_point, collection_center, transfer_station
  address: text("address").notNull(),
  district: text("district").notNull(),
  coordinates: jsonb("coordinates").notNull(), // [lat, lng]
  contact: text("contact"),
  hours: text("hours"),
  services: text("services").array(), // Collection, Processing, Recycling, etc.
  wasteTypes: text("waste_types").array(), // Paper, Plastic, Metal, etc.
  isActive: boolean("is_active").default(true),
  isSystem: boolean("is_system").default(false), // true for predefined facilities
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFacilitySchema = createInsertSchema(facilities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  category: z.enum(["recycling_center", "drop_off_point", "collection_center", "transfer_station"]),
  district: z.enum(["Brunei-Muara", "Belait", "Tutong", "Temburong"]),
  coordinates: z.array(z.number()).length(2),
  services: z.array(z.string()).default([]),
  wasteTypes: z.array(z.string()).default([]),
});

export type InsertFacility = z.infer<typeof insertFacilitySchema>;
export type Facility = typeof facilities.$inferSelect;

// Pickup requests table
export const pickupRequests = pgTable("pickup_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  wasteType: text("waste_type").notNull(),
  volume: decimal("volume", { precision: 8, scale: 2 }).notNull(), // in kg
  address: text("address").notNull(),
  district: text("district").notNull(),
  municipality: text("municipality"),
  coordinates: jsonb("coordinates"), // [lat, lng]
  preferredDate: date("preferred_date").notNull(),
  preferredTime: text("preferred_time"), // morning, afternoon, evening
  specialInstructions: text("special_instructions"),
  status: text("status").notNull().default("pending"), // pending, scheduled, in_progress, completed, cancelled
  operatorId: integer("operator_id"), // assigned waste operator
  scheduledDate: timestamp("scheduled_date"),
  completedDate: timestamp("completed_date"),
  actualVolume: decimal("actual_volume", { precision: 8, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPickupRequestSchema = createInsertSchema(pickupRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  wasteType: z.enum(["General Waste", "Recyclables", "Organic Waste", "Hazardous Waste", "Electronic Waste", "Garden Waste"]),
  district: z.enum(["Brunei-Muara", "Belait", "Tutong", "Temburong"]),
  status: z.enum(["pending", "scheduled", "in_progress", "completed", "cancelled"]).default("pending"),
  preferredTime: z.enum(["morning", "afternoon", "evening"]).optional(),
});

export type InsertPickupRequest = z.infer<typeof insertPickupRequestSchema>;
export type PickupRequest = typeof pickupRequests.$inferSelect;

// Waste collection records
export const wasteCollections = pgTable("waste_collections", {
  id: serial("id").primaryKey(),
  pickupRequestId: integer("pickup_request_id"),
  operatorId: integer("operator_id").notNull(),
  facilityId: integer("facility_id"),
  wasteType: text("waste_type").notNull(),
  volume: decimal("volume", { precision: 8, scale: 2 }).notNull(), // in kg
  recyclablePercent: decimal("recyclable_percent", { precision: 5, scale: 2 }), // percentage recyclable
  district: text("district").notNull(),
  collectionDate: timestamp("collection_date").notNull(),
  processingStatus: text("processing_status").default("collected"), // collected, sorted, processed, recycled, disposed
  carbonImpact: decimal("carbon_impact", { precision: 8, scale: 2 }), // CO2 equivalent saved/generated
  route: jsonb("route"), // GPS coordinates of collection route
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWasteCollectionSchema = createInsertSchema(wasteCollections).omit({
  id: true,
  createdAt: true,
}).extend({
  wasteType: z.enum(["General Waste", "Recyclables", "Organic Waste", "Hazardous Waste", "Electronic Waste", "Garden Waste"]),
  district: z.enum(["Brunei-Muara", "Belait", "Tutong", "Temburong"]),
  processingStatus: z.enum(["collected", "sorted", "processed", "recycled", "disposed"]).default("collected"),
});

export type InsertWasteCollection = z.infer<typeof insertWasteCollectionSchema>;
export type WasteCollection = typeof wasteCollections.$inferSelect;

// Recycling metrics table
export const recyclingMetrics = pgTable("recycling_metrics", {
  id: serial("id").primaryKey(),
  district: text("district").notNull(),
  wasteType: text("waste_type").notNull(),
  totalCollected: decimal("total_collected", { precision: 10, scale: 2 }).notNull(), // in kg
  totalRecycled: decimal("total_recycled", { precision: 10, scale: 2 }).notNull(), // in kg
  recyclingRate: decimal("recycling_rate", { precision: 5, scale: 2 }).notNull(), // percentage
  carbonSaved: decimal("carbon_saved", { precision: 10, scale: 2 }), // CO2 equivalent saved
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRecyclingMetricSchema = createInsertSchema(recyclingMetrics).omit({
  id: true,
  createdAt: true,
}).extend({
  district: z.enum(["Brunei-Muara", "Belait", "Tutong", "Temburong"]),
  wasteType: z.enum(["General Waste", "Recyclables", "Organic Waste", "Hazardous Waste", "Electronic Waste", "Garden Waste"]),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2030),
});

export type InsertRecyclingMetric = z.infer<typeof insertRecyclingMetricSchema>;
export type RecyclingMetric = typeof recyclingMetrics.$inferSelect;

// Environmental reports table
export const environmentalReports = pgTable("environmental_reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  district: text("district"),
  reportType: text("report_type").notNull(), // monthly, quarterly, annual, special
  reportPeriod: text("report_period").notNull(), // e.g., "2024-Q1", "2024-01"
  totalWasteCollected: decimal("total_waste_collected", { precision: 12, scale: 2 }),
  totalRecycled: decimal("total_recycled", { precision: 12, scale: 2 }),
  carbonFootprint: decimal("carbon_footprint", { precision: 12, scale: 2 }),
  carbonSaved: decimal("carbon_saved", { precision: 12, scale: 2 }),
  wasteByType: jsonb("waste_by_type"), // breakdown by waste type
  recommendations: text("recommendations").array(),
  achievements: text("achievements").array(),
  challenges: text("challenges").array(),
  generatedBy: integer("generated_by").notNull(), // user ID
  status: text("status").default("draft"), // draft, published, archived
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEnvironmentalReportSchema = createInsertSchema(environmentalReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  reportType: z.enum(["monthly", "quarterly", "annual", "special"]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export type InsertEnvironmentalReport = z.infer<typeof insertEnvironmentalReportSchema>;
export type EnvironmentalReport = typeof environmentalReports.$inferSelect;

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // pickup_reminder, payment_due, system_alert, achievement, report_ready
  priority: text("priority").default("normal"), // low, normal, high, urgent
  data: jsonb("data"), // additional data for the notification
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
}).extend({
  type: z.enum(["pickup_reminder", "payment_due", "system_alert", "achievement", "report_ready"]),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// EcoRewards table for gamification
export const ecoRewards = pgTable("eco_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  points: integer("points").notNull(),
  action: text("action").notNull(), // pickup_completed, recycling_milestone, referral, eco_challenge
  description: text("description").notNull(),
  metadata: jsonb("metadata"), // additional data about the action
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEcoRewardSchema = createInsertSchema(ecoRewards).omit({
  id: true,
  createdAt: true,
}).extend({
  action: z.enum(["pickup_completed", "recycling_milestone", "referral", "eco_challenge"]),
});

export type InsertEcoReward = z.infer<typeof insertEcoRewardSchema>;
export type EcoReward = typeof ecoRewards.$inferSelect;
