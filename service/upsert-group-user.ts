import { Context } from "grammy";
import { insertGroupUser, upsertUser } from "../repository/user";
import { User } from "../types";

export const upsertGroupUser = async (ctx: Context) => {
    const user = getUserData(ctx);
    upsertUser(user);

    await insertGroupUser({
      groupId: ctx.chat?.id as number,
      userId: user.id
    })
}


const getUserData = (ctx: Context): User => {
  const firstName = ctx.from?.first_name ? `${ctx.from?.first_name} ` : "";
  const lastName = ctx.from?.last_name ?? ""
  const fullName = (firstName+lastName).trim();

  return {
    id: ctx.from?.id as number,
    name: fullName,
    username: ctx.from?.username as string, 
  }
}