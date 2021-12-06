import { Context } from "grammy";
import { insertGroupUser, upsertUser } from "../repository/user";
import { User } from "../types";
import { extractFullname, extractUserId } from "../utils/extract-ctx-data";

export const upsertGroupUser = async (ctx: Context) => {
    const user = getUserData(ctx);
    upsertUser(user);

    await insertGroupUser({
      groupId: ctx.chat?.id as number,
      userId: user.id
    })
}


const getUserData = (ctx: Context): User => {

  return {
    id: extractUserId(ctx),
    name: extractFullname(ctx),
    username: ctx.from?.username as string, 
  }
}