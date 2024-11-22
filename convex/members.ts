import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";

export const get = query({
  args: {
    workspaceId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q
          .eq("workspaceId", args.workspaceId as Id<"workspaces">)
          .eq("userId", userId)
      )
      .unique();

    if (!member) {
      return [];
    }

    const data = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId as Id<"workspaces">)
      )
      .collect();

    const members = [];

    for (const member of data) {
      const user = await ctx.db.get(member.userId);

      if (user) {
        members.push({ ...member, user });
      }
    }

    return members;
  },
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = await ctx.db.get(args.id as Id<"members">);

    if (!member) {
      return null;
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q
          .eq("workspaceId", member.workspaceId as Id<"workspaces">)
          .eq("userId", userId)
      )
      .unique();

    if (!currentMember) {
      return null;
    }

    const user = await ctx.db.get(member.userId);

    if (!user) {
      return null;
    }

    return { ...member, user };
  },
});

export const current = query({
  args: { workspaceId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q
          .eq("workspaceId", args.workspaceId as Id<"workspaces">)
          .eq("userId", userId)
      )
      .unique();

    if (!member) {
      return null;
    }

    return member;
  },
});
