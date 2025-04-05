import { pgTable, text, serial, integer, timestamp, boolean, json, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums for various status and type options
export const userRoleEnum = pgEnum('user_role', ['organization', 'hacker']);
export const programStatusEnum = pgEnum('program_status', ['active', 'inactive', 'draft']);
export const severityEnum = pgEnum('severity', ['critical', 'high', 'medium', 'low', 'informational']);
export const reportStatusEnum = pgEnum('report_status', ['pending', 'triaging', 'accepted', 'rejected', 'duplicate', 'fixed']);

// Users table - for both organizations and hackers
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull(),
  bio: text("bio"),
  profilePicture: text("profile_picture"),
  skills: text("skills").array(),
  reputation: integer("reputation").default(0),
  // Organization specific fields
  companyName: text("company_name"),
  companyUrl: text("company_url"),
  industry: text("industry"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  reputation: true,
});

// Programs table - bug bounty programs created by organizations
export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  scope: text("scope").notNull(),
  outOfScope: text("out_of_scope"),
  rules: text("rules"),
  status: programStatusEnum("status").notNull().default("draft"),
  rewards: json("rewards").notNull(), // JSON structure for different severity levels
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  logo: text("logo"),
  industry: text("industry"),
  technologies: text("technologies").array(),
});

export const insertProgramSchema = createInsertSchema(programs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Reports table - vulnerability reports submitted by hackers
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  programId: integer("program_id").notNull().references(() => programs.id),
  hackerId: integer("hacker_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  stepsToReproduce: text("steps_to_reproduce").notNull(),
  severity: severityEnum("severity").notNull(),
  impact: text("impact").notNull(),
  status: reportStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  attachments: text("attachments").array(),
  rewardAmount: integer("reward_amount"),
  triageNotes: text("triage_notes"),
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rewardAmount: true,
  triageNotes: true,
});

// Comments on reports
export const reportComments = pgTable("report_comments", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id").notNull().references(() => reports.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReportCommentSchema = createInsertSchema(reportComments).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Program = typeof programs.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
export type ReportComment = typeof reportComments.$inferSelect;
export type InsertReportComment = z.infer<typeof insertReportCommentSchema>;
