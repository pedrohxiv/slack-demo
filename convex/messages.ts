import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { Doc, Id } from "./_generated/dataModel";
import { mutation, query, QueryCtx } from "./_generated/server";

const populateThread = async (ctx: QueryCtx, messageId: any) => {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) =>
      q.eq("parentMessageId", messageId)
    )
    .collect();

  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
      name: "",
    };
  }

  const lastMessage = messages[messages.length - 1];

  const lastMessageMember = await ctx.db.get(lastMessage.memberId);

  if (!lastMessageMember) {
    return {
      count: messages.length,
      image: undefined,
      timestamp: 0,
      name: "",
    };
  }

  const lastMessageUser = await ctx.db.get(lastMessageMember.userId);

  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestamp: lastMessage._creationTime,
    name: lastMessageUser?.name,
  };
};

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
    });

    return messageId;
  },
});

export const get = query({
  args: {
    channelId: v.optional(v.string()),
    conversationId: v.optional(v.string()),
    parentMessageId: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
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

    const results = await ctx.db
      .query("messages")
      .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
        q
          .eq("channelId", args.channelId as Id<"channels">)
          .eq("parentMessageId", args.parentMessageId as Id<"messages">)
          .eq("conversationId", _conversationId as Id<"conversations">)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...results,
      page: (
        await Promise.all(
          results.page.map(async (message) => {
            const member = await ctx.db.get(message.memberId);

            const user = member ? await ctx.db.get(member.userId) : null;

            if (!member || !user) {
              return null;
            }

            const reactions = await ctx.db
              .query("reactions")
              .withIndex("by_message_id", (q) => q.eq("messageId", message._id))
              .collect();

            const thread = await populateThread(ctx, message._id);

            const image = message.image
              ? await ctx.storage.getUrl(message.image)
              : undefined;

            const reactionsWithCounts = reactions.map((reaction) => ({
              ...reaction,
              count: reactions.filter((r) => r.value === reaction.value).length,
            }));

            const dedupedReactions = reactionsWithCounts.reduce(
              (acc, reaction) => {
                const existingReaction = acc.find(
                  (r) => r.value === reaction.value
                );

                if (existingReaction) {
                  existingReaction.memberIds = Array.from(
                    new Set([...existingReaction.memberIds, reaction.memberId])
                  );
                } else {
                  acc.push({ ...reaction, memberIds: [reaction.memberId] });
                }

                return acc;
              },
              [] as (Doc<"reactions"> & {
                count: number;
                memberIds: Id<"members">[];
              })[]
            );

            const reactionsWithoutMemberIdProperty = dedupedReactions.map(
              ({ memberId, ...rest }) => rest
            );

            return {
              ...message,
              image,
              member,
              user,
              reactions: reactionsWithoutMemberIdProperty,
              threadCount: thread.count,
              threadImage: thread.image,
              threadTimestamp: thread.timestamp,
              threadName: thread.name,
            };
          })
        )
      ).filter(
        (message): message is NonNullable<typeof message> => message !== null
      ),
    };
  },
});

export const getById = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const message = await ctx.db.get(args.id as Id<"messages">);

    if (!message) {
      return null;
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q
          .eq("workspaceId", message.workspaceId as Id<"workspaces">)
          .eq("userId", userId)
      )
      .unique();

    if (!currentMember) {
      return null;
    }

    const member = await ctx.db.get(message.memberId);

    if (!member) {
      return null;
    }

    const user = await ctx.db.get(member.userId);

    if (!user) {
      return null;
    }

    const reactions = await ctx.db
      .query("reactions")
      .withIndex("by_message_id", (q) => q.eq("messageId", message._id))
      .collect();

    const reactionsWithCounts = reactions.map((reaction) => ({
      ...reaction,
      count: reactions.filter((r) => r.value === reaction.value).length,
    }));

    const dedupedReactions = reactionsWithCounts.reduce(
      (acc, reaction) => {
        const existingReaction = acc.find((r) => r.value === reaction.value);

        if (existingReaction) {
          existingReaction.memberIds = Array.from(
            new Set([...existingReaction.memberIds, reaction.memberId])
          );
        } else {
          acc.push({ ...reaction, memberIds: [reaction.memberId] });
        }

        return acc;
      },
      [] as (Doc<"reactions"> & {
        count: number;
        memberIds: Id<"members">[];
      })[]
    );

    const reactionsWithoutMemberIdProperty = dedupedReactions.map(
      ({ memberId, ...rest }) => rest
    );

    return {
      ...message,
      image: message.image
        ? await ctx.storage.getUrl(message.image)
        : undefined,
      member,
      user,
      reactions: reactionsWithoutMemberIdProperty,
    };
  },
});

export const update = mutation({
  args: {
    id: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.id as Id<"messages">);

    if (!message) {
      throw new Error("Message not found");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q
          .eq("workspaceId", message.workspaceId as Id<"workspaces">)
          .eq("userId", userId)
      )
      .unique();

    if (!member || member._id !== message.memberId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id as Id<"messages">, {
      body: args.body,
      updatedAt: Date.now(),
    });

    return args.id as Id<"messages">;
  },
});

export const remove = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.id as Id<"messages">);

    if (!message) {
      throw new Error("Message not found");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q
          .eq("workspaceId", message.workspaceId as Id<"workspaces">)
          .eq("userId", userId)
      )
      .unique();

    if (!member || member._id !== message.memberId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.id as Id<"messages">);

    return args.id as Id<"messages">;
  },
});
