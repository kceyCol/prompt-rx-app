import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // Clerk user_id
  email: text("email").notNull(),
  name: text("name"),
  specialty: text("specialty"),
  experienceYears: integer("experience_years"),
  toneOfVoice: text("tone_of_voice").default("professional"),
  hospitalContext: text("hospital_context"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const clinicalCases = sqliteTable("clinical_cases", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  patientAge: integer("patient_age"),
  patientGender: text("patient_gender"),
  rawNotes: text("raw_notes").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const soapEvolutions = sqliteTable("soap_evolutions", {
  id: text("id").primaryKey(),
  caseId: text("case_id").notNull().references(() => clinicalCases.id),
  subjective: text("subjective").notNull(),
  objective: text("objective").notNull(),
  assessment: text("assessment").notNull(),
  plan: text("plan").notNull(),
  fullMarkdown: text("full_markdown").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
