import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  timeEntries: defineTable({
    date: v.string(),
    codes: v.array(v.number()),
    labels: v.array(v.string()),
  }).index("by_date", ["date"]),
});
