import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";

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
