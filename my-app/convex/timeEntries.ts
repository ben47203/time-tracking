import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

export const getByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("timeEntries")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .unique();
  },
});

export const getDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("timeEntries")
      .withIndex("by_date", (q) =>
        q.gte("date", args.startDate).lte("date", args.endDate),
      )
      .collect();
  },
});

export const upsertDay = mutation({
  args: {
    date: v.string(),
    codes: v.array(v.number()),
    labels: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existing = await ctx.db
      .query("timeEntries")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        codes: args.codes,
        labels: args.labels,
      });
    } else {
      await ctx.db.insert("timeEntries", {
        date: args.date,
        codes: args.codes,
        labels: args.labels,
      });
    }
  },
});
