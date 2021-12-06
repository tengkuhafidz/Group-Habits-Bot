import { Context, InlineKeyboard } from "grammy";
import { insertHabit } from "../repository/habit";
import { Habit, HabitType } from "../types";
import { upsertGroupUser } from "./upsert-group-user";

let newHabitName: string;
let addHabitMessageHeading: string;

/* -------------------------------------------------------------------------- */
/*                      #1 - Prompt for Habit Name & Type                     */
/* -------------------------------------------------------------------------- */

export const promptForHabit = async (ctx: Context) => {
  newHabitName = ctx.match as string;

  if (!newHabitName) {
    await promptHabitName(ctx);
    // TODO: work on this flow
    return;
  }
  
  addHabitMessageHeading = `New Habit: *${newHabitName}*\n\n`;
  await promptHabitType(ctx);
}

const promptHabitName = async (ctx: Context) => {
  await ctx.reply("What habit would you like to add?", {
    reply_markup: { force_reply: true },
  });
  //TODO: handle replying to this message to continue the flow
};
  
const promptHabitType = (ctx: any) => {
  const message = `${addHabitMessageHeading}Who is this for?`;

  const inlineKeyboard = new InlineKeyboard()
    .text(HabitType.Myself)
    .row()
    .text(HabitType.Everyone)
    .row()
    .text(HabitType.Anyone)
    .row();

  ctx.reply(message, {
    reply_markup: inlineKeyboard,
    parse_mode: "MarkdownV2",
  });
};
  
/* -------------------------------------------------------------------------- */
/*                    #2 - Respond to Habit Type selection                    */
/* -------------------------------------------------------------------------- */

  export const addNewHabitRecord = async (ctx: Context) => {
    await upsertGroupUser(ctx);
    await insertHabit(getHabitData(ctx))
  }
  
  const getHabitData = (ctx: Context): Habit => (
    {
      name: newHabitName,
      type: ctx.callbackQuery?.data as unknown as HabitType,
      groupId: ctx.chat?.id as number,
      createdBy: ctx.from?.id as number,
    }
  )
  
  export const displaySuccessMessage = async (ctx: any) => {
    await ctx.answerCallbackQuery({
      text: "Habit added successfully!",
    });
  
    ctx.editMessageText(
      `${addHabitMessageHeading}Added to the list\\!`,
      { parse_mode: "MarkdownV2" }
    );
  }
  