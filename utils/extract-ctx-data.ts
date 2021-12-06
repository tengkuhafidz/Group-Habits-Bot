import { Context } from "grammy";

export const extractUserId = (ctx: Context) => ctx.from?.id as number
export const extractGroupId = (ctx: Context) => ctx.chat?.id as number

export const extractFullname = (ctx: Context) => {
    const firstName = ctx.from?.first_name ? `${ctx.from?.first_name} ` : "";
    const lastName = ctx.from?.last_name ?? ""

    return (firstName+lastName).trim();
}