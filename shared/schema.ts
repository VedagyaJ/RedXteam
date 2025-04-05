import { pgTable, text, serial, integer, timestamp, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User types
export const UserType = {
  HACKER: "hacker",
  ORGANIZATION: "organization",
} as const;

export type UserTypeEnum = typeof UserType[keyof typeof UserType];

// Severity types
export const SeverityType = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export type SeverityTypeEnum = typeof SeverityType[keyof typeof SeverityType];

// Status types
export const StatusType = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  DUPLICATE: "duplicate",
  FIXED: "fixed",
} as const;

export type StatusTypeEnum = typeof StatusType[keyof typeof StatusType];

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  userType: text("user_type").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reputation: integer("reputation").default(0),
});

// Programs table
export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  organizationId: integer("organization_id").notNull(),
  minBounty: integer("min_bounty").notNull(),
  maxBounty: integer("max_bounty").notNull(),
  scope: text("scope").notNull(),
  rules: text("rules").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  industry: text("industry").notNull(),
  responseTime: integer("response_time").default(48),
});

// Reports table
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  hackerId: integer("hacker_id").notNull(),
  programId: integer("program_id").notNull(),
  severity: text("severity").notNull(),
  status: text("status").default("pending").notNull(),
  rewardAmount: integer("reward_amount"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  stepsToReproduce: text("steps_to_reproduce").notNull(),
  impact: text("impact").notNull(),
});

// Program tags table
export const programTags = pgTable("program_tags", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").notNull(),
  tag: text("tag").notNull(),
});

// Resources table
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  category: text("category").notNull(),
});

// Insert schemas using drizzle-zod
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  reputation: true,
});

export const insertProgramSchema = createInsertSchema(programs).omit({
  id: true,
  createdAt: true,
  isActive: true,
  responseTime: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  rewardAmount: true,
});

export const insertProgramTagSchema = createInsertSchema(programTags).omit({
  id: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type Program = typeof programs.$inferSelect;

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

export type InsertProgramTag = z.infer<typeof insertProgramTagSchema>;
export type ProgramTag = typeof programTags.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

// Extended schemas for API responses
export const programWithTagsSchema = z.object({
  ...createInsertSchema(programs).shape,
  tags: z.array(z.string()),
  organizationName: z.string(),
});

export type ProgramWithTags = z.infer<typeof programWithTagsSchema>;

export const reportWithDetailsSchema = z.object({
  ...createInsertSchema(reports).shape,
  programTitle: z.string(),
  hackerUsername: z.string(),
});

export type ReportWithDetails = z.infer<typeof reportWithDetailsSchema>;
