import { getAuthUserId } from "@convex-dev/auth/server";

import { query } from "./_generated/server";

export const current = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);

    return user;
  },
});