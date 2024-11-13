import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.string()),
    workspaceId: v.string(),
    channelId: v.optional(v.string()),
    conversationId: v.optional(v.string()),
    parentMessageId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
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
      throw new Error("Unauthorized");
    }

    let _conversationId = args.conversationId;

    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(
        args.parentMessageId as Id<"messages">
      );

      if (!parentMessage) {
        throw new Error("Parent message not found");
      }

      _conversationId = parentMessage.conversationId;
    }

    const messageId = await ctx.db.insert("messages", {
      body: args.body,
      image: args.image as Id<"_storage">,
      memberId: member._id,
      workspaceId: args.workspaceId as Id<"workspaces">,
      channelId: args.channelId as Id<"channels">,
      conversationId: _conversationId as Id<"conversations">,
      parentMessageId: args.parentMessageId as Id<"messages">,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});
